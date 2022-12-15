export {fetchImages};
import axios from 'axios';

    
async function fetchImages(query, page) {
  const KEY = `31735095-684ab1f66144313a79ef81b6d`;
  const url = `https://pixabay.com/api/`;
  
  const response = await axios.get(`${url}?key=${KEY}&q=${query}&orientation=horizontal&safesearch=true&image_type=photo&per_page=9&page=${page}`);
  if(!response.data.total || !query)
  {throw new Error(`Find ${ response.data.total } matches`)}
  return (response.data);
};