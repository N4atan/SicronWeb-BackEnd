[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [middlewares/resolveSupplierPaymentAccess](../README.md) / resolveSupplierPaymentAccess

# Function: resolveSupplierPaymentAccess()

> **resolveSupplierPaymentAccess**(`req`, `res`, `next`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\> \| `undefined`\>

Defined in: [middlewares/resolveSupplierPaymentAccess.ts:9](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/middlewares/resolveSupplierPaymentAccess.ts#L9)

Middleware to authorize access to a Supplier Payment Receipt.
Requires resolveSupplierPaymentReceipt to be called first.

## Parameters

### req

`Request`

### res

`Response`

### next

`NextFunction`

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\> \| `undefined`\>
