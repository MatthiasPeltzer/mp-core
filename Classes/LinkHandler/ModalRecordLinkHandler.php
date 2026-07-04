<?php

declare(strict_types=1);

namespace Mpc\MpCore\LinkHandler;

use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\DependencyInjection\Attribute\Autoconfigure;
use TYPO3\CMS\Backend\Controller\AbstractLinkBrowserController;
use TYPO3\CMS\Backend\LinkHandler\LinkHandlerInterface;
use TYPO3\CMS\Backend\LinkHandler\RecordLinkHandler;
use TYPO3\CMS\Backend\Tree\View\LinkParameterProviderInterface;
use TYPO3\CMS\Core\View\ViewInterface;

/**
 * Record link handler for ce_modal targets in the link browser.
 * Delegates to core RecordLinkHandler but omits the target field.
 */
#[Autoconfigure(public: true, shared: false)]
final class ModalRecordLinkHandler implements LinkHandlerInterface, LinkParameterProviderInterface
{
    /**
     * @var list<string>
     */
    protected array $linkAttributes = ['title', 'class'];

    public function __construct(
        private readonly RecordLinkHandler $recordLinkHandler,
    ) {}

    public function getLinkAttributes(): array
    {
        return $this->linkAttributes;
    }

    public function modifyLinkAttributes(array $fieldDefinitions): array
    {
        unset($fieldDefinitions['target']);

        return $this->recordLinkHandler->modifyLinkAttributes($fieldDefinitions);
    }

    public function initialize(AbstractLinkBrowserController $linkBrowser, $identifier, array $configuration): void
    {
        $this->recordLinkHandler->initialize($linkBrowser, $identifier, $configuration);
    }

    public function canHandleLink(array $linkParts): bool
    {
        return $this->recordLinkHandler->canHandleLink($linkParts);
    }

    public function formatCurrentUrl(): string
    {
        return $this->recordLinkHandler->formatCurrentUrl();
    }

    public function render(ServerRequestInterface $request): string
    {
        return $this->recordLinkHandler->render($request);
    }

    public function isUpdateSupported(): bool
    {
        return $this->recordLinkHandler->isUpdateSupported();
    }

    public function getBodyTagAttributes(): array
    {
        return $this->recordLinkHandler->getBodyTagAttributes();
    }

    public function getUrlParameters(array $values): array
    {
        return $this->recordLinkHandler->getUrlParameters($values);
    }

    public function setView(ViewInterface $view): void
    {
        $this->recordLinkHandler->setView($view);
    }
}
