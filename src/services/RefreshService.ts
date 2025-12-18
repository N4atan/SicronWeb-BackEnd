interface RefreshRecord {
    uuid: string;
    token: string;
    ip: string;
}

export const RefreshStore: RefreshRecord[] = [];

export class RefreshService {
    static save(uuid: string, token: string, ip: string): void {
        const idx = RefreshStore.findIndex(r => r.uuid === uuid && r.ip == ip);
        if (idx !== -1) RefreshStore.splice(idx, 1);
        RefreshStore.push({ uuid, token, ip });
    }

    static isValid(uuid: string, token: string, ip: string | undefined): boolean {

        return RefreshStore.some(r => r.uuid === uuid && r.token === token);
    }

    static revoke(uuid: string, ip?: string): void {
        let idx: number;


        while (
            (idx = ip ?
                RefreshStore.findIndex(r => r.uuid === uuid && r.ip === ip) :
                RefreshStore.findIndex(r => r.uuid === uuid)
            ) != -1
        ) RefreshStore.splice(idx, 1);
    }
}
