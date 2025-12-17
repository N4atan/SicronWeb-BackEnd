[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [services/RefreshService](../README.md) / RefreshService

# Class: RefreshService

Defined in: [services/RefreshService.ts:8](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/RefreshService.ts#L8)

Service for managing Refresh Tokens via Redis.

## Constructors

### Constructor

> **new RefreshService**(): `RefreshService`

#### Returns

`RefreshService`

## Methods

### isValid()

> `static` **isValid**(`uuid`, `token`, `ip`): `Promise`\<`boolean`\>

Defined in: [services/RefreshService.ts:32](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/RefreshService.ts#L32)

Validates a refresh token against Redis.

#### Parameters

##### uuid

`string`

User UUID.

##### token

`string`

The refresh token string to match.

##### ip

Client IP address (required).

`string` | `undefined`

#### Returns

`Promise`\<`boolean`\>

Promise<boolean> - True if valid, false otherwise.

***

### revoke()

> `static` **revoke**(`uuid`, `ip?`): `Promise`\<`void`\>

Defined in: [services/RefreshService.ts:53](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/RefreshService.ts#L53)

Revokes refresh tokens.

#### Parameters

##### uuid

`string`

User UUID.

##### ip?

`string`

Optional IP to revoke specific token. If omitted, revokes ALL tokens for user.

#### Returns

`Promise`\<`void`\>

Promise<void>

***

### save()

> `static` **save**(`uuid`, `token`, `ip`): `Promise`\<`void`\>

Defined in: [services/RefreshService.ts:18](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/services/RefreshService.ts#L18)

Saves a refresh token in Redis.

#### Parameters

##### uuid

`string`

User UUID.

##### token

`string`

The refresh token string.

##### ip

`string`

Client IP address.

#### Returns

`Promise`\<`void`\>

Promise<void>
