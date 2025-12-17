[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [controllers/NGOController](../README.md) / NGOController

# Class: NGOController

Defined in: [controllers/NGOController.ts:13](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOController.ts#L13)

Controller for managing NGO operations.

## Constructors

### Constructor

> **new NGOController**(): `NGOController`

#### Returns

`NGOController`

## Methods

### addEmployee()

> `static` **addEmployee**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/NGOController.ts:107](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOController.ts#L107)

Adds an employee to the NGO.

#### Parameters

##### req

`Request`

Express Request object containing user_uuid.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 204 No Content or error.

***

### blockEmployee()

> `static` **blockEmployee**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/NGOController.ts:151](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOController.ts#L151)

Blocks an employee/user from the NGO.

#### Parameters

##### req

`Request`

Express Request object.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 204 No Content or error.

***

### delete()

> `static` **delete**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/NGOController.ts:223](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOController.ts#L223)

Deletes an NGO.

#### Parameters

##### req

`Request`

Express Request object.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 204 No Content or error.

***

### query()

> `static` **query**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/NGOController.ts:73](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOController.ts#L73)

Queries NGOs based on filters.

#### Parameters

##### req

`Request`

Express Request object containing query filters.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - List of NGOs matching criteria.

***

### register()

> `static` **register**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/NGOController.ts:25](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOController.ts#L25)

Registers a new NGO.

#### Parameters

##### req

`Request`

Express Request object containing NGO details in body.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - The created NGO or error message.

***

### removeEmployee()

> `static` **removeEmployee**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/NGOController.ts:130](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOController.ts#L130)

Removes an employee from the NGO.

#### Parameters

##### req

`Request`

Express Request object containing user_uuid.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 204 No Content or error.

***

### update()

> `static` **update**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/NGOController.ts:172](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/NGOController.ts#L172)

Updates an NGO's details.

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
