import * as express from "express";
import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { getRepository, getCustomRepository } from 'typeorm';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken'
import config from '../config';
import { GetAuthUserDto } from '../dto/GetAuthUserDto';
import UserRepository from '../repositories/UserRepository';


const authRoute = express.Router()

// login
authRoute.post('/', [
  check('email', 'Please include a valid email'),
  check('password', 'Password is required')
],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    const userRepo = getCustomRepository(UserRepository)

    try {
      let user = await userRepo.findOne({ email })

      if (!user)
        return res.status(400).json({ errors: [{ msg: 'Invalid email' }] })

      const passwordOk = await bcrypt.compare(password, user.password)
      if (!passwordOk)
        return res.status(400).json({ errors: [{ msg: 'Invalid password' }] })

      // Setting JWT
      const expireDate = new Date(new Date().setDate(new Date().getDate() + 5))
      const FIVE_DAYS_IN_SECONDS = 3600 * 24 * 5

      jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: FIVE_DAYS_IN_SECONDS },
        (err, token) => {
          if (err)
            throw err
          return res.json(new GetAuthUserDto(user, token, expireDate))
        })

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  })

export default authRoute
