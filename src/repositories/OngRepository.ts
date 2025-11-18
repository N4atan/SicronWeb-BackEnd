import { FindManyOptions, Repository } from "typeorm";
import { Ong } from '../entities/Ong'
import { AppDataSource } from "../config/data-source";



export class OngRepository {
    private repository: Repository<Ong>;

    constructor(){
        this.repository = AppDataSource.getRepository('ongs');
    }

    async createAndSave( data: Partial<Ong> ): Promise<Ong> {
        const Ong = this.repository.create(data);
        return this.repository.save(Ong);
    }

    async findAll(options?: FindManyOptions<Ong>): Promise<Ong[]> {
        return this.repository.find(options); 
    }

    async findById( id: number ): Promise<Ong | null> {
        return this.repository.findOneBy({ id });
    }

    async findByRazaoSocial( razao_social: string ): Promise<Ong | null> {
        return this.repository.findOneBy({ razao_social })
    }

    // Interessante deixar para achar todos que incluem a pesquisa.
    async findByNomeFantasia( nome_fantasia: string ): Promise<Ong | null> {
        return this.repository.findOneBy({ nome_fantasia })
    }


    async save( Ong: Ong ): Promise<Ong> {
        return this.repository.save(Ong);
    }

    async remove( Ong: Ong ): Promise<Ong> {
        return this.repository.remove(Ong);
    }


    
}