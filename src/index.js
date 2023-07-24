import { animalsService, resetPage } from './news/pictures-api.service';
import { getRefs } from './news/get-refs';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();

let simplelightbox = new SimpleLightbox('.js-gallery a');
let nextPageRequest = false;
let isEndPage = false;

refs.form.addEventListener('submit', onFormSubmit);

let query = '';

async function onFormSubmit(evt) {
  evt.preventDefault();

  query = evt.currentTarget.elements.searchQuery.value.trim();

  resetPage();
  // errorUserQueryNotify(query);
  if (query === '') {
    Notify.failure('Please, enter that you want find');
    return;
  }

  try {
    refs.galleryList.innerHTML = '';
    const { hits, totalHits } = await animalsService(query);

    // succesFoundImagesNotify(totalHits);
    if (totalHits) {
      Notify.success(`"Hooray! We found ${totalHits} images."`);
    }
    // isFailureSearchNotify(hits);
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    const markup = createMarkup(hits);

    refs.galleryList.insertAdjacentHTML('beforeend', markup);
    hideSpiner();
    simplelightbox.refresh();

    if (hits.length < totalHits) {
      observer.observe(refs.divQuard);
      nextPageRequest = false;
    } else {
      nextPageRequest = true;
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  } finally {
    hideSpiner();
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
        <a class="link-image" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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
    if (entry.isIntersecting && !isEndPage) {
      try {
        nextPageRequest = false;

        const { hits } = await animalsService(query);
        if (hits.length > 0) {
          const markup = createMarkup(hits);

          refs.galleryList.insertAdjacentHTML('beforeend', markup);
        }

        if (hits.length <= 1) {
          observer.unobserve(entry.target);
          isEndPage = true;
          Notify.info('You have reached the end of the list of images found');
        }

        // else {
        //   isEndPage = true;
        //   // Notify.info('You have reached the end of the list of images found');
        // }

        nextPageRequest = false;

        simplelightbox.refresh();
        // smoothScrolling();
      } catch (error) {
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

// function errorUserQueryNotify(query) {
//   if (query === '') {
//     Notify.failure('Please, enter that you want find');
//     return;
//   }
// }

// function succesFoundImagesNotify(totalHits) {
//   if (totalHits) {
//     Notify.success(`"Hooray! We found ${totalHits} images."`);
//   }
// }

// function isFailureSearchNotify(hits) {
//   if (hits.length === 0) {
//     Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
// }

export { showSpiner, hideSpiner };

// function smoothScrolling() {
//   const { height: cardHeight } = document
//     .querySelector('.js-gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
