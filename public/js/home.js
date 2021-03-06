// js file for populating movie information to index.html
/* 
    Test by using the following function calls in inspector on index.html file

    functions:
    getMovieStreamDetails(MOVIE-TITLE); <- replace MOVIE-TITLE with name of movie
    getMovieGenres();
    getMoviesByCategory(catId); <- replace catId with category id found by running getMovieGenres();
*/
$(document).ready(function(){
    getPopularMovies();
    $("#userSearchDiv").hide();
    $("#genrePage").hide();

    $(".flip-card").on("click", function(){
        var catID = $(this).attr("value");
        getMoviesByCategory(catID);
    });

    $(document).on("click", ".something" , function(){
        var title = $(this).attr("id");
        //alert(title);
        getMovieStreamDetails(title);
    });
});

//Search movies by name click function
$("#searchMoviesBtn").on("click", function(event){
    event.preventDefault();
    var movieTitle = $("#searchMoviesInput").val();
    getMovieStreamDetails(movieTitle,"search");
    $("#userSearchDiv").show();
    $("#yourSearch").empty();
    $("#availableOn").empty();
});

function getMovieStreamDetails(movieTitle, action, movieData){
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
    if (action === "search"){
        $.ajax(settings).done(function (response) {
            let streamingLocations = [];
            for (let i = 0; i < response.results[0].locations.length; i++){
                streamingLocations.push(response.results[0].locations[i].display_name);
            }
            let divholder = $("<div>", {id: "result1"});
            let moviePoster = $("<img>", {src: response.results[0].picture, class: "searchedMovieImg text-center"});
            let titleP = $("<p>");
            titleP.append(response.results[0].name);
            let streamingP = $("<p>");
            for (let i = 0; i < streamingLocations.length; i++){
                if (i >= 1){
                    streamingP.append(", ");
                    streamingP.append(streamingLocations[i]);
                } else {
                    streamingP.append(streamingLocations[i]);
                }
            }
            divholder.append(titleP);
            divholder.append(moviePoster);
            divholder.appendTo("#yourSearch");
            $("#availableOn").append(streamingP);
        })
    } else if (action === 'category') {
        $.ajax(settings).then(function (response) {
            let streamingLocations = [];
            let moviePosterBaseUrl = "http://image.tmdb.org/t/p/w185/";
            let tempObject;
            if (response.results[0]){
                for (let i = 0; i < response.results[0].locations.length; i++){
                    streamingLocations.push(response.results[0].locations[i].display_name);
                }
                tempObject = {
                    title: movieData.title,
                    poster: moviePosterBaseUrl + movieData.poster_path,
                    releaseDate: movieData.release_date,
                    overview: movieData.overview,
                    streamingLocations: streamingLocations,
                    genreID: movieData.genre_ids[0]
                }
            } else {
                tempObject = {
                    title: movieData.title,
                    poster: moviePosterBaseUrl + movieData.poster_path,
                    releaseDate: movieData.release_date,
                    overview: movieData.overview,
                    streamingLocations: "Not Currently Streaming",
                    genreID: movieData.genre_ids[0]
                }
            }
            let divholder = $("<div>", {class: "col-3"});
            let moviePoster = $("<img>", {src: tempObject.poster, class: "searchedMovieImg text-center something", id: tempObject.title});
            let titleP = $("<p>", {class: "mt-3"});
            titleP.append(tempObject.title);
            let streamingP = $("<p>");
            for (let i = 0; i < tempObject.streamingLocations.length; i++){
                if (i >= 1){
                    streamingP.append(", ");
                    streamingP.append(tempObject.streamingLocations[i]);
                } else {
                    streamingP.append(tempObject.streamingLocations[i]);
                }
            }
            divholder.append(titleP);
            divholder.append(moviePoster);
            divholder.appendTo("#movieGenreDisplay");
           
        })
    } else {
        $.ajax(settings).done(function (response) {
            let streamingLocations = [];
            
            if (response.results[0]){
                for (let i = 0; i < response.results[0].locations.length; i++){
                    streamingLocations.push(response.results[0].locations[i].display_name);
                }
                $("#movieModalLabel").text(response.term);
                $("#movieModalBody").text("Streaming location: "+ streamingLocations);
                $('#movieModal').modal('show');
            } else {
                $("#movieModalLabel").text(response.term);
                $("#movieModalBody").text("Currently Not Streaming");
                $('#movieModal').modal('show');
            }     
        });
    }
}

function getMovieGenres(){
    let key = "5f7135150c434e2b62be14b37e1617f5";
    let queryString = "https://api.themoviedb.org/3/genre/movie/list?api_key="+key+"&language=en-US";
    $.get(queryString, function(results){
    });
}

function getMoviesByCategory(catID){
    let key = "5f7135150c434e2b62be14b37e1617f5";
        let queryString = "https://api.themoviedb.org/3/discover/movie?api_key="+key+"&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=2018&with_release_type=4%7C5%7C6&with_genres="+catID;
        $.get(queryString, function(results){
            console.log(results);
            for (let i = 0; i < 20; i++){
                getMovieStreamDetails(results.results[i].title ,"category", results.results[i]);
            }
        }).then(function(){
            $("#homePage").hide();
            $("#genrePage").show();
        });
}

function getPopularMovies(){
    let key = "5f7135150c434e2b62be14b37e1617f5";
    let queryString = "https://api.themoviedb.org/3/discover/movie?api_key="+key+"&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_release_type=4%7C5%7C6&without_genres=80"
    let popularMoviesObject = [];
    let moviePosterBaseUrl = "http://image.tmdb.org/t/p/w185/";
    // example http://image.tmdb.org/t/p/w185//kvpNZAQow5es1tSY6XW2jAZuPPG.jpg ... it does require the double backspace

    $.get(queryString, function(results){
        for (let i = 0; i < 5; i++){
            let tempObject = {
                title: results.results[i].title,
                poster: moviePosterBaseUrl + results.results[i].poster_path,
                releaseDate: results.results[i].release_date
            }
            popularMoviesObject.push(tempObject);
        }
        createPopularMovies(popularMoviesObject)
        //put append to html code here
    });
}

function createPopularMovies(array){
    $('#suggestedMoviesGallery').flickity({
        // options
        cellAlign: 'left',
        autoPlay: true,
        contain: true
    });

    var suggestedMovieHolder = $("#suggestedMoviesGallery");
    var mainDiv = $("<div>", {class: "main-gallery gallery js-flickity", "data-flickity-options": "{ 'wrapAround': true }"});
    for (let i = 0; i < array.length; i++){
        let div = $("<div>", {class: "gallery-cell"});
        let img = $("<img>", {src: array[i].poster, class: "movieImg something", id: array[i].title});
        div.append(img);
        $('#suggestedMoviesGallery').flickity( 'append', div);
    }
}