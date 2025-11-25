import { FindManyOptions, Repository } from "typeorm";

import { AppDataSource } from "../config/data-source";

import { NGO } from '../entities/NGO';

export class NGORepository
{
    private repository: Repository<NGO> = AppDataSource.getRepository('ngotbl');

    async createAndSave(data: Partial<NGO>): Promise<NGO>
    {
        const ngo = this.repository.create(data);
        return this.repository.save(ngo);
    }

    private async findAll(options?: FindManyOptions<NGO>): Promise<NGO[]> { return this.repository.find(options); }

    private async findByID(id: number): Promise<NGO | null>     { return this.repository.findOneBy({ id });   }
    private async findByUUID(uuid: string): Promise<NGO | null> { return this.repository.findOneBy({ uuid }); }

    private async findByName(name: string): Promise<NGO | null>
    {
        return this.repository.findOneBy({ name });
    }

    async findByTradeName(trade_name: string): Promise<NGO | null>
    {
        return this.repository.findOneBy({ trade_name });
    }

    private async save(ngo: NGO): Promise<NGO>
    {
        return this.repository.save(ngo);
    }

    private async remove(ngo: NGO): Promise<NGO>
    {
        return this.repository.remove(ngo);
    }
}
