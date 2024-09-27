window.addEventListener("scroll", function() {
    var navbar = document.querySelector(".navbar");
    // If page is scrolled down by 50px or more, remove transparent class
    if (window.scrollY > 50) {
        navbar.classList.remove("transparent");
    } else {
        navbar.classList.add("transparent");
    }
});