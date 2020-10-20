import { Option } from './Option';
import { Decision } from './Decision';
import { User } from './User';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Priority } from './Priority';

@Entity()
export class OptionProblem {

    @ManyToOne(type => Option, option => option.problems, { primary: true })
    option: Option

    @PrimaryColumn()
    position: number

    @Column()
    title: string

    @Column()
    counterArgument: string

    @Column()
    weight: number

    @Column({ default: new Date() })
    createdAt: Date

    @Column({ default: new Date() })
    updatedAt: Date

    constructor(option: Option, position: number, title: string,
        counterArgument: string, weight: number) {
        
        this.option = option
        this.position = position
        this.title = title
        this.counterArgument = counterArgument
        this.weight = weight
    }
}

