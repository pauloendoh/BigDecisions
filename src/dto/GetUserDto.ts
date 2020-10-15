import { User } from './../entity/User';
export class GetUserDto {
    username: string
    email: string
    
    token: string

    constructor(user: User, token: string) {
        this.username = user.username
        this.email = user.email
        this.token = token
    }
}