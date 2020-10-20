import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import { Decision } from './Decision';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    username: string

    @Column({nullable: true})
    email: string

    @Column({nullable: true})
    password: string
 
    @Column({nullable: true})
    createdAt: Date

    @OneToMany(type => Decision, decision => decision.user)
    decisions: Decision[]

    constructor(username: string, email: string, password: string) {
        this.username = username
        this.email = email
        this.password = password
        this.createdAt = new Date()
    }
}
