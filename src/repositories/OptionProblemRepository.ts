import { OptionProblem } from './../entity/OptionProblem';
import { AbstractRepository, EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository(User)
export default class OptionProblemRepository extends Repository<OptionProblem>{
    
}