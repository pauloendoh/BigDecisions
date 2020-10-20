import { OptionProblem } from './../entity/OptionProblem';
import { Priority } from '../entity/Priority';

import * as express from "express";

import { check, validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import authMiddleware from '../middleware/authMiddleware';
import { Decision } from '../entity/Decision';
import { Option } from '../entity/Option';

const optionProblemRoute = express.Router()

// talvez não vai usar?
optionProblemRoute.post('/', [
  authMiddleware,
],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty())
    //   return res.status(400).json({ errors: errors.array() });

    try {
      const body = req.body

      const user = req.user

      const optionRepo = getRepository(Option)
      const option = await optionRepo.findOne({ id: body.optionId })

      let newOptionProblem = new OptionProblem(
        option,
        body.position,
        body.title,
        body.counterArgument,
        body.weight)

      newOptionProblem = await getRepository(OptionProblem).save(newOptionProblem)
      
      return res.json(newOptionProblem)

    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }

)


export default optionProblemRoute