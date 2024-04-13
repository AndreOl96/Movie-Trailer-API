import { IMovie } from "../interfaces/interfaces.js";
import MovieService from "../services/MoviesService.js";
import FileService from "../utils/FileService.js";
import jsonFileReader from "../utils/jsonFileReader.js";
import { Request, Response } from 'express';

const moviesPath = "./src/data/movies.json";

class MovieController {
  getAllMovies(req: Request, res: Response) {
    const movies = MovieService.getAll();
    return res.json(movies);
  };

  getMovieById(req: Request, res: Response) {
    const movie = MovieService.getOne(parseInt(req.params.id));
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    return res.json(movie);
  };

  searchMovies(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, sortBy, search, releaseYear, genre } = req.query;

      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);

      const movies = MovieService.search({
        page: pageNumber,
        limit: limitNumber,
        sortBy: sortBy as string,
        search: search as string,
        releaseYear: releaseYear as string,
        genre: genre as string,
      });

      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };

  createMovie(req: Request, res: Response) {
    try {
      const newMovie: IMovie = MovieService.create(req.body, req.files?.image);
      return res.status(201).json(newMovie);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' })
    }
  };

  updateMovie(req: Request, res: Response) {
    const movieId = parseInt(req.params.id);
    const updatedMovie =
      MovieService.update(req.body, movieId, req.files?.image);

    if (!updatedMovie)
      return res.status(404).json({ error: "Movie not found." })

    return res.json(updatedMovie);
  };

  deleteMovie(req: Request, res: Response) {
    const deletedMovie = MovieService.delete(parseInt(req.params.id))

    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found." });
    }
    return res.json(deletedMovie)
  };
}

export default new MovieController;