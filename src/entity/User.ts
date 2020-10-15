import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

    constructor(username: string, email: string, password: string) {
        this.username = username
        this.email = email
        this.password = password
        this.createdAt = new Date()
    }
}
