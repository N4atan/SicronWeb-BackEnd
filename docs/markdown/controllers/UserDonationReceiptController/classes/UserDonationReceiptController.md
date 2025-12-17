[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [controllers/UserDonationReceiptController](../README.md) / UserDonationReceiptController

# Class: UserDonationReceiptController

Defined in: [controllers/UserDonationReceiptController.ts:11](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserDonationReceiptController.ts#L11)

Controller for managing User Donation Receipts.

## Constructors

### Constructor

> **new UserDonationReceiptController**(): `UserDonationReceiptController`

#### Returns

`UserDonationReceiptController`

## Methods

### create()

> `static` **create**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/UserDonationReceiptController.ts:23](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserDonationReceiptController.ts#L23)

Creates a new Donation Receipt.

#### Parameters

##### req

`Request`

Express Request object containing donation details.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - 201 Created or error.

***

### query()

> `static` **query**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [controllers/UserDonationReceiptController.ts:50](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/controllers/UserDonationReceiptController.ts#L50)

Queries Donation Receipts.

#### Parameters

##### req

`Request`

Express Request object containing query filters.

##### res

`Response`

Express Response object.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Promise<Response> - List of donations matching criteria.
