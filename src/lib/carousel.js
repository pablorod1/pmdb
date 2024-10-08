import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

document.addEventListener("DOMContentLoaded", () => {
  const singleGlideElement = document.querySelector(".single-glide");
  if (singleGlideElement) {
    const singleGlide = new Glide(singleGlideElement, {
      type: "carousel",
      perView: 1,
      gap: 20,
    });
    singleGlide.mount();
  }

  const multipleGlides = document.querySelectorAll(".multiple-glide");
  multipleGlides.forEach((glide) => {
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

  const teasersGlideElement = document.querySelector(".teasers-glide");
  if (teasersGlideElement) {
    const teasersGlide = new Glide(teasersGlideElement, {
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
      },
    });
    teasersGlide.mount();
  }

  const castsGlideElement = document.querySelector(".casts-glide");
  if (castsGlideElement) {
    const castsGlide = new Glide(castsGlideElement, {
      type: "carousel",
      perView: 3,
      gap: 20,
    });
    castsGlide.mount();
  }
});