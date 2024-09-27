document.addEventListener("DOMContentLoaded", function() {
    // Get the height of the navbar
    const navbarHeight = document.querySelector(".navbar").offsetHeight;

    // Get all anchor links within the table of contents
    const tocLinks = document.querySelectorAll(".project-toc a");

    // Add event listener to each TOC link
    tocLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault(); // Prevent default anchor click behavior

            // Get the target section from the href attribute
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            // Calculate the scroll position, offset by the navbar height
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            // Scroll to the position smoothly
            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });
});
