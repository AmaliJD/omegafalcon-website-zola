let scrollPosition = 0;

function lockScroll() {
    // 1. Save exactly where the user was standing
    scrollPosition = window.pageYOffset;
    
    // 2. Lock the body
    document.body.classList.add('no-scroll');
    
    // 3. Optional: If the page still tries to jump, 
    // manually keep the body at the saved scroll position
    document.body.style.top = `-${scrollPosition}px`;
}

function unlockScroll() {
    // 1. Remove the lock
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';

    // 2. Teleport the user back to where they were
    window.scrollTo(0, scrollPosition);
}