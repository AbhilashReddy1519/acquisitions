import logger from '#config/logger.js';
import { authenticateUser, createUser } from '#services/auth.service.js';
import { formatValidator } from '#utils/format.js';
import { signinSchema, signupSchema } from '#validations/auth.validation.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation falied',
        details: formatValidator(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    const user = await createUser({ name, email, password, role });

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

    cookies.set(res, 'token', token);

    logger.info(`User registered successfully ${email}`);
    return res.status(201).json({
      message: 'User Registerd',
      user,
    });
  } catch (e) {
    logger.error('Sign up error ', e);
    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ message: 'Email already exists' });
    }

    next(e);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation falied',
        details: formatValidator(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

    cookies.set(res, 'token', token);

    logger.info(`User logged in successfully ${email}`);
    return res.status(200).json({
      message: 'User signed in',
      user,
    });
  } catch (e) {
    logger.error('Sign in error ', e);
    if (e.message === 'Invalid email or password') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    next(e);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User signed out successfully');
    return res.status(200).json({ message: 'User signed out' });
  } catch (e) {
    logger.error('Sign out error ', e);
    next(e);
  }
};
