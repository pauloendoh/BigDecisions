import { OptionProblem } from '../entity/OptionProblem';
import { Priority } from '../entity/Priority';

import * as express from "express";

import { check, validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import authMiddleware from '../middleware/authMiddleware';
import { Decision } from '../entity/Decision';
import { Option } from '../entity/Option';

const optionTableRoute = express.Router()

optionTableRoute.post('/', [
  authMiddleware,
],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty())
    //   return res.status(400).json({ errors: errors.array() });

    try {
      const sentOptionTable = req.body
      if (sentOptionTable.id == null) {
        // TODO: new optionTable
      }

      // consigo salvar um objeto inteiro? testar...; senão... TODO: alterar o POST /optionTable para atualizar os /optionProblems também
      const optionTableRepo = getRepository(Option)
      const optionProblemRepo = getRepository(OptionProblem)


      sentOptionTable.problems.forEach(async (optionProblem: OptionProblem, i: number) => {

        // Create/update optionProblem
        const newOptionProblem = new OptionProblem(sentOptionTable, optionProblem.position,  optionProblem.title,
          optionProblem.counterArgument, optionProblem.weight)

        sentOptionTable.problems[i] = await optionProblemRepo.save(newOptionProblem)

      })

      await optionTableRepo.save(sentOptionTable)
      return res.status(200)

    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }

)


export default optionTableRoute