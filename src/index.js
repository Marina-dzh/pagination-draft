
import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages'

// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

  

let gallery =  new SimpleLightbox('.gallery a',);
const refs = {
    input: document.querySelector('[name="searchQuery"]'),
    list: document.querySelector('.gallery'),
    searchBtn: document.querySelector("button"),
    form: document.querySelector("form"),
  
};

let page = 1

refs.form.addEventListener('submit', onSearch);

function onSearch(e) {
  refs.list.innerHTML = ""
  page = 1
  e.preventDefault();
  const query = refs.input.value.trim();
   
  fetchImages(query, page)
    .then(data => {
      refs.list.insertAdjacentHTML("beforeend", createMarkup(data.hits));
      gallery.refresh();
      totalHits=data.totalHits;
      createPagination(totalHits);
      
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      
    }).catch(error => { Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.') });

 
}

function createPagination(totalHits) {
  console.log(totalHits)
    const pagination = new Pagination(document.getElementById('tui-pagination-container'), {
        totalItems: totalHits,
        itemsPerPage: 10,
        visiblePages: 5,
     centerAlign: true,
      firstItemClassName: 'tui-first-child',
     lastItemClassName: 'tui-last-child',
      
   });
  pagination.on('afterMove', (event) => {
    refs.list.innerHTML = ""
    const currentPage = event.page;
    const query = refs.input.value.trim()
    fetchImages(query,currentPage)
    .then(data => {
      refs.list.insertAdjacentHTML("beforeend", createMarkup(data.hits));
      gallery.refresh();
    }).catch(console.error())
     console.log(currentPage);
 });
}

 
    
function createMarkup(arr) {
  return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
     
  <div class="thumb"><img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/></div>
  <div class="info">
    <p class="info-item">
      <b>Likes <br>${likes}</b>
    </p>
    <p class="info-item">
      <b>Views <br>${views}</b>
    </p>
    <p class="info-item">
      <b>Comments <br>${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads <br>${downloads}</b>
    </p>
  </div>
</div></a>`).join("");
  
}