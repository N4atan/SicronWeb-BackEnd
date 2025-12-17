[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [middlewares/resolveSupplierProduct](../README.md) / resolveSupplierProduct

# Function: resolveSupplierProduct()

> **resolveSupplierProduct**(`req`, `res`, `next`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\> \| `undefined`\>

Defined in: [middlewares/resolveSupplierProduct.ts:12](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/middlewares/resolveSupplierProduct.ts#L12)

Middleware to resolve Supplier Product (Offer).
Requires resolveSupplierAccess (or req.supplier) and resolveProduct (or req.product) to be populated.
Populates req.supplierProduct.

## Parameters

### req

`Request`

### res

`Response`

### next

`NextFunction`

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\> \| `undefined`\>
