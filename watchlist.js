let watchList = [];
let watchListFromLocalStorage = JSON.parse(localStorage.getItem("myWatchList"));

if (watchListFromLocalStorage) {
    watchList = watchListFromLocalStorage;
    renderWatchList(watchList);
} else {
    emptyWatchList();
}

function emptyWatchList() {
    document.querySelector(
        "main"
    ).innerHTML = `<div class="no-results">Your watchlist is looking a little empty...</div>
    <a class="add-to-watchlist" href="./index.html">Let's add some movies!</a>`;
}

function removeFromWatchlist(imdbID, title) {
    watchList = watchList.filter((data) => data != imdbID);
    localStorage.setItem("myWatchList", JSON.stringify(watchList));
    renderWatchList(watchList);
    if (watchList.length === 0) {
        console.log("Empty");
        localStorage.clear();
        emptyWatchList();
    }
    alert(`Movie "${title}" has been deleted from your Watchlist`);
}

function renderWatchList(watchList) {
    document.querySelector("main").innerHTML = "";
    watchList.forEach((imdbID) => {
        fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=224e36d6`)
            .then((res) => res.json())
            .then((extraData) => {
                document.querySelector("main").innerHTML += renderMovie(extraData);
            });
    });
}

function renderMovie(movie) {
    return `<div class="movie">
                    <img src="${movie.Poster}" alt="" class="movie-image">
                        <div class="movie-header">
                             <h2 class="movie-title">${movie.Title}</h2>
                             <span class="movie-rate">${movie.imdbRating}</span>
                        </div>

                            <div class="movie-time">${movie.Runtime}</div>
                            <div class="movie-type">${movie.Genre}</div>
                            <div class="remove-from-watchlist" onclick="removeFromWatchlist('${movie.imdbID}', '${movie.Title}')">Remove</div>

                        <p class="movie-desc">${movie.Plot}</p>

                    </div><hr/>`;
}
