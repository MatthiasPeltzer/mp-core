function soundcloud() {
  const audioStartElements = document.querySelectorAll('.audio-start');

  audioStartElements.forEach(element => {
    element.addEventListener('click', () => {
      const dsgvoContainer = element.closest('.dsgvo');
      const playerWrapper = element.closest('.player-wrapper');
      const mediaUrl = element.getAttribute('data-mediaurl');

      // Remove the player wrapper element
      playerWrapper.remove();

      // Remove inline styles from dsgvo and inject the SoundCloud iframe
      dsgvoContainer.removeAttribute('style');
      dsgvoContainer.innerHTML += `
        <iframe
          title="SoundCloud Player"
          width="100%"
          height="487"
          scrolling="no"
          frameborder="no"
          allow="autoplay"
          src="https://w.soundcloud.com/player/?url=${encodeURIComponent(mediaUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true">
        </iframe>
      `;
    });
  });
}

// Initialize the soundcloud function if any SoundCloud audio element exists
if (document.querySelector('.audio-soundcloud')) {
  soundcloud();
}
