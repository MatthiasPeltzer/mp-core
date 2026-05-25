<?php

declare(strict_types=1);

namespace Mpc\MpCore\Enum;

/**
 * Optional second Schema.org entity in the JSON-LD @graph (besides publisher/WebSite).
 */
enum StructuredDataExtraEntityType: string
{
    case None = 'none';
    case MusicGroup = 'MusicGroup';
    case MusicPerson = 'MusicPerson';
    case PerformingGroup = 'PerformingGroup';
    case LocalBusiness = 'LocalBusiness';
    case NGO = 'NGO';

    /**
     * Schema.org property for comma-separated topics from site settings.
     * Music types use genre; other entity types use knowsAbout.
     */
    public function keywordsSchemaProperty(): ?string
    {
        return match ($this) {
            self::MusicGroup, self::MusicPerson => 'genre',
            self::PerformingGroup, self::LocalBusiness, self::NGO => 'knowsAbout',
            default => null,
        };
    }
}
