<?php

declare(strict_types=1);

namespace Mpc\MpCore\Seo;

use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\DependencyInjection\Attribute\Autoconfigure;
use TYPO3\CMS\Core\Attribute\AsAllowedCallable;
use TYPO3\CMS\Core\Http\PropagateResponseException;
use TYPO3\CMS\Core\Routing\PageArguments;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\Directive;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\HashValue;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\Mutation;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\MutationCollection;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\MutationMode;
use TYPO3\CMS\Core\Security\ContentSecurityPolicy\PolicyRegistry;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\TypoScript\AST\Node\ChildNodeInterface;
use TYPO3\CMS\Core\TypoScript\FrontendTypoScript;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3\CMS\Core\View\ViewFactoryData;
use TYPO3\CMS\Core\View\ViewFactoryInterface;
use TYPO3\CMS\Core\View\ViewInterface;
use TYPO3\CMS\Frontend\Controller\ErrorController;
use TYPO3\CMS\Seo\XmlSitemap\Exception\InvalidConfigurationException;
use TYPO3\CMS\Seo\XmlSitemap\XmlSitemapDataProviderInterface;

/**
 * Renders EXT:seo XML sitemaps and assigns site metadata for the mp-core XSL browser view.
 *
 * Compatible with TYPO3 13.4 and 14.x (uses filesystem XSL paths, not SystemResource).
 */
#[Autoconfigure(public: true)]
final readonly class XmlSitemapRenderer
{
    public function __construct(
        private TypoScriptService $typoScriptService,
        private ErrorController $errorController,
        private ViewFactoryInterface $viewFactory,
        private PolicyRegistry $policyRegistry,
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
        $configurationArrayWithoutDots = $this->resolvePluginConfiguration($request);
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
        $view->assign('type', $this->resolvePageType($request));
        $view->assign('sitemapType', $sitemapType);
        $configConfiguration = $configurationArrayWithoutDots['config'] ?? [];

        $sitemapName = $this->resolveSitemapNameFromRequest($request);
        if ($sitemapName !== null && $sitemapName !== '') {
            $xslPath = $this->getXslFilePath($configConfiguration, $sitemapType, $sitemapName);
            $this->applyDynamicContentSecurityPolicy($xslPath);
            $view->assign('xslFile', $this->getUriFromFilePath($xslPath));

            return $this->renderPartialSitemap($request, $view, $configConfiguration, $sitemapType, $sitemapName);
        }

        $xslPath = $this->getXslFilePath($configConfiguration, $sitemapType);
        $this->applyDynamicContentSecurityPolicy($xslPath);
        $view->assign('xslFile', $this->getUriFromFilePath($xslPath));

        return $this->renderCombinedSitemap($request, $view, $configConfiguration, $sitemapType);
    }

    /**
     * @return array<int|string, mixed>
     */
    private function resolvePluginConfiguration(ServerRequestInterface $request): array
    {
        $frontendTypoScript = $request->getAttribute('frontend.typoscript');
        if (!$frontendTypoScript instanceof FrontendTypoScript) {
            throw new \RuntimeException('Missing frontend TypoScript for XML sitemap rendering.', 1710000010);
        }

        $pluginNode = $frontendTypoScript->getSetupTree()->getChildByName('plugin');
        if (!$pluginNode instanceof ChildNodeInterface) {
            throw new \RuntimeException('Missing plugin TypoScript for XML sitemap rendering.', 1710000011);
        }

        $settingsTree = $pluginNode->getChildByName('tx_seo');
        if (!$settingsTree instanceof ChildNodeInterface) {
            throw new \RuntimeException('Missing plugin.tx_seo TypoScript for XML sitemap rendering.', 1710000012);
        }

        $settingsArray = $settingsTree->toArray();
        if (!is_array($settingsArray)) {
            throw new \RuntimeException('Invalid plugin.tx_seo TypoScript for XML sitemap rendering.', 1710000013);
        }

        return $this->typoScriptService->convertTypoScriptArrayToPlainArray($settingsArray);
    }

    private function resolvePageType(ServerRequestInterface $request): int
    {
        $routing = $request->getAttribute('routing');
        if ($routing instanceof PageArguments) {
            return (int)$routing->getPageType();
        }

        return 0;
    }

    private function resolveSitemapNameFromRequest(ServerRequestInterface $request): ?string
    {
        $queryParams = $request->getQueryParams();
        $seoParams = $queryParams['tx_seo'] ?? null;
        if (is_array($seoParams) && !empty($seoParams['sitemap'])) {
            return (string)$seoParams['sitemap'];
        }

        if (!empty($queryParams['sitemap'])) {
            return (string)$queryParams['sitemap'];
        }

        return null;
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
     */
    private function getXslFilePath(array $configConfiguration, string $sitemapType, ?string $sitemapName = null): string
    {
        $path = $configConfiguration[$sitemapType]['sitemaps'][$sitemapName ?? '']['config']['xslFile']
            ?? $configConfiguration[$sitemapType]['sitemaps']['xslFile']
            ?? $configConfiguration['xslFile']
            ?? 'EXT:mp_core/Resources/Public/Seo/Sitemap.xsl';

        return GeneralUtility::getFileAbsFileName((string)$path);
    }

    private function getUriFromFilePath(string $filePath): string
    {
        return PathUtility::getAbsoluteWebPath($filePath);
    }

    private function applyDynamicContentSecurityPolicy(string $xslPath): void
    {
        if (!is_file($xslPath)) {
            return;
        }

        $dom = new \DOMDocument();
        $dom->load($xslPath);

        $hashes = [];
        foreach ($dom->getElementsByTagName('style') as $node) {
            if (!$node instanceof \DOMElement || $node->getAttribute('type') !== 'text/css') {
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
