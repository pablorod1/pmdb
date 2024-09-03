import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

document.addEventListener("DOMContentLoaded", () => {
  
  const singleGlide = new Glide(".single-glide", {
    type: "carousel",
    perView: 1,
    gap: 20,
  });

  const multipleGlides = document.querySelectorAll(".multiple-glide");
  multipleGlides.forEach((glide, index) => {
    new Glide(glide, {
      type: "carousel",
      perView: 10,
      gap: 30,
      breakpoints: {
        1200: {
          perView: 5,
        },
        1024: {
          perView: 4,
        },
        768: {
          perView: 3,
        },
        600: {
          perView: 2,
        },
      },
    }).mount();
  });

  singleGlide.mount();
});
