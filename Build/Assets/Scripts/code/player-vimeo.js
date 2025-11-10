function vimeo() {
  const videoVimeoElements = document.querySelectorAll('.video-start-vimeo');

  videoVimeoElements.forEach(element => {
    element.addEventListener('click', () => {
      const vimeoContainer = element.closest('.dsgvo-vimeo');
      const videoVimeoContainer = element.closest('.video-vimeo');

      // Extract the Vimeo video ID from the data-src attribute
      const src = vimeoContainer.getAttribute('data-src');
      const vimeoId = src.split('https://vimeo.com/')[1]; // Extract the Vimeo ID

      const dataTitle = vimeoContainer.getAttribute('data-title');

      // Remove the video placeholder
      vimeoContainer.remove();

      // Insert the Vimeo iframe
      videoVimeoContainer.innerHTML += `
        <iframe
          src="https://player.vimeo.com/video/${vimeoId}?h=b74337f3a8&autoplay=1&title=0&byline=0&portrait=0"
          width="640"
          height="360"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          title="${dataTitle}"
          allowfullscreen>
        </iframe>
      `;
    });
  });
}

// Initialize the Vimeo function if any Vimeo video element exists
if (document.querySelector('.video-vimeo')) {
  vimeo();
}
