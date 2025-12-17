[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [repositories/NGORepository](../README.md) / NGORepository

# Class: NGORepository

Defined in: [repositories/NGORepository.ts:9](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGORepository.ts#L9)

Repository for NGO operations.

## Constructors

### Constructor

> **new NGORepository**(): `NGORepository`

#### Returns

`NGORepository`

## Properties

### repository

> **repository**: `Repository`\<[`NGO`](../../../entities/NGO/classes/NGO.md)\>

Defined in: [repositories/NGORepository.ts:11](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGORepository.ts#L11)

## Methods

### createAndSave()

> **createAndSave**(`data`): `Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md)\>

Defined in: [repositories/NGORepository.ts:18](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGORepository.ts#L18)

Creates and saves a new NGO.

#### Parameters

##### data

`Partial`\<[`NGO`](../../../entities/NGO/classes/NGO.md)\>

Partial NGO data.

#### Returns

`Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md)\>

Promise<NGO> - Created NGO.

***

### findAll()

> **findAll**(`options?`): `Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md)[]\>

Defined in: [repositories/NGORepository.ts:29](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGORepository.ts#L29)

Finds NGOs matching options.

#### Parameters

##### options?

`FindManyOptions`\<[`NGO`](../../../entities/NGO/classes/NGO.md)\>

Find options.

#### Returns

`Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md)[]\>

Promise<NGO[]>

***

### findByName()

> **findByName**(`name`): `Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md) \| `null`\>

Defined in: [repositories/NGORepository.ts:52](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGORepository.ts#L52)

Finds NGO by Name.

#### Parameters

##### name

`string`

NGO Name.

#### Returns

`Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md) \| `null`\>

Promise<NGO | null>

***

### findByTradeName()

> **findByTradeName**(`trade_name`): `Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md) \| `null`\>

Defined in: [repositories/NGORepository.ts:62](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGORepository.ts#L62)

Finds NGO by Trade Name.

#### Parameters

##### trade\_name

`string`

NGO Trade Name.

#### Returns

`Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md) \| `null`\>

Promise<NGO | null>

***

### findByUUID()

> **findByUUID**(`uuid`): `Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md) \| `null`\>

Defined in: [repositories/NGORepository.ts:39](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGORepository.ts#L39)

Finds NGO by UUID, loading relations (manager, employees).

#### Parameters

##### uuid

`string`

NGO UUID.

#### Returns

`Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md) \| `null`\>

Promise<NGO | null>

***

### remove()

> **remove**(`ngo`): `Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md)\>

Defined in: [repositories/NGORepository.ts:82](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGORepository.ts#L82)

Removes an NGO entity.

#### Parameters

##### ngo

[`NGO`](../../../entities/NGO/classes/NGO.md)

NGO entity.

#### Returns

`Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md)\>

Promise<NGO> - Removed NGO.

***

### save()

> **save**(`ngo`): `Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md)\>

Defined in: [repositories/NGORepository.ts:72](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGORepository.ts#L72)

Saves an NGO entity.

#### Parameters

##### ngo

[`NGO`](../../../entities/NGO/classes/NGO.md)

NGO entity.

#### Returns

`Promise`\<[`NGO`](../../../entities/NGO/classes/NGO.md)\>

Promise<NGO> - Saved NGO.
