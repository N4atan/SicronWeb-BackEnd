[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [controllers/ProductController](../README.md) / ProductController

# Class: ProductController

Defined in: [controllers/ProductController.ts:10](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/ProductController.ts#L10)

Controller for managing global Product definitions.

## Constructors

### Constructor

> **new ProductController**(): `ProductController`

#### Returns

`ProductController`

## Methods

### create()

> `static` **create**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/ProductController.ts:21](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/ProductController.ts#L21)

Creates a new Product (Admin only).

#### Parameters

##### req

`Request`

Express Request object containing product details.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - The created Product or error.

***

### delete()

> `static` **delete**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/ProductController.ts:87](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/ProductController.ts#L87)

Deletes a Product.

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

Defined in: [controllers/ProductController.ts:46](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/ProductController.ts#L46)

Queries Products based on filters.

#### Parameters

##### req

`Request`

Express Request object containing query filters.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - List of Products matching criteria.

***

### update()

> `static` **update**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/ProductController.ts:66](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/ProductController.ts#L66)

Updates a Product's details.

#### Parameters

##### req

`Request`

Express Request object containing updates.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 204 No Content or error.
