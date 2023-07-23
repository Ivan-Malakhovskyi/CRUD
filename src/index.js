import { animalsService, resetPage } from './news/animals-api.service';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  divQuard: document.querySelector('.js-quard'),
  galleryList: document.querySelector('.js-gallery'),
  btnSubmit: document.querySelector('button'),
};

const simplelightbox = new SimpleLightbox('.js-gallery a');

refs.form.addEventListener('submit', onFormSubmit);
let query = '';

async function onFormSubmit(evt) {
  evt.preventDefault();

  query = evt.currentTarget.elements.searchQuery.value.trim();

  resetPage();
  if (query === '') {
    Notify.failure('Please, enter that you want find');
    return;
  }

  try {
    refs.galleryList.innerHTML = '';
    const { hits, totalHits } = await animalsService(query);
    Notify.success(`"Hooray! We found ${totalHits} images."`);

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const markup = createMarkup(hits);
    simplelightbox.refresh();

    refs.galleryList.insertAdjacentHTML('beforeend', markup);
    observer.observe(refs.divQuard);
  } catch (error) {
    console.log(error.message);
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">

         <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
 
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>

    </a>
</div>
`;
      }
    )
    .join('');
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
        const { hits } = await animalsService(query);
        const markup = createMarkup(hits);
        refs.galleryList.insertAdjacentHTML('beforeend', markup);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  });
}
