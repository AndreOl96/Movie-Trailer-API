import { Router } from "express";
import { check } from 'express-validator';
import MoviesController from "../controllers/MoviesController.js";
import { checkRoles } from "../middlewares/authMiddleware.js";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: API endpoints for managing Movies
 */

/**
 * @swagger
 * /api/Movies:
 *   get:
 *     summary: Get all Movies
 *     tags: 
 *       - Movies
 */
// Get all Movies
router.get('/movies', checkRoles(['USER', 'ADMIN']), MoviesController.getAllMovies);

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Fetch a list of movies with pagination, sorting, and filters
 *     tags: 
 *       - Movies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The maximum number of items to return per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: The field to sort by (e.g., releaseDate)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: The term to search for (e.g., movie name or genre)
 *       - in: query
 *         name: releaseYear
 *         schema:
 *           type: integer
 *         description: The year of release to filter by
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: The genre to filter by
 *     responses:
 *       '200':
 *         description: A list of movies with pagination, sorting, and filters
 *       '401':
 *         description: Unauthorized access
 */
router.get('/search', checkRoles(['USER', 'ADMIN']), MoviesController.searchMovies);


/**
 * @swagger
 * /api/Movies/{id}:
 *   get:
 *     summary: Get a Movie by ID
 *     tags: 
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Movie
 *     responses:
 *       '200':
 *         description: A single movie object
 *       '404':
 *         description: Movie not found
 */
// Get Movies by ID
router.get('/Movies/:id', MoviesController.getMovieById);

/**
 * @swagger
 * /api/Movies:
 *   post:
 *     summary: Create a new Movie
 *     tags: 
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               trailerLink:
 *                 type: string
 *               poster:
 *                 type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - title
 *               - releaseDate
 *               - trailerLink
 *               - poster
 *               - genres
 *     responses:
 *       '201':
 *         description: Movie created successfully
 *       '400':
 *         description: Bad request, check the request body
 */
// Create a new Movie
router.post(
  '/Movies',
  checkRoles(['ADMIN']), // Passando um array com a string 'ADMIN'
  [
    check('title').notEmpty().withMessage('Movie title is required'),
    check('releaseDate').notEmpty().withMessage('Release date is required'),
    check('trailerLink').notEmpty().withMessage('Trailer link is required'),
    check('poster').notEmpty().withMessage('Poster is required'),
    check('genres').isArray({ min: 1 }).withMessage('At least one genre is required'),
  ],
  MoviesController.createMovie
);

/**
 * @swagger
 * /api/Movies/{id}:
 *   put:
 *     summary: Update an existing Movie
 *     tags: 
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               trailerLink:
 *                 type: string
 *               poster:
 *                 type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - title
 *               - releaseDate
 *               - trailerLink
 *               - poster
 *               - genres
 *     responses:
 *       '200':
 *         description: Movie updated successfully
 *       '400':
 *         description: Bad request, check the request body
 *       '404':
 *         description: Movie not found
 */
// Update an existing Movie
router.put(
  '/Movies/:id',
  checkRoles(['ADMIN']), // Passando um array com a string 'ADMIN'

  [
    check('title').notEmpty().withMessage('Movie title is required'),
    check('releaseDate').notEmpty().withMessage('Release date is required'),
    check('trailerLink').notEmpty().withMessage('Trailer link is required'),
    check('poster').notEmpty().withMessage('Poster is required'),
    check('genres').isArray({ min: 1 }).withMessage('At least one genre is required'),
  ],
  MoviesController.updateMovie
);

/**
 * @swagger
 * /api/Movies/{id}:
 *   delete:
 *     summary: Delete an existing Movie
 *     tags: 
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Movie
 *     responses:
 *       '200':
 *         description: Movie deleted successfully
 *       '404':
 *         description: Movie not found
 */
// Delete an existing Movie
router.delete('/Movies/:id',
checkRoles(['ADMIN']), // Passando um array com a string 'ADMIN'
MoviesController.deleteMovie);

export default router;
