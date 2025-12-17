[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [controllers/SupplierPaymentReceiptController](../README.md) / SupplierPaymentReceiptController

# Class: SupplierPaymentReceiptController

Defined in: [controllers/SupplierPaymentReceiptController.ts:11](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/SupplierPaymentReceiptController.ts#L11)

Controller for managing Supplier Payment Receipts.

## Constructors

### Constructor

> **new SupplierPaymentReceiptController**(): `SupplierPaymentReceiptController`

#### Returns

`SupplierPaymentReceiptController`

## Methods

### create()

> `static` **create**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/SupplierPaymentReceiptController.ts:23](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/SupplierPaymentReceiptController.ts#L23)

Creates a new Payment Receipt for a Supplier.

#### Parameters

##### req

`Request`

Express Request object containing payment details.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 201 Created or error.

***

### delete()

> `static` **delete**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/SupplierPaymentReceiptController.ts:101](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/SupplierPaymentReceiptController.ts#L101)

Deletes a Payment Receipt.

#### Parameters

##### req

`Request`

Express Request object.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 204 No Content.

***

### query()

> `static` **query**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/SupplierPaymentReceiptController.ts:55](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/SupplierPaymentReceiptController.ts#L55)

Queries Payment Receipts.

#### Parameters

##### req

`Request`

Express Request object containing query filters.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - List of receipts matching criteria.
