import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction)
{
  console.error(`INTERNAL SERVER ERROR:`, err);
  res.status(500).json({ message: 'Internal Server Error' });
}