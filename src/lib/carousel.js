import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';

const glide = new Glide('.glide', {
  type: 'carousel',
  perView: 1,
  gap: 20,
  }
);

const popularMoviesGlide = new Glide('.popular-movies-glide', {
  type: 'carousel',
  perView: 10,
  gap: 10,
  }
);

glide.mount();
