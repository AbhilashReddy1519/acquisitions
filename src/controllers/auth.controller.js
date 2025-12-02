import logger from '#config/logger.js';
import { createUser } from '#services/auth.service.js';
import { formatValidator } from '#utils/format.js';
import { signupSchema } from '#validations/auth.validation.js';
import { jwttoken } from '#utils/jwt.js';
import {cookies} from '#utils/cookies.js';

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
    // auth service

    const user = await createUser({name,email,password,role});

    const token = jwttoken.sign({id: user.id, email: user.email, role: user.role});

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
