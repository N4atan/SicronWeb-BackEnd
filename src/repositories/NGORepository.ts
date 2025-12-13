import { FindManyOptions, Repository } from "typeorm";

import { AppDataSource } from "../config/data-source";

import { NGO } from '../entities/NGO';

export class NGORepository
{
    private repository: Repository<NGO> = AppDataSource.getRepository('ngotbl');

    async createAndSave(data: Partial<NGO>): Promise<NGO>
    {
        const ngo = this.repository.create(data);
        return this.save(ngo);
    }

    public async findAll(options?: FindManyOptions<NGO>): Promise<NGO[]> { return this.repository.find(options); }    
    public async findByUUID(uuid: string): Promise<NGO | null> { return this.repository.findOneBy({ uuid }); }
    public async findByName(name: string): Promise<NGO | null>
    {
        return this.repository.findOneBy({ name });
    }

    public async findByTradeName(trade_name: string): Promise<NGO | null>
    {
        return this.repository.findOneBy({ trade_name });
    }

    public async save(ngo: NGO): Promise<NGO>
    {
        return this.repository.save(ngo);
    }

    public async remove(ngo: NGO): Promise<NGO>
    {
        return this.repository.remove(ngo);
    }
}
