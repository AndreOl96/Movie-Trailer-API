import { IMovie } from "../interfaces/interfaces.js";
import FileService from "../utils/FileService.js";
import jsonFileReader from "../utils/jsonFileReader.js";

const moviesPath = "./src/data/movies.json";

class MovieService {
  getAll(): IMovie[] {
    return jsonFileReader.readFileJson(moviesPath);
  };

  getOne(movieId: number): IMovie | undefined {
    const movies: IMovie[] = jsonFileReader.readFileJson(moviesPath);
    return movies.find(movie => movie.id === movieId);
  };

  search(options: any): IMovie[] {
    let movies: IMovie[] = jsonFileReader.readFileJson(moviesPath);

    if (options.search) {
      movies = movies.filter(movie =>
        movie.title.toLowerCase().includes(options.search.toLowerCase()) ||
        movie.genres.some(genre => genre.toLowerCase().includes(options.search.toLowerCase()))
      );
    }

    if (options.releaseYear) {
      movies = movies.filter(movie =>
        new Date(movie.releaseDate).getFullYear().toString() === options.releaseYear
      );
    }

    if (options.genre) {
      movies = movies.filter(movie =>
        movie.genres.includes(options.genre.toLowerCase())
      );
    }

    if (options.sortBy) {
      movies.sort((a, b) => {
        if (options.sortBy === 'releaseDate') {
          return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        }
        return 0;
      });
    }

    // Paginação
    const startIndex = (options.page - 1) * options.limit;
    const endIndex = startIndex + options.limit;
    const paginatedMovies = movies.slice(startIndex, endIndex);

    return paginatedMovies;
  };

  create(movieData: any, posterFile: any): IMovie {
    const { title, releaseDate, trailerLink, poster, genres } = movieData;
    const movies: IMovie[] = jsonFileReader.readFileJson(moviesPath);
    const lastId = movies.length > 0 ? movies[movies.length - 1].id : 0;
    let newPoster = "no-poster.jpg";

    const newMovie: IMovie = {
      id: lastId + 1,
      title,
      releaseDate,
      trailerLink,
      poster: newPoster,
      genres
    }

    if (posterFile) {
      newMovie.poster = FileService.save(posterFile);
    }

    movies.push(newMovie);
    jsonFileReader.writeFileJson(moviesPath, movies);
    return newMovie;
  };

  update(
    movieData: any,
    movieId: number,
    moviePoster: any
  ): IMovie | undefined {
    const { title, releaseDate, trailerLink, poster, genres } = movieData;
    const movies: IMovie[] = jsonFileReader.readFileJson(moviesPath);
    const movieIndex = movies.findIndex(movie => movie.id === movieId);

    if (movieIndex === -1) return undefined;

    const updatedMovie: IMovie = {
      id: movieId,
      title,
      releaseDate,
      trailerLink,
      poster: movies[movieIndex].poster,
      genres
    }

    if (moviePoster) {
      FileService.delete(movies[movieIndex].poster);
      updatedMovie.poster = FileService.save(moviePoster);
    }

    movies[movieIndex] = updatedMovie;
    jsonFileReader.writeFileJson(moviesPath, movies);
    return updatedMovie;
  };

  delete(movieId: number): IMovie | undefined {
    const movies: IMovie[] = jsonFileReader.readFileJson(moviesPath);
    const movieIndex = movies.findIndex(movie => movie.id === movieId);

    if (movieIndex === -1) {
      return undefined;
    }

    FileService.delete(movies[movieIndex].poster);
    const deletedMovie = movies.splice(movieIndex, 1);

    jsonFileReader.writeFileJson(moviesPath, movies);

    return deletedMovie[0];
  };
}

export default new MovieService;