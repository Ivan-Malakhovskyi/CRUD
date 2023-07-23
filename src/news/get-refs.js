function getRefs() {
  const refs = {
    form: document.querySelector('#search-form'),
    divQuard: document.querySelector('.js-quard'),
    galleryList: document.querySelector('.js-gallery'),
    btnSubmit: document.querySelector('button'),
    loader: document.querySelector('.loader'),
  };
  return refs;
}

export { getRefs };
