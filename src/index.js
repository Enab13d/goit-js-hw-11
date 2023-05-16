import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {
  fetchData,
  pageValue,
  itemsPerPage,
  incrementPageValue,
  resetPageCount,
} from './fetchData';
import renderMarkup from './renderMarkup';
const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input[name=searchQuery]'),
  gallery: document.querySelector('.gallery'),
  searchBtn: document.querySelector('button[type=submit]'),
  loadMoreBtn: document.querySelector('button.load-more'),
};

refs.loadMoreBtn.classList.add('is-hidden');
let gallery = new SimpleLightbox('.gallery a', { captionDelay: 250 });
let totalPages = null;
let previousSearchQuery = null;
let currentSearchQuery = null;
const failureMsg = `We're sorry, but you've reached the end of search results.`;
const noMatchesMsg =
  'Sorry, there are no images matching your search query. Please try again';
const clearMarkup = () => (refs.gallery.innerHTML = '');
async function onSubmit(e) {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.currentTarget;
  currentSearchQuery = searchQuery.value;
  if (currentSearchQuery !== previousSearchQuery) {
    resetPageCount();
    clearMarkup();
    refs.loadMoreBtn.classList.add('is-hidden');
  }
  if (currentSearchQuery === previousSearchQuery) {
    return;
  }
  try {
    const d = await fetchData(currentSearchQuery);
    const {
      data: { totalHits },
    } = d;
    totalPages = Math.ceil(totalHits / itemsPerPage);
    if (totalHits === 0 || currentSearchQuery === '') {
      throw new Error();
    }
    if (pageValue === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    refs.gallery.insertAdjacentHTML('beforeend', renderMarkup(d));
    gallery.refresh();
    previousSearchQuery = searchQuery.value;
    refs.loadMoreBtn.classList.remove('is-hidden');
    incrementPageValue();
  } catch {
    Notify.failure(noMatchesMsg);
  }
}

async function onClick() {
  try {
    const data = await fetchData(currentSearchQuery);
    refs.gallery.insertAdjacentHTML('beforeend', renderMarkup(data));
    const { height: cardHeight } =
      refs.gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    gallery.refresh();
    if (pageValue > totalPages) {
      throw new Error();
    }
    incrementPageValue();
  } catch {
    Notify.failure(failureMsg);
  }
}

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onClick);
