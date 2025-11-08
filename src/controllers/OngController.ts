import { UserRepository } from './../repositories/UserRepository';
import { Ong } from '../entities/Ong';
import { User } from '../entities/User'
import { Response, Request } from 'express';
import { OngRepository } from "../repositories/OngRepository";


const ongRepository = new OngRepository();
const userRepository = new UserRepository();

export class OngController {
    static async register( req: Request, res: Response ): Promise<Response> {
        try {
            const {
                manager_id,
                legal_name,
                business_name,
                cnpj,
                cep_location,
                phone_number,
                email_contact,
            } = req.body;

            const requiredFields = { 
                legal_name, 
                business_name, 
                cnpj, 
                cep_location, 
                phone_number, 
                email_contact,
                manager_id // Assumindo que o ID do manager venha no body
            };
               
               // Itera sobre os valores do objeto
            for (const [key, value] of Object.entries(requiredFields)) {
                if (!value) {
                    return res.status(400).json({ message: `O campo '${key}' é obrigatório!` });
                }
            }

            const ongExists: Ong | null = await ongRepository.findByLegalName(legal_name);

            if ( ongExists ) return res.status(409).json({ message: "Razão Social já cadastrada!" });

            const managerExist: User | null = await userRepository.findById( manager_id );

            //Unprocessable Entity
            if ( !managerExist ) return res.status(422).json({ message: `O 'manager_id' fornecido (${manager_id}) não corresponde a um usuário válido.` });

            const ongCreated = await ongRepository.createAndSave({
                manager: new User({ id: manager_id }),
                legal_name,
                business_name,
                cnpj,
                cep_location,
                phone_number,
                email_contact,
            })

            return res.status(201).json({ ongCreated })
        }
        catch ( e ) {
            console.error(`Ocorreu um erro: ${e}`)
            return res.status(500).json({ message: `Internal Error Server: ${e}` })
        }
    }

    

    static async list( req: Request, res: Response ): Promise<Response> {
        try{
            const ongs = await ongRepository.findAll();
            return res.json({ ongs })
        }
        catch ( e ) {
            console.error(`Ocorreu um erro: ${e}`)
            return res.status(500).json({ message: `Internal Error Server: ${e}` })
        }
    }
}