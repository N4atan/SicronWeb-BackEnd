[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [repositories/NGOProductRepository](../README.md) / NGOProductRepository

# Class: NGOProductRepository

Defined in: [repositories/NGOProductRepository.ts:11](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGOProductRepository.ts#L11)

Repository for NGO Product (Needs) operations.

## Constructors

### Constructor

> **new NGOProductRepository**(): `NGOProductRepository`

#### Returns

`NGOProductRepository`

## Methods

### createAndSave()

> **createAndSave**(`ngoProduct`): `Promise`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)\>

Defined in: [repositories/NGOProductRepository.ts:20](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGOProductRepository.ts#L20)

Creates and saves an NGOProduct.

#### Parameters

##### ngoProduct

[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)

The entity to save.

#### Returns

`Promise`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)\>

Promise<NGOProduct>

***

### find()

> **find**(`ngo`, `product`): `Promise`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md) \| `null`\>

Defined in: [repositories/NGOProductRepository.ts:54](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGOProductRepository.ts#L54)

Finds a specific NGOProduct by NGO and Product.

#### Parameters

##### ngo

[`NGO`](../../../entities/NGO/classes/NGO.md)

The NGO entity.

##### product

[`Product`](../../../entities/Product/classes/Product.md)

The Product entity.

#### Returns

`Promise`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md) \| `null`\>

Promise<NGOProduct | null>

***

### findAll()

> **findAll**(`opt?`): `Promise`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)[] \| `null`\>

Defined in: [repositories/NGOProductRepository.ts:41](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGOProductRepository.ts#L41)

Finds NGOProducts matching options.

#### Parameters

##### opt?

`FindManyOptions`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)\>

Find options.

#### Returns

`Promise`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)[] \| `null`\>

Promise<NGOProduct[] | null>

***

### listByNGO()

> **listByNGO**(`ngo`): `Promise`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)[]\>

Defined in: [repositories/NGOProductRepository.ts:67](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGOProductRepository.ts#L67)

Lists all products needed by an NGO.

#### Parameters

##### ngo

[`NGO`](../../../entities/NGO/classes/NGO.md)

The NGO entity.

#### Returns

`Promise`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)[]\>

Promise<NGOProduct[]>

***

### remove()

> **remove**(`ngo`, `product`): `Promise`\<`void`\>

Defined in: [repositories/NGOProductRepository.ts:101](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGOProductRepository.ts#L101)

Removes a product need from an NGO.

#### Parameters

##### ngo

[`NGO`](../../../entities/NGO/classes/NGO.md)

The NGO entity.

##### product

[`Product`](../../../entities/Product/classes/Product.md)

The Product entity.

#### Returns

`Promise`\<`void`\>

Promise<void>

***

### save()

> **save**(`product`): `Promise`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)\>

Defined in: [repositories/NGOProductRepository.ts:31](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGOProductRepository.ts#L31)

Saves an NGOProduct.

#### Parameters

##### product

[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)

The entity to save.

#### Returns

`Promise`\<[`NGOProduct`](../../../entities/NGOProduct/classes/NGOProduct.md)\>

Promise<NGOProduct>

***

### updateQuantity()

> **updateQuantity**(`ngo`, `product`, `quantity`): `Promise`\<`void`\>

Defined in: [repositories/NGOProductRepository.ts:82](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/NGOProductRepository.ts#L82)

Updates the quantity of a product need.

#### Parameters

##### ngo

[`NGO`](../../../entities/NGO/classes/NGO.md)

The NGO entity.

##### product

[`Product`](../../../entities/Product/classes/Product.md)

The Product entity.

##### quantity

`number`

New quantity.

#### Returns

`Promise`\<`void`\>

Promise<void>
