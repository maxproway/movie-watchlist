let watchList = [];
let watchListFromLocalStorage = JSON.parse(localStorage.getItem("myWatchList"));

if (watchListFromLocalStorage) {
    watchList = watchListFromLocalStorage;
    console.log("step 1");
}

document.getElementById("search-form__btn").addEventListener("click", searchMovies);
document.getElementById("search-form__input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchMovies();
    }
});

function searchMovies() {
    let movies = [];
    let searchQuery = document.getElementById("search-form__input").value.replace(/\s/g, "+");
    console.log(searchQuery);
    fetch(`https://www.omdbapi.com/?s=${searchQuery}&apikey=224e36d6`)
        .then((response) => response.json())
        .then((data) => {
            movies = data.Search;
            getMoviesData(movies);
        })
        .catch((err) => {
            document.querySelector(
                "main"
            ).innerHTML = `<div class="no-results">Unable to find what you're looking for. <br/>Please try another search.</div>`;
        });
}

function getMoviesData(movies) {
    document.querySelector("main").innerHTML = "";
    movies.forEach((movie) => {
        fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=224e36d6`)
            .then((res) => res.json())
            .then((extraData) => {
                document.querySelector("main").innerHTML += `<div class="movie">
                    <img src="${extraData.Poster}" alt="" class="movie-image">

                        <div class="movie-header">
                            <h2 class="movie-title">${extraData.Title}</h2>
                            <span class="movie-rate">${extraData.imdbRating}</span>
                        </div>

                            <div class="movie-time">${extraData.Runtime}</div>
                            <div class="movie-type">${extraData.Genre}</div>
                            <div id="${extraData.imdbID}" class="add-to-watchlist" onclick="addToWatchlist('${extraData.imdbID}', '${extraData.Title}')">Add to Watchlist</div>

                        <p class="movie-desc">${extraData.Plot}</p>

                    </div><hr/>`;

                if (watchListFromLocalStorage) {
                    // console.log("watchList:", watchList);
                    // console.log("step 2:", extraData.imdbID);
                    if (watchList.includes(extraData.imdbID)) {
                        disableWatchlistBtn(extraData.imdbID);
                    }
                }
            });
    });
}

function addToWatchlist(imdbID, title) {
    watchList.push(imdbID);
    localStorage.setItem("myWatchList", JSON.stringify(watchList));
    disableWatchlistBtn(imdbID);
    alert(`Movie "${title}" has been added to your Watchlist`);
}

function disableWatchlistBtn(imdbID) {
    let currentElement = document.getElementById(imdbID);
    currentElement.style.opacity = "0.5";
    currentElement.innerHTML = "added to playlist";
    currentElement.onclick = null;
    currentElement.style.cursor = "inherit";
}
