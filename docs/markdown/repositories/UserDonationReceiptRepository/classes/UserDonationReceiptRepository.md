[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [repositories/UserDonationReceiptRepository](../README.md) / UserDonationReceiptRepository

# Class: UserDonationReceiptRepository

Defined in: [repositories/UserDonationReceiptRepository.ts:11](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserDonationReceiptRepository.ts#L11)

Repository for User Donation Receipts.

## Constructors

### Constructor

> **new UserDonationReceiptRepository**(): `UserDonationReceiptRepository`

#### Returns

`UserDonationReceiptRepository`

## Methods

### createAndSave()

> **createAndSave**(`receipt`): `Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)\>

Defined in: [repositories/UserDonationReceiptRepository.ts:20](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserDonationReceiptRepository.ts#L20)

Creates and saves a receipt.

#### Parameters

##### receipt

[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)

Receipt entity.

#### Returns

`Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)\>

Promise<UserDonationReceipt>

***

### findAll()

> **findAll**(`opt?`): `Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)[] \| `null`\>

Defined in: [repositories/UserDonationReceiptRepository.ts:45](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserDonationReceiptRepository.ts#L45)

Finds receipts matching options.

#### Parameters

##### opt?

`FindManyOptions`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)\>

Find options.

#### Returns

`Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)[] \| `null`\>

Promise<UserDonationReceipt[] | null>

***

### findByUUID()

> **findByUUID**(`uuid`): `Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md) \| `null`\>

Defined in: [repositories/UserDonationReceiptRepository.ts:57](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserDonationReceiptRepository.ts#L57)

Finds receipt by UUID.

#### Parameters

##### uuid

`string`

Receipt UUID.

#### Returns

`Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md) \| `null`\>

Promise<UserDonationReceipt | null>

***

### listByNGO()

> **listByNGO**(`ngo`): `Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)[]\>

Defined in: [repositories/UserDonationReceiptRepository.ts:84](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserDonationReceiptRepository.ts#L84)

Lists receipts by NGO.

#### Parameters

##### ngo

[`NGO`](../../../entities/NGO/classes/NGO.md)

The NGO.

#### Returns

`Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)[]\>

Promise<UserDonationReceipt[]>

***

### listByUser()

> **listByUser**(`user`): `Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)[]\>

Defined in: [repositories/UserDonationReceiptRepository.ts:70](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserDonationReceiptRepository.ts#L70)

Lists receipts by User.

#### Parameters

##### user

[`User`](../../../entities/User/classes/User.md)

The User.

#### Returns

`Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)[]\>

Promise<UserDonationReceipt[]>

***

### remove()

> **remove**(`receipt`): `Promise`\<`void`\>

Defined in: [repositories/UserDonationReceiptRepository.ts:98](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserDonationReceiptRepository.ts#L98)

Removes a receipt.

#### Parameters

##### receipt

[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)

Receipt entity to remove.

#### Returns

`Promise`\<`void`\>

Promise<void>

***

### save()

> **save**(`receipt`): `Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)\>

Defined in: [repositories/UserDonationReceiptRepository.ts:33](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserDonationReceiptRepository.ts#L33)

Saves a receipt.

#### Parameters

##### receipt

[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)

Receipt entity.

#### Returns

`Promise`\<[`UserDonationReceipt`](../../../entities/UserDonationReceipt/classes/UserDonationReceipt.md)\>

Promise<UserDonationReceipt>
