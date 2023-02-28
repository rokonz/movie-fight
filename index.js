'use strict';

// fetch data from the API
async function fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '158d6c28',
            s: searchTerm,
            // i: 'tt0848228', id of the movie (from response)
            // s: 'avengers'
        }
    });

    console.log(response.data);
    // response object has many properties,
    // data is where the api response data is available
}

// getting the user input
const inputElement = document.getElementById('search-field');

let timeoutId = 0;
const onInput = event => {
    // we could call debounce() & pass this function also.
    fetchData(event.target.value);
};

inputElement.addEventListener('input', debounce(onInput, 700));
