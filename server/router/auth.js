import express from 'express';
import {} from 'express-async-errors';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as authController from '../controller/auth.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateCredential = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('username should be at least 5 characters'),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('password should be at least 5 characters'),
  validate,
];

const validateSignup = [
  ...validateCredential, // 위에꺼 그대로 재사용
  body('name').notEmpty().withMessage('name is missing'),
  body('email').isEmail().normalizeEmail().withMessage('invalid email'),
  body('url')
    .isURL()
    .withMessage('invalid URL')
    .optional({ nullable: true, checkFalsy: true }), //url이 null이거나 텅텅빈 문자열(checkFalsy)일 경우
  validate,
];

// signup이 오면 authController의 signup과 연결
router.post('/signup', validateSignup, authController.signup);

// login 오면 authController의 login 연결
router.post('/login', validateCredential, authController.login);

router.get('/me', isAuth, authController.me);

export default router;
