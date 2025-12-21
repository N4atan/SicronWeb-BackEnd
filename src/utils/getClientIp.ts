import type { Request } from 'express';
import type { Socket  } from 'node:net';

export function getClientIp(req: Request): string
{
    const socket = req.socket as Socket;

    const xfwd: unknown = req.get('x-forwarded-for');
    if (typeof xfwd === 'string' && xfwd.length > 0) {
        const ip = xfwd.split(',')[0].trim();
        if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip) || ip.includes(':'))
            return ip;
    }

    return socket.remoteAddress || '0.0.0.0';
}
