[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [repositories/SupplierRepository](../README.md) / SupplierRepository

# Class: SupplierRepository

Defined in: [repositories/SupplierRepository.ts:9](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierRepository.ts#L9)

Repository for Supplier operations.

## Constructors

### Constructor

> **new SupplierRepository**(): `SupplierRepository`

#### Returns

`SupplierRepository`

## Properties

### repository

> **repository**: `Repository`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md)\>

Defined in: [repositories/SupplierRepository.ts:11](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierRepository.ts#L11)

## Methods

### createAndSave()

> **createAndSave**(`supplier`): `Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md)\>

Defined in: [repositories/SupplierRepository.ts:18](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierRepository.ts#L18)

Creates and saves a new Supplier.

#### Parameters

##### supplier

[`Supplier`](../../../entities/Supplier/classes/Supplier.md)

Supplier entity.

#### Returns

`Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md)\>

Promise<Supplier>

***

### findAll()

> **findAll**(`opt?`): `Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md)[] \| `null`\>

Defined in: [repositories/SupplierRepository.ts:39](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierRepository.ts#L39)

Finds Suppliers matching options.

#### Parameters

##### opt?

`FindManyOptions`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md)\>

Find options.

#### Returns

`Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md)[] \| `null`\>

Promise<Supplier[] | null>

***

### findByCNPJ()

> **findByCNPJ**(`cnpj`): `Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md) \| `null`\>

Defined in: [repositories/SupplierRepository.ts:51](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierRepository.ts#L51)

Finds Supplier by CNPJ.

#### Parameters

##### cnpj

`string`

Supplier CNPJ.

#### Returns

`Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md) \| `null`\>

Promise<Supplier | null>

***

### findByUserUUID()

> **findByUserUUID**(`uuid`): `Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md)[] \| `null`\>

Defined in: [repositories/SupplierRepository.ts:61](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierRepository.ts#L61)

Finds all suppliers related to a user (as owner/manager or employee).

#### Parameters

##### uuid

`string`

User UUID.

#### Returns

`Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md)[] \| `null`\>

Promise<Supplier[] | null>

***

### findByUUID()

> **findByUUID**(`uuid`): `Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md) \| `null`\>

Defined in: [repositories/SupplierRepository.ts:77](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierRepository.ts#L77)

Finds Supplier by UUID, loading relations.
Relations: manager, employees, products, paymentReceipts.

#### Parameters

##### uuid

`string`

Supplier UUID.

#### Returns

`Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md) \| `null`\>

Promise<Supplier | null>

***

### remove()

> **remove**(`uuid`): `Promise`\<`void`\>

Defined in: [repositories/SupplierRepository.ts:90](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierRepository.ts#L90)

Removes a Supplier by UUID.

#### Parameters

##### uuid

`string`

Supplier UUID.

#### Returns

`Promise`\<`void`\>

Promise<void>

***

### save()

> **save**(`supplier`): `Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md)\>

Defined in: [repositories/SupplierRepository.ts:29](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierRepository.ts#L29)

Saves a Supplier entity.

#### Parameters

##### supplier

[`Supplier`](../../../entities/Supplier/classes/Supplier.md)

Supplier entity.

#### Returns

`Promise`\<[`Supplier`](../../../entities/Supplier/classes/Supplier.md)\>

Promise<Supplier>
