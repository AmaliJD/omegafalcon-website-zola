let scrollPosition = 0;

function lockScroll() {
    // scrollPosition = window.pageYOffset;
    document.body.classList.add('no-scroll');
}

function unlockScroll() {
    document.body.classList.remove('no-scroll');
    // window.scrollTo(0, scrollPosition);
}