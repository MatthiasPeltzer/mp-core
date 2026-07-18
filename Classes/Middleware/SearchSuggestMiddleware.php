<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Middleware;

use Mpc\MpCore\Search\SearchSuggestService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

/**
 * Answers autosuggest requests for the indexed_search frontend as JSON.
 *
 * Triggered whenever the `tx_mpcore_suggest` query parameter is present; the
 * request is then short-circuited before the (expensive) page rendering runs.
 * Placed after frontend user authentication so access filtering in
 * SearchSuggestService can honour the current user's group list.
 */
final class SearchSuggestMiddleware implements MiddlewareInterface
{
    private const TRIGGER_PARAMETER = 'tx_mpcore_suggest';

    public function __construct(
        private readonly SearchSuggestService $suggestService,
    ) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $queryParams = $request->getQueryParams();
        if (!isset($queryParams[self::TRIGGER_PARAMETER])) {
            return $handler->handle($request);
        }

        $site = $request->getAttribute('site');
        if (!$site instanceof Site) {
            return $handler->handle($request);
        }

        $language = $request->getAttribute('language');
        $languageId = $language instanceof SiteLanguage ? $language->getLanguageId() : 0;

        $term = trim((string)($queryParams['q'] ?? ''));
        $result = $this->suggestService->suggest($term, $site->getRootPageId(), $languageId);

        $suggestions = [];
        foreach ($result['words'] as $word) {
            $suggestions[] = [
                'type' => 'word',
                'label' => $word,
                'query' => $word,
            ];
        }
        foreach ($result['pages'] as $page) {
            $url = $this->buildPageUrl($site, $page);
            if ($url === null) {
                continue;
            }
            $suggestions[] = [
                'type' => 'page',
                'label' => $page['title'],
                'url' => $url,
            ];
        }

        $response = new JsonResponse([
            'query' => $term,
            'suggestions' => $suggestions,
        ]);

        return $response->withHeader('Cache-Control', 'no-cache, private');
    }

    /**
     * @param array{
     *     title: string,
     *     pageId: int,
     *     pageType: int,
     *     mountPoint: string,
     *     staticPageArguments: array<string, mixed>,
     *     languageId: int
     * } $page
     */
    private function buildPageUrl(Site $site, array $page): ?string
    {
        if ($page['pageId'] <= 0) {
            return null;
        }

        $parameters = ['_language' => $page['languageId']];

        if ($page['mountPoint'] !== '') {
            $parameters['MP'] = $page['mountPoint'];
        }

        if ($page['pageType'] > 0) {
            $parameters['type'] = (string)$page['pageType'];
        }

        if ($page['staticPageArguments'] !== []) {
            $parameters = array_replace_recursive($parameters, $page['staticPageArguments']);
        }

        try {
            return (string)$site->getRouter()->generateUri($page['pageId'], $parameters);
        } catch (\Throwable) {
            return null;
        }
    }
}
