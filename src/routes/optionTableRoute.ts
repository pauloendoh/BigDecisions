import { OptionProblem } from '../entity/OptionProblem';
import { Priority } from '../entity/Priority';

import * as express from "express";

import { check, validationResult } from 'express-validator';
import { getRepository, getCustomRepository } from 'typeorm';
import { User } from '../entity/User';
import authMiddleware from '../middleware/authMiddleware';
import { Decision } from '../entity/Decision';
import { Option } from '../entity/Option';
import OptionTableRepository from '../repositories/OptionTableRepository';

const optionTableRoute = express.Router()

// PE 1/3 
optionTableRoute.post('/', [
  authMiddleware,
],
  async (req, res) => {
    try {
      const optionTable = req.body
      optionTable.problems = optionTable.problems.map(p => {
        if(p.weight === '') p.weight = null
        return p
      })

      if (optionTable.id == null) {
        // TODO: new optionTable
      }

      const optionTableRepo = getCustomRepository(OptionTableRepository)
      await optionTableRepo.saveAndSaveProblems(optionTable)

      return res.status(200).send('Success')

    } catch (err) {
      console.log('api/optionTable POST', err.message);
      return res.status(500).send('Server error');
    }
  }

)


export default optionTableRoute