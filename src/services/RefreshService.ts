interface RefreshRecord {
    userId: number;
    token: string;
}

export const RefreshStore: RefreshRecord[] = [];

export class RefreshService {
    static save(userId: number, token: string): void
    {
        const idx = RefreshStore.findIndex(r => r.userId === userId);
        if (idx !== -1) RefreshStore.splice(idx, 1);
        RefreshStore.push({ userId, token });
    }

    static isValid(userId: number, token: string): boolean
    {
        return RefreshStore.some(r => r.userId === userId && r.token === token);
    }

    static revoke(userId: number): void
    {
        const idx = RefreshStore.findIndex(r => r.userId === userId);
        if (idx !== -1) RefreshStore.splice(idx, 1);
    }
}