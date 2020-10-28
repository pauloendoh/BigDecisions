import { getRepository } from 'typeorm';
import { Decision } from './../entity/Decision';
import { Priority } from './../entity/Priority';

import * as express from "express";

import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { getCustomRepository } from 'typeorm';
import { User } from '../entity/User';
import config from '../config';
import { GetAuthUserDto } from '../dto/GetAuthUserDto';
import authMiddleware from '../middleware/authMiddleware';
import { Option } from '../entity/Option';
import UserRepository from '../repositories/UserRepository';
import DecisionRepository from '../repositories/DecisionRepository';
import OptionTableRepository from '../repositories/OptionTableRepository';

const decisionRoute = express.Router()


// PE 1/3 - Muito grande?
decisionRoute.post('/', [authMiddleware,
  check('title', 'Title is required').isString(),
  check('priority', 'Priority number is required (1~3)').isNumeric()
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const body = req.body
    const user: User = req.user
    const priority = await getRepository(Priority).findOne({ id: body.priority })

    const repo = getCustomRepository(DecisionRepository)
    try {
      let decision: Decision

      // if decision doesn't exist, create decision
      if (!('id' in body) || !body.id) {
        decision = await repo.createViaRequest(req)
      }
      // else, update
      else {
        decision = await repo.updateViaRequest(req)
      }

      decision = await repo.getDecisionByUserAndId(req.user, decision.id)
      return res.json(decision)

    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
)

decisionRoute.get('/user/:id', authMiddleware, async (req: any, res) => {
  const userId = req.params.id
  const body = req.body

  try {
    const user: User = req.user

    const decisionRepo = getCustomRepository(DecisionRepository)

    const decisions = await decisionRepo.getDecisionsFromUser(user)

    return res.json(decisions)

  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }

})


decisionRoute.delete('/:id', [authMiddleware], async (req, res) => {

  const decisionRepo = getCustomRepository(DecisionRepository)
  const deleted = await decisionRepo.deleteByUserAndId(req.user, req.params.id)

  if (deleted) {
    return res.status(200).send('success')
  }
  return res.status(400).send('Error')
})
export default decisionRoute