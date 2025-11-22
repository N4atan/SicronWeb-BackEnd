import { FindManyOptions, Repository } from "typeorm";

import { AppDataSource } from "../config/data-source";

import { Ong } from '../entities/Ong'

export class OngRepository
{
    private repository: Repository<Ong> = AppDataSource.getRepository('ongs');

    async createAndSave(data: Partial<Ong>): Promise<Ong>
    {
        const ngo = this.repository.create(data);
        return this.repository.save(ngo);
    }

    async findAll(options?: FindManyOptions<Ong>): Promise<Ong[]>
    {
        return this.repository.find(options); 
    }

    async findById(id: number): Promise<Ong | null>
    {
        return this.repository.findOneBy({ id });
    }

    async findByRazaoSocial(razao_social: string): Promise<Ong | null>
    {
        return this.repository.findOneBy({ razao_social })
    }

    async findByNomeFantasia(nome_fantasia: string): Promise<Ong | null>
    {
        return this.repository.findOneBy({ nome_fantasia })
    }

    async save(ngo: Ong): Promise<Ong>
    {
        return this.repository.save(ngo);
    }

    async remove(ngo: Ong): Promise<Ong>
    {
        return this.repository.remove(ngo);
    }
}