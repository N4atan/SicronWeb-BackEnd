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
                gestor_email,
                razao_social,
                nome_fantasia,
                objetivo,
                cnpj,
                cep_location,
                numero_telefone,
                email_contato,
            } = req.body;

            const requiredFields = { 
                razao_social, 
                nome_fantasia, 
                objetivo,
                cnpj, 
                cep_location, 
                numero_telefone, 
                email_contato,
                gestor_email // Assumindo que o email do manager venha no body
            };
               
               // Itera sobre os valores do objeto
            for (const [key, value] of Object.entries(requiredFields)) {
                if (!value) {
                    return res.status(400).json({ message: `O campo '${key}' é obrigatório!` });
                }
            }

            const ongExists: Ong | null = await ongRepository.findByRazaoSocial(razao_social);

            if ( ongExists ) return res.status(409).json({ message: "Razão Social já cadastrada!" });

            const gestorExist: User | null = await userRepository.findByEmail( gestor_email );

            //Unprocessable Entity
            if ( !gestorExist ) return res.status(422).json({ message: `O 'manager_email' fornecido (${gestor_email}) não corresponde a um usuário válido.` });

            const ongCreated = await ongRepository.createAndSave({
                gestor: new User({ email: gestor_email }),
                razao_social,
                nome_fantasia,
                objetivo,
                cnpj,
                cep_location,
                numero_telefone,
                email_contato,
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

    static async delete( req: Request, res: Response ): Promise<Response> {
        try {
            const { id } = req.params;

            const ong = await ongRepository.findById(Number(id));

            if ( !ong ) return res.status(404).json({ message: `ONG não encontrada!` });

            await ongRepository.remove(ong);
            return res.status(204).send();
        }
        catch ( e ) {
            console.error(`Ocorreu um erro: ${e}`)
            return res.status(500).json({ message: `Internal Error Server: ${e}` })
        }
    }
}