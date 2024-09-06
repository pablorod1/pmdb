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
        1600: {
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

  const teasersGlide = new Glide(".teasers-glide", {
    type: "carousel",
    perView: 5,
    gap: 40,
    breakpoints: {
      1200: {
        perView: 1,
      },
      1024: {
        perView: 2,
      },
      768: {
        perView: 1,
      },
    }
  });


  singleGlide.mount();
  teasersGlide.mount();
});
