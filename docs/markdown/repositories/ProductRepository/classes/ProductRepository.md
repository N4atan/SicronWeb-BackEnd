[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [repositories/ProductRepository](../README.md) / ProductRepository

# Class: ProductRepository

Defined in: [repositories/ProductRepository.ts:9](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/ProductRepository.ts#L9)

Repository for Product operations.

## Constructors

### Constructor

> **new ProductRepository**(): `ProductRepository`

#### Returns

`ProductRepository`

## Methods

### createAndSave()

> **createAndSave**(`product`): `Promise`\<[`Product`](../../../entities/Product/classes/Product.md)\>

Defined in: [repositories/ProductRepository.ts:18](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/ProductRepository.ts#L18)

Creates and saves a new Product.

#### Parameters

##### product

[`Product`](../../../entities/Product/classes/Product.md)

Product entity.

#### Returns

`Promise`\<[`Product`](../../../entities/Product/classes/Product.md)\>

Promise<Product>

***

### findAll()

> **findAll**(`opt?`): `Promise`\<[`Product`](../../../entities/Product/classes/Product.md)[] \| `null`\>

Defined in: [repositories/ProductRepository.ts:39](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/ProductRepository.ts#L39)

Finds Products matching options.

#### Parameters

##### opt?

`FindManyOptions`\<[`Product`](../../../entities/Product/classes/Product.md)\>

Find options.

#### Returns

`Promise`\<[`Product`](../../../entities/Product/classes/Product.md)[] \| `null`\>

Promise<Product[] | null>

***

### findByName()

> **findByName**(`name`): `Promise`\<[`Product`](../../../entities/Product/classes/Product.md) \| `null`\>

Defined in: [repositories/ProductRepository.ts:51](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/ProductRepository.ts#L51)

Finds Product by Name.

#### Parameters

##### name

`string`

Product Name.

#### Returns

`Promise`\<[`Product`](../../../entities/Product/classes/Product.md) \| `null`\>

Promise<Product | null>

***

### listAll()

> **listAll**(): `Promise`\<[`Product`](../../../entities/Product/classes/Product.md)[]\>

Defined in: [repositories/ProductRepository.ts:60](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/ProductRepository.ts#L60)

Lists all Products.

#### Returns

`Promise`\<[`Product`](../../../entities/Product/classes/Product.md)[]\>

Promise<Product[]>

***

### remove()

> **remove**(`name`): `Promise`\<`void`\>

Defined in: [repositories/ProductRepository.ts:70](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/ProductRepository.ts#L70)

Removes a Product by Name.

#### Parameters

##### name

`string`

Product Name.

#### Returns

`Promise`\<`void`\>

Promise<void>

***

### save()

> **save**(`product`): `Promise`\<[`Product`](../../../entities/Product/classes/Product.md)\>

Defined in: [repositories/ProductRepository.ts:29](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/ProductRepository.ts#L29)

Saves a Product entity.

#### Parameters

##### product

[`Product`](../../../entities/Product/classes/Product.md)

Product entity.

#### Returns

`Promise`\<[`Product`](../../../entities/Product/classes/Product.md)\>

Promise<Product>
