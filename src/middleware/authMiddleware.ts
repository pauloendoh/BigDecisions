import { User } from './../entity/User';
import { getRepository } from 'typeorm';
import { Request } from 'express'
import * as jwt from 'jsonwebtoken'
import config from '../config';

export default function authMiddleware(req: Request, res, next) {
    const token = req.header('x-auth-token')

    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied!' })

    // Verify token
    try {
        jwt.verify(token,  config.jwtSecret, async (error, decoded) => {
            if (error) {
                return res.status(401).json({ msg: 'Token is not valid' });
            } else {
                req['userId'] = decoded['userId'];
                req['user'] = await getRepository(User).findOne({ id: decoded['userId'] })
                
                next();
            }
        });
    } catch (err) {
        console.error('something wrong with auth middleware');
        res.status(500).json({ msg: 'Server Error' });
    }
}