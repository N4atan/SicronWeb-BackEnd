[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [controllers/SupplierProductController](../README.md) / SupplierProductController

# Class: SupplierProductController

Defined in: [controllers/SupplierProductController.ts:10](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/SupplierProductController.ts#L10)

Controller for managing Products offered by a Supplier.

## Constructors

### Constructor

> **new SupplierProductController**(): `SupplierProductController`

#### Returns

`SupplierProductController`

## Methods

### create()

> `static` **create**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/SupplierProductController.ts:22](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/SupplierProductController.ts#L22)

Registers a product offer for the Supplier.

#### Parameters

##### req

`Request`

Express Request object containing product offer details.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 201 Created or error.

***

### delete()

> `static` **delete**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/SupplierProductController.ts:80](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/SupplierProductController.ts#L80)

Removes a product offer from the Supplier.

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

### update()

> `static` **update**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/SupplierProductController.ts:57](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/SupplierProductController.ts#L57)

Updates a Supplier's product offer.

#### Parameters

##### req

`Request`

Express Request object containing updates (price, qty, delivery time).

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 204 No Content.
