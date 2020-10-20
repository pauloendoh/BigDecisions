import { Decision } from './../entity/Decision';
import { Priority } from './../entity/Priority';

import * as express from "express";

import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import config from '../config';
import { GetAuthUserDto } from '../dto/GetAuthUserDto';
import authMiddleware from '../middleware/authMiddleware';
import { Option } from '../entity/Option';

const decisionRoute = express.Router()


// PE 2/3 - Muito grande?
// @route    POST api/decision
// @desc     Create or update a decision
// @access   Private
decisionRoute.post('/', [
  authMiddleware,
  check('title', 'Title is required').isString(),
  check('priority', 'Priority number is required (1~3)').isNumeric()
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const body = req.body

    try {
      const user = await getRepository(User).findOne({ id: req.userId })
      const priority = await getRepository(Priority).findOne({ id: body.priority })

      const decisionRepo = getRepository(Decision)
      let newDecision = new Decision()
      newDecision.user = user
      newDecision.title = body.title
      newDecision.priority = priority
      newDecision.createdAt = new Date() // como deixar automático?
      newDecision.updatedAt = new Date()
      newDecision = await decisionRepo.save(newDecision)

      let yesOption = new Option(newDecision, 'Yes', 1)
      let noOption = new Option(newDecision, 'No', 2)

      const optionRepo = getRepository(Option)
      yesOption = await optionRepo.save(yesOption)
      noOption = await optionRepo.save(noOption)

      newDecision.options = []
      newDecision.options.push(yesOption)
      newDecision.options.push(noOption)

      newDecision = await decisionRepo.save(newDecision)

      // const d = await decisionRepo.findOne(
      //   {
      //     where: { id: newDecision.id },
      //     relations: ["options", "options.problems"]
      //   })

      const d = await decisionRepo.createQueryBuilder("decision")
        .leftJoinAndSelect("decision.options", "options")
        .leftJoinAndSelect("options.problems", "problems")
        .where({ id: newDecision.id })
        .orderBy("decision.updatedAt", "DESC")
        .addOrderBy("options.position", "ASC")
        .getMany()

      console.log(d)
      return res.json(d)

    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }

)


export default decisionRoute