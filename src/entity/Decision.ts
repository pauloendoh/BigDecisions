import { User } from './User';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Priority } from './Priority';
import { Option } from './Option';

@Entity()
export class Decision {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.decisions)
    user: User

    @Column()
    title: string

    @ManyToOne(type => Priority, priorityValue => priorityValue.decisions)
    priority: Priority

    @OneToMany(type => Option, option => option.decision)
    options: Option[]

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date
}

