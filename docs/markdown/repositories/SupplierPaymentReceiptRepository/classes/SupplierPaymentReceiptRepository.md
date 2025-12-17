[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [repositories/SupplierPaymentReceiptRepository](../README.md) / SupplierPaymentReceiptRepository

# Class: SupplierPaymentReceiptRepository

Defined in: [repositories/SupplierPaymentReceiptRepository.ts:10](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierPaymentReceiptRepository.ts#L10)

Repository for Supplier Payment Receipts.

## Constructors

### Constructor

> **new SupplierPaymentReceiptRepository**(): `SupplierPaymentReceiptRepository`

#### Returns

`SupplierPaymentReceiptRepository`

## Methods

### createAndSave()

> **createAndSave**(`receipt`): `Promise`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)\>

Defined in: [repositories/SupplierPaymentReceiptRepository.ts:19](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierPaymentReceiptRepository.ts#L19)

Creates and saves a receipt.

#### Parameters

##### receipt

[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)

Receipt to save.

#### Returns

`Promise`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)\>

Promise<SupplierPaymentReceipt>

***

### findAll()

> **findAll**(`opt?`): `Promise`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)[] \| `null`\>

Defined in: [repositories/SupplierPaymentReceiptRepository.ts:44](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierPaymentReceiptRepository.ts#L44)

Finds receipts matching options.

#### Parameters

##### opt?

`FindManyOptions`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)\>

Find options.

#### Returns

`Promise`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)[] \| `null`\>

Promise<SupplierPaymentReceipt[] | null>

***

### findByUUID()

> **findByUUID**(`uuid`): `Promise`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md) \| `null`\>

Defined in: [repositories/SupplierPaymentReceiptRepository.ts:56](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierPaymentReceiptRepository.ts#L56)

Finds receipt by UUID.

#### Parameters

##### uuid

`string`

Receipt UUID.

#### Returns

`Promise`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md) \| `null`\>

Promise<SupplierPaymentReceipt | null>

***

### listBySupplier()

> **listBySupplier**(`supplier`): `Promise`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)[]\>

Defined in: [repositories/SupplierPaymentReceiptRepository.ts:71](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierPaymentReceiptRepository.ts#L71)

Lists receipts by Supplier.

#### Parameters

##### supplier

[`Supplier`](../../../entities/Supplier/classes/Supplier.md)

The Supplier.

#### Returns

`Promise`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)[]\>

Promise<SupplierPaymentReceipt[]>

***

### remove()

> **remove**(`receipt`): `Promise`\<`void`\>

Defined in: [repositories/SupplierPaymentReceiptRepository.ts:86](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierPaymentReceiptRepository.ts#L86)

Removes a receipt.

#### Parameters

##### receipt

[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)

Receipt entity to remove.

#### Returns

`Promise`\<`void`\>

Promise<void>

***

### save()

> **save**(`receipt`): `Promise`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)\>

Defined in: [repositories/SupplierPaymentReceiptRepository.ts:32](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierPaymentReceiptRepository.ts#L32)

Saves a receipt.

#### Parameters

##### receipt

[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)

Receipt to save.

#### Returns

`Promise`\<[`SupplierPaymentReceipt`](../../../entities/SupplierPaymentReceipt/classes/SupplierPaymentReceipt.md)\>

Promise<SupplierPaymentReceipt>
