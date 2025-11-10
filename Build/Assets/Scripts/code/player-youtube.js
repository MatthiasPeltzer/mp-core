function youtube() {
  const videoTubeElements = document.querySelectorAll('.video-start-youtube');

  videoTubeElements.forEach(element => {
    element.addEventListener('click', () => {
      const videoTube = element.closest('.dsgvo-youtube');
      const videoYouTube = element.closest('.video-youtube');

      // Get the video URL and extract the video ID
      const src = videoTube.getAttribute('data-src');
      const url = new URL(src);
      const srcID = url.searchParams.get('v'); // Extract the YouTube video ID

      const dataTitle = videoTube.getAttribute('data-title');

      // Remove the videoTube container
      videoTube.remove();

      // Append the iframe with YouTube video
      videoYouTube.innerHTML += `
        <iframe
          src="https://www.youtube-nocookie.com/embed/${srcID}?autoplay=1&autohide=1&controls=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}"
          allowfullscreen
          width="1920"
          height="1080"
          class="video-embed-item"
          title="${dataTitle}"
          allow="fullscreen"
          style="max-width: 100%; height: auto; aspect-ratio: 16/9;">
        </iframe>
      `;
    });
  });
}

// Initialize the youtube function if any YouTube video element exists
if (document.querySelector('.video-youtube')) {
  youtube();
}

