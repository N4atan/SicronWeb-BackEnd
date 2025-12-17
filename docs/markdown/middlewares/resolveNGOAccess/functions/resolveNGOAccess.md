[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [middlewares/resolveNGOAccess](../README.md) / resolveNGOAccess

# Function: resolveNGOAccess()

> **resolveNGOAccess**(`req`, `res`, `next`): `Promise`\<`void` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [middlewares/resolveNGOAccess.ts:13](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/middlewares/resolveNGOAccess.ts#L13)

Middleware to resolve and authorize NGO Access.
Populates req.ngo.
Checks if user is Admin, Manager, or Employee of the NGO.

## Parameters

### req

`Request`

### res

`Response`

### next

`NextFunction`

## Returns

`Promise`\<`void` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>
