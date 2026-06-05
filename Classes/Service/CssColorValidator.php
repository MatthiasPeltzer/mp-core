<?php

declare(strict_types=1);

/*
 * This file is part of the package mpc/mp-core.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace Mpc\MpCore\Service;

/**
 * Validates a string as a syntactically safe CSS `<color>` value.
 *
 * Used at the trust boundary where site-configuration color slots are
 * interpolated into inline `<style>` blocks (Styles.html). Validation is
 * intentionally strict: only colour notations the project actually uses are
 * accepted, and ANY character that could break out of a CSS declaration
 * (`;`, `{`, `}`, `<`, `>`, newlines) is rejected.
 *
 * Trusted callers can rely on a `true` result meaning the value is safe to
 * embed without further escaping inside a CSS property value context.
 */
final class CssColorValidator
{
    private const MAX_LENGTH = 80;

    /** @var list<non-empty-string> */
    private const NAMED_COLORS = [
        'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige',
        'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown',
        'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral',
        'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan',
        'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki',
        'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
        'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray',
        'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue',
        'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite',
        'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod',
        'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink',
        'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush',
        'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
        'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
        'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue',
        'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow',
        'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine',
        'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
        'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
        'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin',
        'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange',
        'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
        'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum',
        'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue',
        'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna',
        'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
        'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato',
        'transparent', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke',
        'yellow', 'yellowgreen', 'currentcolor', 'inherit', 'initial', 'unset',
        'revert', 'revert-layer',
    ];

    public static function isValid(string $value): bool
    {
        $value = trim($value);
        if ($value === '' || strlen($value) > self::MAX_LENGTH) {
            return false;
        }

        // Hard reject: any byte that would let an attacker close the current
        // CSS declaration, statement, or <style> tag, or smuggle a comment.
        if (preg_match('/[;{}<>\r\n\t\0]|\/\*|\*\//', $value) === 1) {
            return false;
        }

        $lower = strtolower($value);

        if (in_array($lower, self::NAMED_COLORS, true)) {
            return true;
        }

        // #RGB, #RGBA, #RRGGBB, #RRGGBBAA
        if (preg_match('/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i', $value) === 1) {
            return true;
        }

        // rgb()/rgba()/hsl()/hsla() in modern or legacy syntax.
        // Numbers, %, /, spaces, commas, decimal points and a leading minus only.
        if (preg_match('/^(rgb|rgba|hsl|hsla)\(\s*[0-9a-z\s,.\/%+\-]+\s*\)$/i', $value) === 1) {
            return true;
        }

        return false;
    }
}
