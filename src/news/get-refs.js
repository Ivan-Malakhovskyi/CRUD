function getRefs() {
  const refs = {
    form: document.querySelector('#search-form'),
    divQuard: document.querySelector('.js-quard'),
    galleryList: document.querySelector('.js-gallery'),
    btnSubmit: document.querySelector('button'),
  };
  return refs;
}

export { getRefs };
