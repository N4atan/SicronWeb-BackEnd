[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [controllers/NGOProductController](../README.md) / NGOProductController

# Class: NGOProductController

Defined in: [controllers/NGOProductController.ts:11](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOProductController.ts#L11)

Controller for managing Products registered to an NGO (Needs).

## Constructors

### Constructor

> **new NGOProductController**(): `NGOProductController`

#### Returns

`NGOProductController`

## Methods

### create()

> `static` **create**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/NGOProductController.ts:23](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOProductController.ts#L23)

Registers a product need for the NGO.

#### Parameters

##### req

`Request`

Express Request object containing product name, quantity, and notes.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 201 Created or error.

***

### delete()

> `static` **delete**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/NGOProductController.ts:75](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOProductController.ts#L75)

Removes a product need from the NGO.

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

Defined in: [controllers/NGOProductController.ts:54](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOProductController.ts#L54)

Updates an NGO Product need.

#### Parameters

##### req

`Request`

Express Request object containing updates (quantity, notes).

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 204 No Content.
