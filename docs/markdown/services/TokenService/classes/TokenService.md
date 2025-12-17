[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [services/TokenService](../README.md) / TokenService

# Class: TokenService

Defined in: [services/TokenService.ts:22](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/TokenService.ts#L22)

Service for generating and verifying JWT tokens.

## Constructors

### Constructor

> **new TokenService**(): `TokenService`

#### Returns

`TokenService`

## Methods

### generateTokenPair()

> `static` **generateTokenPair**(`payload`): [`TokenPair`](../interfaces/TokenPair.md)

Defined in: [services/TokenService.ts:29](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/TokenService.ts#L29)

Generates an access and refresh token pair.

#### Parameters

##### payload

[`UserPayload`](../interfaces/UserPayload.md)

User payload (must include id/uuid).

#### Returns

[`TokenPair`](../interfaces/TokenPair.md)

TokenPair - Object containing accessToken and refreshToken.

***

### verifyAccess()

> `static` **verifyAccess**(`token`): `string` \| `JwtPayload`

Defined in: [services/TokenService.ts:55](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/TokenService.ts#L55)

Verifies an access token.

#### Parameters

##### token

`string`

The JWT access token string.

#### Returns

`string` \| `JwtPayload`

string | jwt.JwtPayload - Decoded payload or throws error.

***

### verifyRefresh()

> `static` **verifyRefresh**(`token`): `string` \| `JwtPayload`

Defined in: [services/TokenService.ts:65](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/TokenService.ts#L65)

Verifies a refresh token.

#### Parameters

##### token

`string`

The JWT refresh token string.

#### Returns

`string` \| `JwtPayload`

string | jwt.JwtPayload - Decoded payload or throws error.
