import { User } from './User';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Priority } from './Priority';
import { Option } from './Option';

@Entity()
export class Decision {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.decisions, {onDelete: 'CASCADE'})
    user: User

    @Column()
    title: string

    @ManyToOne(type => Priority, priorityValue => priorityValue.decisions, {onDelete: 'CASCADE'})
    priority: Priority

    @OneToMany(type => Option, option => option.decision, { onDelete: 'CASCADE' })
    options: Option[]

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date
}

