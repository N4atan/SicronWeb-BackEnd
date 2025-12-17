[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [middlewares/resolveSupplierAccess](../README.md) / resolveSupplierAccess

# Function: resolveSupplierAccess()

> **resolveSupplierAccess**(`req`, `res`, `next`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\> \| `undefined`\>

Defined in: [middlewares/resolveSupplierAccess.ts:13](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/middlewares/resolveSupplierAccess.ts#L13)

Middleware to resolve and authorize Supplier Access.
Populates req.supplier.
Checks if user is Admin, Manager, or Employee of the Supplier.

## Parameters

### req

`Request`

### res

`Response`

### next

`NextFunction`

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\> \| `undefined`\>
