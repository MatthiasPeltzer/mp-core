<?php

declare(strict_types=1);

namespace Mpc\MpCore\Seo;

use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\DependencyInjection\Attribute\Autoconfigure;
use TYPO3\CMS\Core\Attribute\AsAllowedCallable;
use TYPO3\CMS\Core\Http\PropagateResponseException;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\Directive;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\HashValue;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\Mutation;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\MutationCollection;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\MutationMode;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\PolicyRegistry;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\SystemResource\Exception\CanNotResolvePublicResourceException;
use TYPO3\CMS\Core\SystemResource\Exception\CanNotResolveSystemResourceException;
use TYPO3\CMS\Core\SystemResource\Exception\SystemResourceDoesNotExistException;
use TYPO3\CMS\Core\SystemResource\Publishing\SystemResourcePublisherInterface;
use TYPO3\CMS\Core\SystemResource\SystemResourceFactory;
use TYPO3\CMS\Core\SystemResource\Type\PublicResourceInterface;
use TYPO3\CMS\Core\SystemResource\Type\SystemResourceInterface;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\View\ViewFactoryData;
use TYPO3\CMS\Core\View\ViewFactoryInterface;
use TYPO3\CMS\Core\View\ViewInterface;
use TYPO3\CMS\Frontend\Controller\ErrorController;
use TYPO3\CMS\Seo\XmlSitemap\Exception\InvalidConfigurationException;
use TYPO3\CMS\Seo\XmlSitemap\XmlSitemapDataProviderInterface;

/**
 * Renders EXT:seo XML sitemaps and assigns site metadata for the mp-core XSL browser view.
 */
