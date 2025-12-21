import crypto from 'crypto';
import ipaddr from 'ipaddr.js';
import {lookup} from 'geoip-lite';

import logger from '../utils/logger';

export class Fingerprint
{
	private ip:    string;
	private range: string;
	private asn:   number;
	private hash:  string;
	private chck:  string;
	private time:  number;

	private static ipRangeOf(ip: string): string
	{
		try {
			const a = ipaddr.parse(ip);
			if (a.kind() === 'ipv4')
				return a.range() === 'private' ? `${a.toString().split('.').slice(0, 3).join('.')}.0/24` : `${a.toString().split('.').slice(0, 2).join('.')}.0.0/20`;
			return a.range() === 'uniqueLocal' ? `${a.toString().split(':').slice(0, 4).join(':')}:/64` : `${a.toString().split(':').slice(0, 3).join(':')}:/48`;
		} catch (e) {
			logger.debug('Fingerprint.ipRangeOf - ', ip, ' error while parsing ip ', e);
			return "0.0.0.0/0";
		}
	}

	public static clone(other: Fingerprint)
	{
		let cloned = new Fingerprint('', '');

		cloned.ip = other.ip;
		cloned.range = other.range;
		cloned.hash = other.hash;
		cloned.asn = other.asn;
		cloned.time = other.time;
		cloned.chck = other.chck;

		return cloned;
	}

	public constructor(ip: string, userAgent: string)
	{
		if (!ip) return;

		this.ip    = ip;
		this.range = Fingerprint.ipRangeOf(this.ip);
		this.hash  = crypto.createHash('sha256').update(userAgent).digest('hex');
		this.asn   = lookup(ip)?.asn ?? 0;
		this.time  = Date.now();
		this.chck  = crypto.createHash('sha512').update(`${ip}:${this.range}:${this.hash}`).digest('hex');
	}

	public equals(other: Fingerprint): boolean
	{
		if (this.asn !== other.asn || this.range !== other.range || this.hash !== other.hash) return false;

		const expectedChck = crypto.createHash('sha512').update(`${other.ip}:${other.range}:${other.hash}`).digest('hex');
		if (this.chck !== expectedChck) return false;

		if (this.ip !== other.ip && this.range == other.range) {
			this.ip = other.ip;
			this.time = Date.now();
		}

		return true;
	}
}
