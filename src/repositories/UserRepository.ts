import { FindManyOptions, Repository } from "typeorm";

import { AppDataSource } from "../config/data-source";

import { User } from '../entities/User'

export class UserRepository
{
    private repository: Repository<User> = AppDataSource.getRepository(User);

    public async createAndSave( data: Partial<User> ): Promise<User>
    {
        const user = this.repository.create(data);
        return this.repository.save(user);
    }

    public async findAll(options?: FindManyOptions<User>): Promise<User[]>
    {
        return this.repository.find(options);
    }

    public async findById(id: number): Promise<User | null>
    {
        return this.repository.findOneBy({ id });
    }
    
    public async findByUUID(uuid: string): Promise<User | null>
    {
        return this.repository.findOneBy({ uuid });
    }

    public async findByEmail(email: string): Promise<User | null>
    {
        return this.repository.findOneBy({ email })
    }

    public async save(user: User): Promise<User>
    {
        return this.repository.save(user);
    }

    public async remove(user: User): Promise<User>
    {
        return this.repository.remove(user);
    }
}
