//the API documentation site https://developers.themoviedb.org/3/
const container = document.getElementById('container')

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

      static async fetchPopularActors() {
        const url = APIService._constructUrl(`person/popular`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data.results)
        return data.results.map((movie) => new SingleActor(movie))
    }

    static async fetchSingleActor(personId) {
        const url = APIService._constructUrl(`person/${personId}`);
        const response = await fetch(url)
        const data = await response.json();
        return new SingleActor(data);
      }

      static async fetchActorCredit(personId){
        const url = APIService._constructUrl(`/person/${personId}/movie_credits`)
        const response =  await fetch(url)
        const data = await response.json()
        console.log(data)
        return new MovieCredits(data);
      }

    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }
}



class ActorsPage {
    static async run() {
        if (container.innerText !== '') {
            container.innerText = ''
        }
        
        const actorData = await APIService.fetchPopularActors()
        ActorsPage.renderActors(actorData)
    }
    static renderActors(actors) {
        const div = document.createElement('div')
        div.setAttribute('class', 'row p-4')
        const actorsContainer = container.appendChild(div)
        
        actors.forEach((actor) => {
            const actorDiv = document.createElement('div')
            actorDiv.setAttribute(
                'class',
                'col-lg-2 col-md-3 col-sm-4 col-6'
                )
                const actorImage = document.createElement('img')
                actorImage.setAttribute('class', 'img-fluid')
                actorImage.src = `${actor.actorsProfileUrl()}`
                
                const actorTitle = document.createElement('h3')
                actorTitle.textContent = `${actor.name.toUpperCase()}`
                actorTitle.setAttribute('class', 'text-center')
                
                actorImage.addEventListener('click', function() {
                    SingleActorPage.run(actor.id) 
                })
                
                actorDiv.appendChild(actorImage)
                actorDiv.appendChild(actorTitle)
                actorsContainer.appendChild(actorDiv)
            })
        }
    }
    
class SingleActorPage {
        static async run(actorId){
            if (container.innerText !== '') {
                container.innerText = ''
            }
            const singleActorData = await APIService.fetchSingleActor(actorId)
            const movieCredits = await APIService.fetchActorCredit(actorId)
            SingleActorPage.renderActor(singleActorData, movieCredits)
        }

    
        
        
        static renderActor(singleActor, movieCredits){

            const moviesCast = movieCredits.moviesInCast.map(movie => `
            <div class="movie-card col-md-2 col-sm-4 col-6">
              <img class="img-fluid" src=${movieCredits.castMoviesPosterUrl(movieCredits.moviesInCast.indexOf(movie))} alt="${movie.title}" onclick="Movies.run(${movie.id})">
              <h6>${movie.title} as ${movie.character}</h6>
            </div>`).join(" ");

            const moviesCrew = movieCredits.moviesInCrew.map(movie => `
            <div class="movie-card col-md-2 col-sm-4 col-6">
            <img class="img-fluid" src=${movieCredits.crewMoviesPosterUrl(movieCredits.moviesInCrew.indexOf(movie))} alt="${movie.title}" onclick="Movies.run(${movie.id})">
            <h6>${movie.title} as ${movie.job}</h6>
           </div>`).join(" ");
            
            ActorPage.container.innerHTML = `
            <div class="row align-items-center">
            <div class="col-md-4 my-4">
            <img class="img-fluid" src=${singleActor.actorsProfileUrl()}> 
            </div>
            <div class="col-md-8">
            <h1>${singleActor.name}</h1>
            <p class="lead"><strong>Job:</strong> ${singleActor.knownForDepartment}</p>
            <p class="lead"><strong>Birthday:</strong> ${singleActor.birthday}</p>
            <p class="lead"><strong>Gender:</strong> ${singleActor.genderIdentifier()}</p>
            <h5>Biography:</h5><p class="lead"><strong> ${singleActor.biography}</strong></p>
            <p class="lead"><strong>Popularity:</strong> ${singleActor.popularity}</p>
            </div>
            </div>
            <div class="row align-items-center">
            <h1>Movies in Cast</h1>
            <div col-md-6 my-4>
            <
            </div>
            </div>
            <div class="row" style="text-align: center;">
      <h3>Movies In Cast</h3>
      <div class="row justify-content-center">
        ${moviesCast}
      </div>
    </div>
    <div class="row" style="text-align: center;">
      <h3>Movies In Crew</h3>
      <div class="row justify-content-center">
        ${moviesCrew}
      </div>
    </div>`
            
            
        }
    }

class ActorPage {
        static container = document.getElementById('container');
        static renderActorPage(actor) {
            SingleActorPage.renderActor(actor);
        }
}
class MovieCredits {
    constructor(json) {
          this.moviesInCast = json.cast.slice(0, 6)
          this.moviesInCrew = json.crew.slice(0, 6)
    }
    castMoviesPosterUrl(i) {
            return this.moviesInCast[i].poster_path ? Movie.BACKDROP_BASE_URL + this.moviesInCast[i].poster_path : "";
    };
        
    crewMoviesPosterUrl(i) {
            return this.moviesInCrew[i].poster_path ? Movie.BACKDROP_BASE_URL + this.moviesInCrew[i].poster_path : "";
    };
}

class SingleActor {
    static PROFILE_PATH_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        this.name = json.name
        this.gender = json.gender 
        this.profilePath = json.profile_path
        this.popularity = json.popularity
        this.biography = json.biography
        this.birthday = json.birthday
        this.deathday = json.deathday
        this.knownForDepartment = json.known_for_department
        this.id = json.id
    }
    genderIdentifier(){
        return this.gender == 1 ? "Female" : "Male"
    }
    actorsProfileUrl() {
        return this.profilePath ? SingleActor.PROFILE_PATH_URL + this.profilePath : ''
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

            movieDiv.appendChild(movieImage);
            movieDiv.appendChild(movieTitle);
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
          <p class="lead" id="genres"><strong>Genre: ${movie.genres.map(genre=>genre.name).join(", ")}</strong></p>
          <p class="lead" id="languages"><strong> Language: ${movie.language.map(e=>{return e.english_name})} </strong></p>
          <p class="lead" id="movie-release-date"><strong>Release Date: ${movie.releaseDate}</strong></p>
          <p class="lead" id="movie-runtime"><strong>Run Time: ${movie.runtime}</strong></p>
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
 


document.addEventListener("DOMContentLoaded", App.run("now_playing"));




