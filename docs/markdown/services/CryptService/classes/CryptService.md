[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [services/CryptService](../README.md) / CryptService

# Class: CryptService

Defined in: [services/CryptService.ts:8](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/CryptService.ts#L8)

Service for cryptographic operations (Hashing).

## Constructors

### Constructor

> **new CryptService**(): `CryptService`

#### Returns

`CryptService`

## Methods

### compare()

> `static` **compare**(`value`, `hashed`): `Promise`\<`boolean`\>

Defined in: [services/CryptService.ts:29](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/CryptService.ts#L29)

Compares a plain text string with a hash.

#### Parameters

##### value

`string`

The plain text string.

##### hashed

`string`

The hash to compare against.

#### Returns

`Promise`\<`boolean`\>

Promise<boolean> - True if matches, false otherwise.

***

### hash()

> `static` **hash**(`value`): `Promise`\<`string`\>

Defined in: [services/CryptService.ts:16](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/CryptService.ts#L16)

Hashes a plain text string using Bcrypt.

#### Parameters

##### value

`string`

The plain text string to hash.

#### Returns

`Promise`\<`string`\>

Promise<string> - The resulting hash.
