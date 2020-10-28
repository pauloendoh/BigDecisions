import { OptionProblem } from './../entity/OptionProblem';
import { getRepository } from 'typeorm';
import { Option } from './../entity/Option';
import { EntityRepository, Repository, AbstractRepository } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository(User)
export default class OptionTableRepository extends Repository<Option>{

    async saveAndSaveProblems(optionTable: Option) {
        try {
            
            const optionProblemRepo = getRepository(OptionProblem)

            optionTable.problems.forEach(async (optionProblem: OptionProblem, index: number) => {
                // Create/update optionProblem
                const problem = new OptionProblem(optionTable, optionProblem.position, optionProblem.title, optionProblem.counterArgument, optionProblem.weight)

                optionTable.problems[index] = await optionProblemRepo.save(problem)
            })

            return await this.save(optionTable)
        } catch (err) {
            console.log('saveAndSaveProblems', err)
        }
    }
}