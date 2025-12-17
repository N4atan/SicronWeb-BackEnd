[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [middlewares/resolveNGOProduct](../README.md) / resolveNGOProduct

# Function: resolveNGOProduct()

> **resolveNGOProduct**(`req`, `res`, `next`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\> \| `undefined`\>

Defined in: [middlewares/resolveNGOProduct.ts:12](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/middlewares/resolveNGOProduct.ts#L12)

Middleware to resolve NGO Product (Need).
Depends on resolveNGOAccess and resolveProduct (implied availability of req.ngo).
Populates req.ngoProduct.

## Parameters

### req

`Request`

### res

`Response`

### next

`NextFunction`

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\> \| `undefined`\>
