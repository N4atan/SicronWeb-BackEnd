import { Repository } from "typeorm";
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

    async findAll(): Promise<Ong[]> {
        return this.repository.find(); 
    }

    async findById( id: number ): Promise<Ong | null> {
        return this.repository.findOneBy({ id });
    }

    async findByLegalName( legal_name: string ): Promise<Ong | null> {
        return this.repository.findOneBy({ legal_name })
    }


    async save( Ong: Ong ): Promise<Ong> {
        return this.repository.save(Ong);
    }

    async remove( Ong: Ong ): Promise<Ong> {
        return this.repository.remove(Ong);
    }
}