#[Autoconfigure(public: true)]
final readonly class XmlSitemapRenderer
{
    public function __construct(
        private TypoScriptService $typoScriptService,
        private ErrorController $errorController,
        private ViewFactoryInterface $viewFactory,
        private PolicyRegistry $policyRegistry,
        private SystemResourceFactory $resourceFactory,
        private SystemResourcePublisherInterface $resourcePublisher,
        private SitemapViewMetadataResolver $viewMetadataResolver,
        private FlatXmlSitemapAggregator $flatSitemapAggregator,
    ) {}

    /**
     * @param string $_ unused, but needed as this is called via userfunc and passes a string as first parameter
     * @param array<string, mixed> $typoScriptConfiguration TypoScript configuration specified in USER Content Object
     * @throws InvalidConfigurationException
     */
    #[AsAllowedCallable]
    public function render(string $_, array $typoScriptConfiguration, ServerRequestInterface $request): string
    {
        $settingsTree = $request->getAttribute('frontend.typoscript')->getSetupTree()->getChildByName('plugin')->getChildByName('tx_seo');
        $configurationArrayWithoutDots = $this->typoScriptService->convertTypoScriptArrayToPlainArray($settingsTree->toArray());
        $viewConfiguration = $configurationArrayWithoutDots['view'] ?? [];
        $viewFactoryData = new ViewFactoryData(
            templateRootPaths: $viewConfiguration['templateRootPaths'] ?? [],
            partialRootPaths: $viewConfiguration['partialRootPaths'] ?? [],
            layoutRootPaths: $viewConfiguration['layoutRootPaths'] ?? [],
            request: $request,
            format: 'xml',
        );
        $view = $this->viewFactory->create($viewFactoryData);
        $this->assignSiteMetadata($view, $request);

        $sitemapType = $typoScriptConfiguration['sitemapType'] ?? 'xmlSitemap';
        $view->assign('type', $request->getAttribute('routing')->getPageType());
        $view->assign('sitemapType', $sitemapType);
        $configConfiguration = $configurationArrayWithoutDots['config'] ?? [];
        if (!empty($sitemapName = ($request->getQueryParams()['tx_seo']['sitemap'] ?? null))) {
            $xslResource = $this->getXslResource($configConfiguration, $sitemapType, $sitemapName);
            $this->applyDynamicContentSecurityPolicy($xslResource);
            $view->assign('xslFile', (string)$this->resourcePublisher->generateUri($xslResource, $request));

            return $this->renderPartialSitemap($request, $view, $configConfiguration, $sitemapType, $sitemapName);
        }
        $xslResource = $this->getXslResource($configConfiguration, $sitemapType);
        $this->applyDynamicContentSecurityPolicy($xslResource);
        $view->assign('xslFile', (string)$this->resourcePublisher->generateUri($xslResource, $request));

        return $this->renderCombinedSitemap($request, $view, $configConfiguration, $sitemapType);
    }

    /**
     * @param array<string, mixed> $configConfiguration
     */
    private function renderCombinedSitemap(
        ServerRequestInterface $request,
        ViewInterface $view,
        array $configConfiguration,
        string $sitemapType
    ): string {
        $items = $this->flatSitemapAggregator->collectItems($request, $configConfiguration, $sitemapType);
        $view->assign('items', $items);

        return $view->render('Sitemap');
    }

    private function assignSiteMetadata(ViewInterface $view, ServerRequestInterface $request): void
    {
        $site = $request->getAttribute('site');
        $language = $request->getAttribute('language');
        if (!$site instanceof Site || !$language instanceof SiteLanguage) {
            return;
        }

        $websiteTitle = $this->viewMetadataResolver->resolveWebsiteTitle($site, $language);
        $languageTitle = $this->viewMetadataResolver->resolveLanguageTitle($language);
        $view->assign('websiteTitle', $websiteTitle);
        $view->assign('languageTitle', $languageTitle);
        $view->assign(
            'sitemapMetaComment',
            $this->viewMetadataResolver->formatMetaComment($websiteTitle, $languageTitle)
        );
    }

    /**
     * Legacy TYPO3 route `/sitemap-type/{name}/sitemap.xml` — single provider slice only.
     *
     * @param array<string, mixed> $configConfiguration
     */
    private function renderPartialSitemap(
        ServerRequestInterface $request,
        ViewInterface $view,
        array $configConfiguration,
        string $sitemapType,
        string $sitemapName
    ): string {
        $sitemapConfig = $configConfiguration[$sitemapType]['sitemaps'][$sitemapName] ?? null;
        if ($sitemapConfig) {
            $sitemapProvider = $sitemapConfig['provider'] ?? null;
            if (is_string($sitemapProvider)
                && class_exists($sitemapProvider)
                && is_subclass_of($sitemapProvider, XmlSitemapDataProviderInterface::class)
            ) {
                /** @var XmlSitemapDataProviderInterface $provider */
                $provider = GeneralUtility::makeInstance($sitemapProvider, $request, $sitemapName, $sitemapConfig['config'] ?? []);
                $view->assign('items', $provider->getItems());

                return $view->render('Sitemap');
            }
            throw new InvalidConfigurationException('No valid provider set for ' . $sitemapName, 1535578522);
        }
        throw new PropagateResponseException(
            $this->errorController->pageNotFoundAction(
                $request,
                'No valid configuration found for sitemap ' . $sitemapName
            ),
            1535578569
        );
    }

    /**
     * @param array<string, mixed> $configConfiguration
     *
     * @throws CanNotResolvePublicResourceException
     * @throws CanNotResolveSystemResourceException
     */
    private function getXslResource(array $configConfiguration, string $sitemapType, ?string $sitemapName = null): PublicResourceInterface&SystemResourceInterface
    {
        $resourceIdentifier = $configConfiguration[$sitemapType]['sitemaps'][$sitemapName ?? '']['config']['xslFile']
            ?? $configConfiguration[$sitemapType]['sitemaps']['xslFile']
            ?? $configConfiguration['xslFile']
            ?? 'EXT:mp_core/Resources/Public/Seo/Sitemap.xsl';
        $xslResource = $this->resourceFactory->createPublicResource($resourceIdentifier);
        if (!$xslResource instanceof SystemResourceInterface) {
            throw new \InvalidArgumentException('Can not resolve xslFile "%s" to a system resource', 1761032332);
        }

        return $xslResource;
    }

    private function applyDynamicContentSecurityPolicy(SystemResourceInterface $xslResource): void
    {
        try {
            $dom = new \DOMDocument();
            $dom->loadXML($xslResource->getContents());
        } catch (SystemResourceDoesNotExistException) {
            return;
        }
        $hashes = [];
        foreach ($dom->getElementsByTagName('style') as $node) {
            if ($node->getAttribute('type') !== 'text/css') {
                continue;
            }
            $hashes[] = HashValue::hash($node->textContent);
        }
        if ($hashes === []) {
            return;
        }
        $this->policyRegistry->appendMutationCollection(
            new MutationCollection(
                new Mutation(
                    MutationMode::Extend,
                    Directive::StyleSrcElem,
                    ...$hashes
                )
            )
        );
    }
}
