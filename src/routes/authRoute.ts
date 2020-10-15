import * as express from "express";
import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
const authRoute = express.Router()

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
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  })

export default authRoute
