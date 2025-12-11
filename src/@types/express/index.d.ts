export {}; // <--- ADICIONA ISTO PARA TORNAR O FICHEIRO UM MÓDULO

declare global {
    namespace Express {
      interface Request {
        user?: import("../../entities/User").User | null;
        target?: import("../../entities/User").User | null;
        ngo?: import("../../entities/NGO").NGO | null;
        logged?: boolean;
      }
    }
}