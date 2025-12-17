[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [middlewares/authenticateUser](../README.md) / authenticateUser

# Function: authenticateUser()

> **authenticateUser**(`required`, `roles?`): (`req`, `res`, `next`) => `Promise`\<`void` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [middlewares/authenticateUser.ts:20](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/middlewares/authenticateUser.ts#L20)

Middleware Factor for User Authentication.
Verifies Access and Refresh tokens, and checks optional Role requirements.

## Parameters

### required

`boolean` = `false`

If true, returns 401 if auth fails. If false, continues matching routes (optional auth).

### roles?

Array of allowed UserRoles. If provided, checks if user has one of them.

[`UserRole`](../../../entities/User/enumerations/UserRole.md)[] | `null`

## Returns

Express Middleware

> (`req`, `res`, `next`): `Promise`\<`void` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>

### Parameters

#### req

`Request`

#### res

`Response`

#### next

`NextFunction`

### Returns

`Promise`\<`void` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>
