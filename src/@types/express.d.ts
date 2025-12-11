import { User } from "../entities/User";

declare global {
  namespace Express {
    interface Request {
      user?: User;    // Adiciona a propriedade user (opcional)
      logged?: boolean; // Adiciona a propriedade logged (opcional)
      target?: any;   // Adiciona a propriedade target (opcional)
    }
  }
}