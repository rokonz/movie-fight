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

    if (response.data.Error)
        return [];
    return response.data.Search;
    // returning the search results.
}

// placing the html structure in JS to achive de-coupling & reusuablity.
const appElement = document.getElementById('app');
appElement.innerHTML = `
    <label>Search for a Movie</label>
    <input type="text" id="search-field" class="app__input" />
    <div class="dropdown"></div>
`;

// getting the user input
const inputElement = document.getElementById('search-field');
const dropdownElement = document.querySelector('.dropdown');

let timeoutId = 0;
const onInput = async event => {
    // we could call debounce() & pass this function also.
    const movies = await fetchData(event.target.value);
    if (!movies.length) {
        dropdownElement.classList.remove('active');
        return;
    }

    dropdownElement.innerHTML = '';
    dropdownElement.classList.add('active');

    // Completed the auto completion
    for (const movie of movies) {
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.href = '#';
        option.classList.add('dropdown__item');
        option.innerHTML = `
            <img src="${imgSrc}" />
            ${movie.Title}
        `;

        option.addEventListener('click', () => {
            dropdownElement.classList.remove('active');
            inputElement.value = movie.Title;
            // followup request for a specific movie data
            onMovieSelect(movie);
        });

        dropdownElement.appendChild(option);
    }
};

inputElement.addEventListener('input', debounce(onInput, 700));

document.addEventListener('click', event => {
    if (!appElement.contains(event.target))
        dropdownElement.classList.remove('active');
});

async function onMovieSelect(movie) {
    console.log(movie.imdbID);
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '158d6c28',
            i: movie.imdbID,
        }
    });

    document
        .getElementById('summery')
        .insertAdjacentHTML('afterbegin', movieTemplate(response.data));

}

function movieTemplate(movieDetail) {
    return `
        <article class="movie-template">
            <figure class="movie-template__image">
                <img src="${movieDetail.Poster}" alt="${movieDetail.Title} movie poster" />
            </figure>
            <div class="movie-template__content">
                <h2>${movieDetail.Title}</h2>
                <p>${movieDetail.Genre}</p>
                <p>${movieDetail.Plot}</p>
            </div>
        </article>
    `;
}
