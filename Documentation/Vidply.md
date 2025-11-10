# VidPly Integration

MP Core integrates [VidPly](https://github.com/MatthiasPeltzer/vidply) v1.0.10, a WCAG 2.1 AA compliant media player for accessible audio and video playback. All player options are configurable through the TYPO3 backend.

## Backend Features

### Audio Content Element

When editing an audio content element, editors now have access to these tabs:

#### **Audio Tab**
- Audio file upload
- Poster image for audio player

#### **Playback Options Tab**
- **Autoplay**: Start playing automatically on page load
- **Loop**: Repeat playback continuously
- **Muted**: Start with audio muted
- **Volume**: Set initial volume (0.0 to 1.0)
- **Playback Speed**: Choose from 0.25x to 2.0x speed
- **Start Time**: Begin playback at specific second

#### **Controls Tab**
- **Show Controls**: Enable/disable player controls
- **Show Speed Button**: Toggle playback speed control
- **Show Volume Control**: Toggle volume slider

#### **Captions Tab**
- **Caption Files**: Upload multiple VTT caption files
- **Enable Captions**: Toggle caption functionality
- **Show Captions by Default**: Auto-display captions on load
- **Show Captions Button**: Toggle CC button
- **Show Caption Style Button**: Toggle caption styling menu (font, size, color)

#### **Transcript Tab**
- **Enable Transcript**: Show interactive transcript panel
- **Show Transcript Button**: Toggle transcript button

#### **Accessibility Tab**
- **Enable Keyboard Shortcuts**: Allow keyboard control
- **Enable Screen Reader Announcements**: ARIA announcements for screen readers
- **Player Language**: Choose UI language (English, German, Spanish, French, Japanese)

---

### Video Content Element

When editing a video content element, editors have all audio options PLUS:

#### **Additional Controls** (in Controls Tab)
- **Show Fullscreen Button**: Toggle fullscreen control
- **Show Picture-in-Picture Button**: Toggle PiP control
- **Show Chapters Button**: Toggle chapter navigation (requires chapter VTT files)
- **Show Quality Button**: Toggle quality selection (for HLS streams)

#### **Audio Description Tab**
- **Audio Described Version**: Upload alternate video with audio descriptions
- **Show Audio Description Button**: Toggle AD button

#### **Sign Language Tab**
- **Sign Language Video**: Upload sign language interpreter video
- **Sign Language Position**: Choose overlay position (bottom-right, bottom-left, top-right, top-left)
- **Show Sign Language Button**: Toggle sign language button

## Frontend Implementation

### Data Attributes Generated

The templates automatically generate Vidply data attributes based on TCA field values:

```html
<!-- Example Audio Element -->
<audio
    data-vidply
    src="audio.mp3"
    data-autoplay="true"
    data-loop="true"
    data-volume="0.8"
    data-playback-speed="1.5"
    data-language="de"
    data-captions="true"
    data-transcript="true"
>
    <track kind="captions" src="captions-de.vtt" srclang="de" label="Deutsch">
    <track kind="captions" src="captions-en.vtt" srclang="en" label="English">
</audio>
```

```html
<!-- Example Video Element -->
<video
    data-vidply
    src="video.mp4"
    data-autoplay="true"
    data-muted="true"
    data-controls="true"
    data-fullscreen-button="true"
    data-pip-button="true"
    data-transcript="true"
    data-sign-language-src="sign-language.mp4"
    data-sign-language-position="bottom-right"
    data-audio-description-src="audio-described.mp4"
>
    <track kind="captions" src="captions.vtt" srclang="de" label="Deutsch">
    <track kind="chapters" src="chapters.vtt" srclang="de" label="Chapters">
</video>
```

## Database Schema

Database fields are defined in `ext_tables.sql` and automatically created during installation. Run the TYPO3 Database Analyzer after installation to apply schema changes.

## Usage Examples

### Example 1: Accessible Audio with Transcript

In the backend:
1. Create an Audio content element
2. Upload your MP3 file
3. Upload a VTT caption file with lyrics
4. **Playback Options Tab**: Set Volume to 0.6
5. **Captions Tab**: Enable "Show Captions by Default"
6. **Transcript Tab**: Enable "Enable Transcript"
7. **Accessibility Tab**: Set language to "Deutsch"

Result: Audio player with visible captions, interactive transcript, and German UI.

### Example 2: Autoplay Video with Sign Language

In the backend:
1. Create a Video content element
2. Upload your MP4 video
3. **Playback Options Tab**: Enable "Autoplay" and "Muted" (required for autoplay)
4. **Sign Language Tab**: Upload sign language interpreter video
5. **Sign Language Tab**: Set position to "Bottom Right"
6. **Controls Tab**: Enable all buttons

Result: Video auto-plays muted with sign language overlay in bottom-right corner.

### Example 3: Educational Video with Audio Description

In the backend:
1. Create a Video content element
2. Upload main video
3. Upload multiple caption files (German, English)
4. **Audio Description Tab**: Upload audio-described version
5. **Controls Tab**: Enable "Show Chapters Button"
6. Upload chapter VTT file
7. **Accessibility Tab**: Enable all options

Result: Fully accessible video with multi-language captions, audio descriptions, chapter navigation, and keyboard controls.

## Vidply Data Attribute Reference

### Playback
- `data-autoplay` - Auto-start playback
- `data-loop` - Loop continuously
- `data-muted` - Start muted
- `data-volume` - Volume level (0-1)
- `data-playback-speed` - Playback speed (0.25-2.0)
- `data-start-time` - Start position in seconds

### Controls
- `data-controls` - Show/hide controls
- `data-speed-button` - Speed control button
- `data-volume-control` - Volume slider
- `data-fullscreen-button` - Fullscreen button (video only)
- `data-pip-button` - Picture-in-Picture button (video only)
- `data-chapters-button` - Chapter navigation
- `data-quality-button` - Quality selector (HLS)

### Captions
- `data-captions` - Enable captions
- `data-captions-default` - Show on load
- `data-captions-button` - CC button
- `data-caption-style-button` - Caption style menu

### Accessibility
- `data-transcript` - Enable transcript
- `data-transcript-button` - Transcript toggle
- `data-audio-description-src` - URL to audio-described video
- `data-audio-description-button` - AD toggle button
- `data-sign-language-src` - URL to sign language video
- `data-sign-language-position` - Overlay position
- `data-sign-language-button` - Sign language toggle
- `data-keyboard` - Enable keyboard shortcuts
- `data-screen-reader-announcements` - Enable ARIA announcements
- `data-language` - UI language (en, de, es, fr, ja)

## Keyboard Shortcuts (Default)

When keyboard navigation is enabled:
- **Space / P / K**: Play/Pause
- **F**: Fullscreen
- **M**: Mute/Unmute
- **↑ / ↓**: Volume Up/Down
- **← / →**: Seek -10s / +10s
- **C**: Toggle Captions
- **A**: Caption Style Menu
- **< / >**: Decrease/Increase Speed
- **S**: Speed Menu
- **Q**: Quality Menu
- **J**: Chapters Menu
- **T**: Toggle Transcript

## Adding German Translations

To add German translations, create or edit:
`Resources/Private/Language/de.locallang_db.xlf`

Example structure:
```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file source-language="en" target-language="de" datatype="plaintext" original="EXT:mp_core/Resources/Private/Language/locallang_db.xlf">
    <body>
      <trans-unit id="tt_content.tx_audio_autoplay">
        <source>Autoplay</source>
        <target>Automatische Wiedergabe</target>
      </trans-unit>
      <trans-unit id="tt_content.tx_audio_loop">
        <source>Loop</source>
        <target>Schleife</target>
      </trans-unit>
      <!-- Add more translations... -->
    </body>
  </file>
</xliff>
```

## Technical Details

### Implementation Files

- **TCA**: `Configuration/TCA/Overrides/tt_content_audio.php`, `tt_content_video.php`
- **Templates**: `Resources/Private/Templates/Content/Audio.html`, `Video.html`
- **Database Schema**: `ext_tables.sql`
- **Styles**: `Build/Assets/Scss/vidply.scss` → `Resources/Public/StyleSheets/vidply.css`
- **Scripts**: `Build/Assets/Scripts/vidply.js` → `Resources/Public/JavaScripts/vidply.js`

### Data Attribute Mapping

VidPly is initialized via `data-vidply-options` JSON attribute containing all player configuration. The Fluid templates automatically map TCA fields to VidPly options.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Player not initializing | Verify `vidply.js` and `vidply.css` are loaded |
| Caption files not showing | Check VTT file format and `tx_track_kind` field |
| External audio/video not working | Configure allowed domains in Extension Configuration |
| Options not applying | Clear TYPO3 frontend cache |

## Further Reading

- [VidPly Documentation](https://github.com/MatthiasPeltzer/vidply)
- [TCA Overview](TCA-Overview.md) - Content element configuration
- [TYPO3 Configuration](TYPO3-Configuration.md) - Site Sets and Settings
- [TYPO3 File Abstraction Layer](https://docs.typo3.org/m/typo3/reference-coreapi/main/en-us/ApiOverview/Fal/)

