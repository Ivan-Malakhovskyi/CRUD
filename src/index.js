import { animalsService, resetPage } from './news/pictures-api.service';
import { createMarkup } from './news/markup';
import { getRefs } from './news/get-refs';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();

let simplelightbox = new SimpleLightbox('.js-gallery a');

let currentPage = 1;
refs.form.addEventListener('submit', onFormSubmit);

let query = '';

async function onFormSubmit(evt) {
  evt.preventDefault();

  query = evt.currentTarget.elements.searchQuery.value.trim();

  if (query === '') {
    Notify.failure('Please, enter that you want find');
    return;
  }

  try {
    refs.galleryList.innerHTML = '';
    // currentPage = 1;
    resetPage();
    const { hits, totalHits } = await animalsService(query);

    if (totalHits) {
      Notify.success(`"Hooray! We found ${totalHits} images."`);
    }

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const markup = createMarkup(hits);

    refs.galleryList.insertAdjacentHTML('beforeend', markup);
    hideSpiner();
    simplelightbox.refresh();
    evt.target.reset();

    if (hits.length < totalHits) {
      observer.observe(refs.divQuard);
    } else {
      Notify.info('You have reached the end of the list of images found');
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  } finally {
    hideSpiner();
  }
}

const options = {
  root: null,
  rootMargin: '500px',
  threshold: 0,
};

const observer = new IntersectionObserver(onPaginationPhoto, options);

async function onPaginationPhoto(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      try {
        currentPage += 1;

        const { hits, totalHits } = await animalsService(query, currentPage);
        if (hits.length > 0) {
          const markup = createMarkup(hits);

          refs.galleryList.insertAdjacentHTML('beforeend', markup);
        }

        if (currentPage === 12) {
          observer.unobserve(entry.target);
          Notify.info('You have reached the last page');
        }

        if (currentPage === Math.ceil(totalHits / 40)) {
          observer.unobserve(entry.target);

          Notify.info('You have reached the end of the list of images found');
        }

        simplelightbox.refresh();
      } catch (error) {
        Notify.failure('Failed to fetch data'); // Повідомити про невдалість запиту
        observer.unobserve(entry.target); // З
        console.log(error.message);
        throw new Error(error);
      }
    }
  });
}

function showSpiner() {
  refs.loader.classList.remove('is-hidden');
}

function hideSpiner() {
  refs.loader.classList.add('is-hidden');
}

export { showSpiner, hideSpiner };
