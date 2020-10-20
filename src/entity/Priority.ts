import { User } from './User';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Decision } from './Decision';

@Entity()
export class Priority {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Decision, decisionTopic => decisionTopic.priority)
    decisions: Decision[]

    @Column()
    name: string

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date


    // constructor(username: string, email: string, password: string) {
    //     this.username = username
    //     this.email = email
    //     this.password = password
    //     this.createdAt = new Date()
    // }
}
