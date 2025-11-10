function resize() {
  const mediaQuery = window.matchMedia('(min-width: 62rem)');
  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');

  const mediaQueryListener = () => {
    const navbarToggler = document.querySelector('.navbar-toggler.show');
    const firstNavShow = document.querySelector('.first-nav.show');

    if (mediaQuery.matches) {
      navbarToggler?.click();
      firstNavShow?.click();
    } else {
      firstNavShow?.click();
      navbarToggler?.click();
    }

    body.classList.remove('active-nav-body');
    headerWrapper.classList.remove('active-nav');
  };

  mediaQuery.addEventListener('change', mediaQueryListener);
  mediaQueryListener(mediaQuery);
}

resize();
