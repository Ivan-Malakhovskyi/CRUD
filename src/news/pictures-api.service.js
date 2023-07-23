import axios from 'axios';
import { showSpiner, hideSpiner } from '../index.js';

const API_KEY = '38403877-64d14ccf654d22b76dab55b11';
const BASE_URL = 'https://pixabay.com/api/';
let currentPage = 1;

export async function animalsService(query) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: 40,
  });

  showSpiner();
  const { data } = await axios.get(`${BASE_URL}?${params}`);
  hideSpiner();
  currentPage += 1;
  return data;
}

export function resetPage() {
  currentPage = 1;
}
