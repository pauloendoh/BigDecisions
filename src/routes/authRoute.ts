import * as express from "express";
import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken'
import config from '../config';
import { GetAuthUserDto } from '../dto/GetAuthUserDto';


const authRoute = express.Router()

// @route    GET api/auth
// @desc     Test some stuff... 
// @access   Private
authRoute.get('/', async (req, res) => {
  try {
    res.json('xd')
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate & return user
// @access   Private
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
    const userRepo = getRepository(User)

    try {
      let user = await userRepo.findOne({ email })

      if (!user)
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch)
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })

        const expireDate = new Date(new Date().setDate(new Date().getDate() + 5))
        const FIVE_DAYS_IN_SECONDS = 3600 * 24 * 5
        
        jwt.sign({ userId: user.id },
            config.jwtSecret,
            { expiresIn: FIVE_DAYS_IN_SECONDS },
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
