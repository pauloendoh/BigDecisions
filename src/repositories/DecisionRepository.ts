import { OptionProblem } from './../entity/OptionProblem';
import { Priority } from './../entity/Priority';
import { getRepository, getCustomRepository } from 'typeorm';
import { Decision } from './../entity/Decision';
import { AbstractRepository, EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { Option } from '../entity/Option';
import OptionTableRepository from './OptionTableRepository';

@EntityRepository(Decision)
export default class DecisionRepository extends Repository<Decision>{

    async deleteByUserAndId(user: User, decisionId: number) {
        try {
            const result = await this.delete({ id: decisionId, user: user })
            if (result.affected == 1)
                return true
        }
        catch (err) {
            console.log('deleteByUserAndId', err)
        }
        return false
    }

    async getDecisionsFromUser(user: User) {
        const result = this.createQueryBuilder("decision")
            .leftJoinAndSelect("decision.options", "options")
            .leftJoinAndSelect("decision.priority", "priority")
            .leftJoinAndSelect("options.problems", "problems")
            .where({ user: user })
            .orderBy("priority.id", "DESC")
            .addOrderBy("options.id", "ASC")
            .addOrderBy("decision.updatedAt", "DESC")
            .addOrderBy("problems.position", "ASC")
            .getMany()

        return result
    }

    async getDecisionByUserAndId(user: User, decisionId: number) {
        const decision = await this.createQueryBuilder("decision")
            .leftJoinAndSelect("decision.options", "options")
            .leftJoinAndSelect("decision.priority", "priority")
            .leftJoinAndSelect("options.problems", "problems")
            .where({ user: user, id: decisionId })
            .orderBy("priority.id", "DESC")
            .addOrderBy("options.id", "ASC")
            .addOrderBy("decision.updatedAt", "DESC")
            .addOrderBy("problems.position", "ASC")
            .getOne()

        return decision
    }

    async createViaRequest(req) {
        try {
            let decision = new Decision() // criar um construtor...
            decision.user = req.user
            decision.title = req.body.title
            decision.priority = await getRepository(Priority).findOne({ id: req.body.priority })
            decision.createdAt = new Date()
            decision.updatedAt = new Date()

            decision = await this.save(decision)

            // Default yes/no options
            let yesOption = new Option(decision, 'Yes', 1)
            let noOption = new Option(decision, 'No', 2)

            const optionRepo = getRepository(Option)
            yesOption = await optionRepo.save(yesOption)
            noOption = await optionRepo.save(noOption)

            decision.options = []
            decision.options.push(yesOption)
            decision.options.push(noOption)

            return await this.save(decision)
        } catch (err) {
            console.log('createViaRequest', err)
        }

    }

    async updateViaRequest(req) {
        try {
            let decision = await this.findOne({ id: req.body.id })
            decision.title = req.body.title
            decision.priority = await getRepository(Priority).findOne({ id: req.body.priority })
            decision.updatedAt = new Date()
            return await this.save(decision)
        } catch (err) {
            console.log('updateViaRequest', err)
        }
    }
}