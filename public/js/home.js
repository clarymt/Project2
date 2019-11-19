// js file for populating movie inforation to index.html

/* 
    Test by using the following function calls in inspector on index.html file

    functions:
    getMovieStreamDetails(MOVIE-TITLE); <- replace MOVIE-TITLE with name of movie
    getMovieGenres();
    getMoviesByCategory(catId); <- replace catId with category id found by running getMovieGenres();
*/
$(document).ready(function(){
    $("#userSearchDiv").hide();
});

function getMovieStreamDetails(movieTitle){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term="+movieTitle+"&country=us",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
            "x-rapidapi-key": "b3aa10f3e9mshf37294a8e218e44p1da36fjsn46d1b673205b"
        }
    }

    $.ajax(settings).done(function (response) {
        let streamingLocations = [];
        for (let i = 0; i < response.results[0].locations.length; i++){
            streamingLocations.push(response.results[0].locations[i].display_name);
        }
        console.log("***Searching UtellyAPI***");
        console.log(response);
        console.log("Title: " + response.results[0].name);
        console.log("Where is it streaming: " + streamingLocations);
    });
};

$("#searchMoviesBtn").on("click", function(event){
    event.preventDefault();
    var movieTitle = $("#searchMoviesInput").val();
    getMovieStreamDetails(movieTitle);
});

function getMovieGenres(){
    let key = "5f7135150c434e2b62be14b37e1617f5";
    let queryString = "https://api.themoviedb.org/3/genre/movie/list?api_key="+key+"&language=en-US";

    $.get(queryString, function(results){
        console.log("*** Genre search using tMDB api***");
        console.log(results);
    });
}

function getMoviesByCategory(catId){
    let key = "5f7135150c434e2b62be14b37e1617f5";
    let queryString = "https://api.themoviedb.org/3/discover/movie?api_key="+key+"&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres="+catId;
    let moviePosters = [];
    let moviePosterBaseUrl = "http://image.tmdb.org/t/p/w185/";
    // example http://image.tmdb.org/t/p/w185//kvpNZAQow5es1tSY6XW2jAZuPPG.jpg ... it does require the double backspace

    $.get(queryString, function(results){
        console.log("*** Movies by Genre search using tMDB api***");
        console.log(results);
        for (let i = 0; i < 10; i++){
            moviePosters.push(results.results[i].poster_path);
        }
        console.log("**Movie Posters links**")
        console.log(moviePosters);
    });
}
