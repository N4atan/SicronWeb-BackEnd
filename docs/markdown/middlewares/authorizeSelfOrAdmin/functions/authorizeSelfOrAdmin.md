[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [middlewares/authorizeSelfOrAdmin](../README.md) / authorizeSelfOrAdmin

# Function: authorizeSelfOrAdmin()

> **authorizeSelfOrAdmin**(`req`, `res`, `next`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\> \| `undefined`\>

Defined in: [middlewares/authorizeSelfOrAdmin.ts:12](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/middlewares/authorizeSelfOrAdmin.ts#L12)

Middleware to ensure the request is performed by the target user themselves OR an Admin.
Used for operations where a user modifies their own data.

## Parameters

### req

`Request`

### res

`Response`

### next

`NextFunction`

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\> \| `undefined`\>
