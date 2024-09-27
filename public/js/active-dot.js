const sections = document.querySelectorAll("section");
const dots = document.querySelectorAll(".dot");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  dots.forEach((dot) => {
    dot.classList.remove("active");
    if (dot.getAttribute("data-section").toLowerCase().replace(" ", "-") === current) {
      dot.classList.add("active");
    }
  });
});
