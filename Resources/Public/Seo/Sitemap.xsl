<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                version="1.0">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

    <xsl:variable name="metaComment" select="/comment()[contains(., 'mpcSitemapMeta ')][1]"/>
    <xsl:variable name="metaPayload" select="normalize-space(substring-after($metaComment, 'mpcSitemapMeta '))"/>
    <xsl:variable name="websiteTitle" select="normalize-space(substring-before(concat($metaPayload, ' :: '), ' :: '))"/>
    <xsl:variable name="languageTitle" select="normalize-space(substring-after($metaPayload, ' :: '))"/>

    <xsl:template name="titleText">
        <xsl:choose>
            <xsl:when test="string-length($websiteTitle) &gt; 0">
                <xsl:value-of select="concat('XML Sitemap - ', $websiteTitle)"/>
            </xsl:when>
            <xsl:otherwise>XML Sitemap</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
            <head>
                <title>
                    <xsl:call-template name="titleText"/>
                </title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="robots" content="noindex" />
                <style type="text/css">
                    body {
                        font-family: system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        line-height: 1.45;
                        color: #333;
                        background: #f6f7f9;
                        margin: 0;
                        padding: 2rem 1rem;
                    }
                    #content {
                        margin: 0 auto;
                        max-width: 1100px;
                        background: #fff;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 1.5rem 1.75rem 2rem;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
                    }
                    h1 {
                        font-size: 1.5rem;
                        margin: 0 0 0.35rem;
                    }
                    .subtitle {
                        color: #666;
                        margin: 0 0 1.25rem;
                    }
                    table {
                        border: none;
                        border-collapse: collapse;
                        width: 100%;
                    }
                    #sitemap tr:nth-child(odd) td {
                        background-color: #f9fafb;
                    }
                    #sitemap tbody tr:hover td {
                        background-color: #eef2f7;
                    }
                    #sitemap tbody tr:hover td, #sitemap tbody tr:hover td a {
                        color: #000;
                    }
                    .expl {
                        margin: 0 0 1rem;
                        color: #555;
                    }
                    a {
                        color: #0a406e;
                        text-decoration: none;
                        word-break: break-all;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    td, th {
                        font-size: 12px;
                        vertical-align: top;
                        padding: 0.45rem 0.5rem;
                    }
                    th {
                        text-align: left;
                        border-bottom: 2px solid #333;
                    }
                    .footer {
                        margin-top: 1.25rem;
                        font-size: 12px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div id="content">
                    <h1>
                        <xsl:call-template name="titleText"/>
                    </h1>
                    <p class="subtitle">
                        <xsl:if test="string-length($languageTitle) &gt; 0">
                            <xsl:value-of select="$languageTitle"/>
                            <xsl:text> · </xsl:text>
                        </xsl:if>
                        <xsl:text>Machine-readable sitemap for search engines</xsl:text>
                    </p>

                    <p class="expl">
                        This URL list contains <strong><xsl:value-of select="count(/sitemap:urlset/sitemap:url)"/></strong> entries for this language (pages and news when configured).
                    </p>
                    <table id="sitemap">
                        <thead>
                            <tr>
                                <th width="55%">URL</th>
                                <th width="20%">Last modified</th>
                                <th width="15%">Change freq.</th>
                                <th width="10%">Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="/sitemap:urlset/sitemap:url">
                                <xsl:variable name="itemURL" select="normalize-space(sitemap:loc)"/>
                                <tr>
                                    <td>
                                        <a href="{$itemURL}"><xsl:value-of select="$itemURL"/></a>
                                    </td>
                                    <td>
                                        <xsl:value-of select="sitemap:lastmod"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="sitemap:changefreq"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="sitemap:priority"/>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>

                    <p class="footer">
                        Generated automatically by TYPO3 (EXT:seo). Each site language has its own sitemap at <code>/sitemap.xml</code> or <code>/&lt;language&gt;/sitemap.xml</code>.
                    </p>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
