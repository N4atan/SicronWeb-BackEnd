interface RefreshRecord {
    userId: number;
    token:  string;
    ip:     string;
}

export const RefreshStore: RefreshRecord[] = [];

export class RefreshService {
    static save(userId: number, token: string, ip: string): void
    {
        const idx = RefreshStore.findIndex(r => r.userId === userId && r.ip == ip);
        if (idx !== -1) RefreshStore.splice(idx, 1);
        RefreshStore.push({ userId, token, ip });
    }

    static isValid(userId: number, token: string, ip: string): boolean
    {
        return RefreshStore.some(r => r.userId === userId && r.token === token && r.ip === ip);
    }

    static revoke(userId: number, ip?: string): void
    {
        let idx: number;

	
	while (
		(idx = ip ?
			RefreshStore.findIndex(r => r.userId === userId && r.ip === ip) :
			RefreshStore.findIndex(r => r.userId === userId)
		) != -1
	) RefreshStore.splice(idx, 1);
    }
}
