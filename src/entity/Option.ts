import { Decision } from './Decision';
import { User } from './User';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Priority } from './Priority';
import { OptionProblem } from './OptionProblem';
import decisionRoute from '../routes/decisionRoute';

@Entity()
export class Option {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Decision, decision => decision.options, {onDelete: 'CASCADE'})
    decision: Decision

    @Column()
    title: string

    @Column({ default: 'transparent' })
    bgColor: string

    @Column()
    position: number

    @OneToMany(type => OptionProblem, problem => problem.option, {onDelete: 'CASCADE'})
    problems: OptionProblem[]

    @Column({ default: new Date() })
    createdAt: Date

    @Column({ default: new Date() })
    updatedAt: Date

    constructor(decision: Decision, title: string, position: number) {
        this.decision = decision
        this.title = title
        this.position = position
        this.createdAt = new Date()
        this.updatedAt = new Date()
    }
}

