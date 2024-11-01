import express, { Request, Response } from 'express';
import { body } from 'express-validator'; // to validate email and password
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@goticket/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters.'),
  ],
  validateRequest, // Check for errors in supplied email and password
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check whether the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    // Create new user and save to MongoDB
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store JWT on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
