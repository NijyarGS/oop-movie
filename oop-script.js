//the API documentation site https://developers.themoviedb.org/3/

class App {
    static async run(input) {
      let movies
      if (typeof input === "number") { movies = await APIService.fetchGenres(input) }
      else { movies = await APIService.fetchMovies(input) }
      HomePage.renderMovies(movies);
    };
  };
class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies(filter) {
        const url = APIService._constructUrl(`movie/${filter}`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => {
            return new Movie(movie)})
    }
    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
       
        return new Movie(data)
    }

    static async fetchGenres(genreId) {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=bae5a03c227c33b8d9842f4e6c132889&include_adult=false&with_genres=${genreId}`);
        const data = await response.json()
        return data.results.map(movie => new Movie(movie))
      }

    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }
}


class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        if (container.innerText !== "") {
            container.innerText = "";
          }
        movies.forEach(movie => {
           
            const movieDiv = document.createElement("div");
            movieDiv.setAttribute("class", "col-md-4 col-sm-6")
            const movieImage = document.createElement("img");
            movieImage.setAttribute("class", "img-fluid")
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
            movieTitle.setAttribute("class", "text-center")
            movieTitle.textContent = `${movie.title}`;
            movieImage.addEventListener("click", function() {
                Movies.run(movie);
            });

            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            this.container.appendChild(movieDiv);
        })
    }
    
}


class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)
      
        MoviePage.renderMovieSection(movieData);
        // APIService.fetchActors(movieData);
    }
}

class MoviePage {
    static container = document.getElementById('container');
    static renderMovieSection(movie) {
        MovieSection.renderMovie(movie);
    }
}

class MovieSection {
    static renderMovie(movie) {
        MoviePage.container.innerHTML = `
      <div class="row align-items-center">
        <div class="col-md-4 my-4">
          <img id="movie-backdrop" src=${movie.posterUrl}> 
        </div>
        <div id="movieSectionDiv" class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p class="lead" id="genres"><strong>${movie.genres.map(genre=>genre.name).join(", ")}</strong></p>
          <p class="lead" id="languages"><strong> Language: ${movie.language.map(e=>{return e.english_name})} </strong></p>
          <p class="lead" id="movie-release-date"><strong>${movie.releaseDate}</strong></p>
          <p class="lead" id="movie-runtime"><strong>${movie.runtime}</strong></p>
          <h3>Overview:</h3>
          <p class="lead" id="movie-overview"><strong>${movie.overview}</strong></p>
        </div>
      </div>
      <h3 class="text-center my-3">Actors:</h3>
    `;
    }
}


class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.genres = json.genres;
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.posterPath = json.poster_path;
        this.backdropPath = json.backdrop_path;
        this.language = json.spoken_languages;
    }

    get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
    }

    get posterUrl(){
        return this.posterPath ? Movie.BACKDROP_BASE_URL + this.posterPath : "";
    }
}



document.getElementById('homeBtn').addEventListener('click', (e) => {
  document.getElementById('container').innerHTML = " "
  App.run("now_playing")
       })
 

// Home.homeButton()
document.addEventListener("DOMContentLoaded", App.run("now_playing"));