import {Response} from 'express';

interface MySQLError
{
    code?: string;
    errno?: number;
    sqlMessage?: string;
    message?: string;
}

/**
 * Utility for handling SQL Errors (TypeORM / MySQL).
 */
export class SQLErrorUtil
{
    /**
     * Handles common SQL errors and sends appropriate response.
     * @param err - The Error object.
     * @param res - Express Response.
     * @returns boolean - True if error was handled, False otherwise.
     */
    static handle(err: unknown, res: Response): boolean
    {
        const error = err as MySQLError;

        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            const message = error.sqlMessage || error.message || '';
            let field = 'Registro';

            if (message.includes('users.email'))
                field = 'E-mail';
            else if (message.includes('users.cpf'))
                field = 'CPF';
            else if (message.includes('suppliers.cnpj'))
                field = 'CNPJ de Fornecedor';
            else if (message.includes('ngotbl.cnpj'))
                field = 'CNPJ de ONG';
            else if (message.includes('ngotbl.trade_name'))
                field = 'Nome Fantasia da ONG';

            res.status(409).json(
                {message: `${field} já cadastrado!`});
            return true;
        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2' ||
            error.errno === 1452) {
            res.status(400).json({
                message:
                    'Referência inválida: registro relacionado não encontrado.',
            });
            return true;
        }

        return false;
    }
}
