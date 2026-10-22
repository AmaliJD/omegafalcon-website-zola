const menuToggle = document.querySelector('.menu-toggle');
const navBg = document.querySelector('.nav-bg');
const navBar = document.querySelector('.navbar');

menuToggle.addEventListener("click", () => {
    navBg.classList.toggle("displaying");
    navBar.classList.toggle("displaying");
    toggleScrollLock();
});