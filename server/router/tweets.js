import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import * as tweetController from '../controller/tweet.js';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

const validateTweet = [
  body('text')
    .trim()
    .isLength({ min: 3 })
    .withMessage('text shuld be at least 3 characters'),
  validate,
];

//GET /tweets
//GET /tweets?username=:username
router.get('/', isAuth, tweetController.getTweets);

//GET /tweets/:id
router.get('/:id', isAuth, tweetController.getTweet);

//POST /tweets
router.post('/', isAuth, validateTweet, tweetController.updateTweet);

//PUT /tweets/:
router.put('/:id', isAuth, validateTweet, tweetController.createTweet);

//DELTE /tweets/:id
router.delete('/:id', isAuth, tweetController.deleteTweet);

export default router;
