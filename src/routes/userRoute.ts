import { Decision } from './../entity/Decision';

import * as express from "express";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { getRepository, getCustomRepository } from 'typeorm';
import { User } from '../entity/User';
import config from '../config';
import { GetAuthUserDto } from '../dto/GetAuthUserDto';
import UserRepository from '../repositories/UserRepository';

const userRoute = express.Router()

// @route    POST api/user
// @desc     Register user and return GetUserDto
// @access   Public
userRoute.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body
        const userRepo = getCustomRepository(UserRepository)

        try {
            let user = await userRepo.findOne({ email })

            if (user)
                return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });

            user = new User(email, email, password)

            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)

            await userRepo.save(user)

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
    }

)



export default userRoute