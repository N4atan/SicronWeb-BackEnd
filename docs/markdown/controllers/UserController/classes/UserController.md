[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [controllers/UserController](../README.md) / UserController

# Class: UserController

Defined in: [controllers/UserController.ts:14](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserController.ts#L14)

Controller for managing User operations and Authentication.

## Constructors

### Constructor

> **new UserController**(): `UserController`

#### Returns

`UserController`

## Properties

### userRepo

> `static` **userRepo**: [`UserRepository`](../../../repositories/UserRepository/classes/UserRepository.md)

Defined in: [controllers/UserController.ts:16](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserController.ts#L16)

## Methods

### delete()

> `static` **delete**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/UserController.ts:166](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserController.ts#L166)

Deletes a User.

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

### isLogged()

> `static` **isLogged**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/UserController.ts:53](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserController.ts#L53)

Checks if the user is currently logged in.

#### Parameters

##### req

`Request`

Express Request object.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 200 OK if logged in, 401 Unauthorized otherwise.

***

### login()

> `static` **login**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/UserController.ts:65](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserController.ts#L65)

Authenticates a user and sets session cookies.

#### Parameters

##### req

`Request`

Express Request object containing email and password.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 204 No Content or error.

***

### logout()

> `static` **logout**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/UserController.ts:111](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserController.ts#L111)

Logs out the user by clearing session cookies.

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

Defined in: [controllers/UserController.ts:127](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserController.ts#L127)

Queries Users based on filters.

#### Parameters

##### req

`Request`

Express Request object containing query filters.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - List of Users matching criteria.

***

### refresh()

> `static` **refresh**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/UserController.ts:88](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserController.ts#L88)

Refreshes the authentication token.

#### Parameters

##### req

`Request`

Express Request object containing refresh token cookie.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 204 No Content with new cookies, or error.

***

### register()

> `static` **register**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/UserController.ts:25](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserController.ts#L25)

Registers a new User.

#### Parameters

##### req

`Request`

Express Request object containing user details.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - The created User or error.

***

### update()

> `static` **update**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/UserController.ts:183](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserController.ts#L183)

Updates a User's details.

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
