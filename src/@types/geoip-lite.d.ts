declare module 'geoip-lite' {
    interface GeoInfo {
        range: [number, number];
        country: string;
        region: string;
        city: string;
        ll: [number, number];
        metro: number;
        area: number;
        asn?: number;
    }

    export function lookup(ip: string): GeoInfo | null;
}
