import { Decision } from './../entity/Decision';
// import {getRepository} from "typeorm";
// import {NextFunction, Request, Response} from "express";
// import {User} from "../entity/User";

// export class UserController {

//     private userRepository = getRepository(User);

//     async all(request: Request, response: Response, next: NextFunction) {
//         return this.userRepository.find();
//     }

//     async one(request: Request, response: Response, next: NextFunction) {
//         return this.userRepository.findOne(request.params.id);
//     }

//     async save(request: Request, response: Response, next: NextFunction) {
//         return this.userRepository.save(request.body);
//     }

//     async remove(request: Request, response: Response, next: NextFunction) {
//         let userToRemove = await this.userRepository.findOne(request.params.id);
//         await this.userRepository.remove(userToRemove);
//     }

// }
import * as express from "express";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import config from '../config';
import { GetAuthUserDto } from '../dto/GetAuthUserDto';
import authMiddleware from '../middleware/authMiddleware';

const userRoute = express.Router()



// @route    POST api/user
// @desc     Register user and return GetUserDto
// @access   Public
userRoute.get('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body
        const userRepo = getRepository(User)

        try {
            let user = await userRepo.findOne({ email })

            if (user)
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });

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


userRoute.get('/:id/decisions', authMiddleware, async (req: any, res) => {
    const userId = req.params.id
    const body = req.body

    try {
        const user: User = req.user

        const decisionRepo = getRepository(Decision)
        // const decisions = await decisionRepo.find(
        //     {
        //         where: { user: user },
        //         relations: ["options", "options.problems"]
        //     }
        // )
        const decisions = await decisionRepo.createQueryBuilder("decision")
            .leftJoinAndSelect("decision.options", "options")
            .leftJoinAndSelect("options.problems", "problems")
            .where({ user: user })
            .orderBy("decision.updatedAt", "DESC")
            .addOrderBy("options.position", "ASC")
            .getMany()
        return res.json(decisions)

    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }

})

export default userRoute