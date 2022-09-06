//the API documentation site https://developers.themoviedb.org/3/

class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        HomePage.renderMovies(movies);
    }
}

class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies() {
        const url = APIService._constructUrl(`movie/now_playing`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => new Movie(movie))
    }
    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
        return new Movie(data)
    }

    static async fetchActors(movieId){
        const url = APIService._constructUrl(`movie/${movieId.id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        renderMovieActors.render(data)
    }

    static async fetchTrailer(movieId)
    {
        const url = APIService._constructUrl(`movie/${movieId.id}/videos`)
        const response = await fetch(url)
        const data = await response.json()
        renderTrailer.render(data)
    }
 

    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('YmFlNWEwM2MyMjdjMzNiOGQ5ODQyZjRlNmMxMzI4ODk=')}`;
    }
}

class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        movies.forEach(movie => {
            const movieDiv = document.createElement("div");
            const movieImage = document.createElement("img");
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
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
        APIService.fetchActors(movieData)
        APIService.fetchTrailer(movieData)
        renderProductionCompany.render(movieData.productionCompanies)
        
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
      <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">Genres: ${movie.genres.map(genres=> genres.name)}</p>
          <o id="languages"> Language: ${movie.language.map(e=>{return e.english_name})} </p>
          <p id="movie-release-date">Release Date: ${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
        </div>
      </div>
      <h3>Actors:</h3>
    `;
    }
}

/* Creates variables from data in json file for single movie page */ 

class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.backdropPath = json.backdrop_path;
        
        this.genres = json.genres;
        this.language = json.spoken_languages;
        this.productionCompanies = json.production_companies;
    }

    static async listOflanguages()
    {
        console.log(this.language)
    }

    get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
    }
}

document.addEventListener("DOMContentLoaded", App.run);

// END OF ORIGINAL CODE

class renderMovieActors {

    static IMAGE_URL = 'http://image.tmdb.org/t/p/w780';

    static async render(actors)
    {   
        let crew = document.createElement('div')
        crew.className="movieCrew"

        MoviePage.container.append(crew)
        
        this.getDirector(actors)
        this.getActors(actors)
        
    }

    static async getDirector(direct) {
        let director = direct.crew.filter((e)=>{ return e.job=="Director"})
         this.renderAct(director[0])
    }
    static async getActors(actors)
    {

        actors.cast.forEach((e,n)=>{
            if(n<5)
            {
            return this.renderAct(e)
            }
          
        })
    }

    static async renderAct(crew) {
        let crewDiv = document.createElement('div')
        let crewImage = document.createElement('img')
        let crewName = document.createElement('span')
        
        crewName.innerHTML = crew.name
        crewImage.src = `${this.IMAGE_URL}${crew.profile_path}`
        crewDiv.append(crewImage)
        crewDiv.append(crewName)

        document.querySelector('.movieCrew').append(crewDiv)
    }

}

class renderTrailer{
    static async render(video)
    {
        let url = video.results.map(e => e.key)
        let videoSection = document.createElement('div');
        let videoFrame = document.createElement('iframe');
        videoFrame.src=`https://www.youtube.com/embed/${url[1]}`
        videoSection.className="videoSection";
        videoSection.innerHTML=`<h2> Trailer </h2>`
        videoSection.append(videoFrame)
        MoviePage.container.append(videoSection)

        
    }
}

class renderProductionCompany{
    static IMG_URL = `http://image.tmdb.org/t/p/w780/`
    static async render(companies)
    {
        console.log(companies)
        let comContain = document.createElement("div")
        comContain.className="companies"
        companies.forEach(e=>{
            let comdiv = document.createElement("div")
            let comName = document.createElement("h3")
            let comLogo = document.createElement('img')
            
            comLogo.src=`${this.IMG_URL}${e.logo_path}`
            comName.innerHTML = e.name
            comdiv.append(comName)
            comdiv.append(comLogo)

            comContain.append(comdiv)

        })
        MoviePage.container.append(comContain)
    }

}


document.getElementById('homeBtn').addEventListener('click', () => {
    document.getElementById("container").innerHTML = " ";
    App.run()
})
    
document.getElementById("actorsButton").addEventListener('click', () => {
    document.getElementById("container").innerHTML = " ";

})


