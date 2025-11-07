import { UserRepository } from "../repositories/UserRepository";
import { Response, Request } from 'express';
import { UserRole } from '../entities/User';


const userRepository = new UserRepository();

export class UserController {
    static async register( req: Request, res: Response ): Promise<Response> {
        try {
            const { username, email, password } = req.body;

            if ( !username || !email || !password ) return res.status(400).json({ message: "Há campos em branco!" });

            const emailExists = userRepository.findByEmail(email);

            if ( !emailExists ) return res.status(409).json({ message: "Email já está em uso!" });

            const userCreated = await userRepository.createAndSave({
                username,
                email,
                password,
            })

            return res.status(201).json({ userCreated })
        }
        catch ( e ) {
            console.error(`Ocorreu um erro: ${e}`)
            return res.status(500).json({ message: `Internal Error Server: ${e}` })
        }


    }

    static async show( req: Request, res: Response ): Promise<Response> {
        try{
            const { id } = req.params

            const user = await userRepository.findById(Number(id));

            if ( !user ) return res.status(404).json({ message: `Usuário não encontrado!` });

            return res.json({user});
        }
        catch ( e ) {
            console.error(`Ocorreu um erro: ${e}`)
            return res.status(500).json({ message: `Internal Error Server: ${e}` })
        }
    }

    static async list( req: Request, res: Response ): Promise<Response> {
        try{
            const users = await userRepository.findAll();
            return res.json({users})
        }
        catch ( e ) {
            console.error(`Ocorreu um erro: ${e}`)
            return res.status(500).json({ message: `Internal Error Server: ${e}` })
        }
    }

    static async delete( req: Request, res: Response ): Promise<Response> {
        try {
            const { id } = req.params;

            const user = await userRepository.findById(Number(id));

            if ( !user ) return res.status(404).json({ message: `Usuário não encontrado!` });

            await userRepository.remove(user);
            return res.status(204).send();
        }
        catch ( e ) {
            console.error(`Ocorreu um erro: ${e}`)
            return res.status(500).json({ message: `Internal Error Server: ${e}` })
        }
    }

    static async update( req: Request, res: Response ): Promise<Response> {
        try {
            const { id } = req.params;
            const { username, email, password } = req.body;

            const userExists = await userRepository.findById(Number(id));
            if ( !userExists ) return res.status(404).json({ message: `Usuário não encontrado!` });

            if( username ) userExists.username = username;
            if( password ) userExists.password = password;
            if( email    ) {
                const emailExists = await userRepository.findByEmail(email);

                if ( emailExists && emailExists.id != userExists.id ) {
                    return res.status(409).json({ message: "Email já está em uso" });
                }
                
                userExists.email = email;
            }

            const updateUser = await userRepository.save(userExists);
            return res.json({updateUser});
        }
        catch ( e ) {
            console.error(`Ocorreu um erro: ${e}`)
            return res.status(500).json({ message: `Internal Error Server: ${e}` })
        }
    }
}