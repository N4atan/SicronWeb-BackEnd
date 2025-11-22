import { FindManyOptions, Repository } from "typeorm";

import { AppDataSource } from "../config/data-source";

import { User } from '../entities/User'

export class UserRepository
{
    private repository: Repository<User>;

    constructor()
    {
        this.repository = AppDataSource.getRepository('users');
    }

    async createAndSave( data: Partial<User> ): Promise<User>
    {
        const user = this.repository.create(data);
        return this.repository.save(user);
    }

    async findAll(options?: FindManyOptions<User>): Promise<User[]>
    {
        return this.repository.find(options);
    }

    async findById(id: number): Promise<User | null>
    {
        return this.repository.findOneBy({ id });
    }

    async findByEmail(email: string): Promise<User | null>
    {
        return this.repository.findOneBy({ email })
    }

    async save(user: User): Promise<User>
    {
        return this.repository.save(user);
    }

    async remove(user: User): Promise<User>
    {
        return this.repository.remove(user);
    }
}