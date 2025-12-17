[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [utils/authUtil](../README.md) / AuthUtil

# Class: AuthUtil

Defined in: utils/authUtil.ts:12

Utility class for Authentication operations.
Handles Login, Logout, Refresh, and Session Clearing.

## Constructors

### Constructor

> **new AuthUtil**(): `AuthUtil`

#### Returns

`AuthUtil`

## Methods

### clearSession()

> `static` **clearSession**(`res`): `void`

Defined in: utils/authUtil.ts:73

Clears the session cookies without revoking tokens (e.g. invalid token).

#### Parameters

##### res

`Response`

Express Response.

#### Returns

`void`

***

### login()

> `static` **login**(`res`, `user`, `ip`): `Promise`\<`void`\>

Defined in: utils/authUtil.ts:20

Handles the login process: generates tokens, saves refresh token, sets cookies.

#### Parameters

##### res

`Response`

Express Response.

##### user

`any`

User object.

##### ip

`string`

Client IP.

#### Returns

`Promise`\<`void`\>

***

### logout()

> `static` **logout**(`res`, `token`, `ip`): `Promise`\<`void`\>

Defined in: utils/authUtil.ts:37

Handles the logout process: revokes refresh token, clears cookies.

#### Parameters

##### res

`Response`

Express Response.

##### token

Refresh Token string.

`string` | `undefined`

##### ip

`string`

Client IP.

#### Returns

`Promise`\<`void`\>

***

### refresh()

> `static` **refresh**(`res`, `user`, `oldToken`, `ip`): `Promise`\<`void`\>

Defined in: utils/authUtil.ts:56

Handles token refresh: generates new pair, revokes old, saves new, sets cookies.

#### Parameters

##### res

`Response`

Express Response.

##### user

`any`

User object.

##### oldToken

`string`

Old Refresh Token.

##### ip

`string`

Client IP.

#### Returns

`Promise`\<`void`\>
