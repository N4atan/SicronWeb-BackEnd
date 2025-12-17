[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [repositories/SupplierProductRepository](../README.md) / SupplierProductRepository

# Class: SupplierProductRepository

Defined in: [repositories/SupplierProductRepository.ts:11](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierProductRepository.ts#L11)

Repository for Supplier Product (Offers) operations.

## Constructors

### Constructor

> **new SupplierProductRepository**(): `SupplierProductRepository`

#### Returns

`SupplierProductRepository`

## Properties

### repository

> **repository**: `Repository`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)\>

Defined in: [repositories/SupplierProductRepository.ts:13](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierProductRepository.ts#L13)

## Methods

### createAndSave()

> **createAndSave**(`supplierProduct`): `Promise`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)\>

Defined in: [repositories/SupplierProductRepository.ts:20](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierProductRepository.ts#L20)

Creates and saves a SupplierProduct.

#### Parameters

##### supplierProduct

[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)

Entity to save.

#### Returns

`Promise`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)\>

Promise<SupplierProduct>

***

### find()

> **find**(`supplier`, `product`): `Promise`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md) \| `null`\>

Defined in: [repositories/SupplierProductRepository.ts:56](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierProductRepository.ts#L56)

Finds a specific SupplierProduct tuple.

#### Parameters

##### supplier

[`Supplier`](../../../entities/Supplier/classes/Supplier.md)

The Supplier.

##### product

[`Product`](../../../entities/Product/classes/Product.md)

The Product.

#### Returns

`Promise`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md) \| `null`\>

Promise<SupplierProduct | null>

***

### findAll()

> **findAll**(`opt?`): `Promise`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)[] \| `null`\>

Defined in: [repositories/SupplierProductRepository.ts:43](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierProductRepository.ts#L43)

Finds SupplierProducts matching options.

#### Parameters

##### opt?

`FindManyOptions`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)\>

Find options.

#### Returns

`Promise`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)[] \| `null`\>

Promise<SupplierProduct[] | null>

***

### listBySupplier()

> **listBySupplier**(`supplier`): `Promise`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)[]\>

Defined in: [repositories/SupplierProductRepository.ts:72](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierProductRepository.ts#L72)

Lists all products offered by a Supplier.

#### Parameters

##### supplier

[`Supplier`](../../../entities/Supplier/classes/Supplier.md)

The Supplier.

#### Returns

`Promise`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)[]\>

Promise<SupplierProduct[]>

***

### remove()

> **remove**(`supplier`, `product`): `Promise`\<`void`\>

Defined in: [repositories/SupplierProductRepository.ts:109](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierProductRepository.ts#L109)

Removes a product offer from a Supplier.

#### Parameters

##### supplier

[`Supplier`](../../../entities/Supplier/classes/Supplier.md)

The Supplier.

##### product

[`Product`](../../../entities/Product/classes/Product.md)

The Product.

#### Returns

`Promise`\<`void`\>

Promise<void>

***

### save()

> **save**(`supplier`): `Promise`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)\>

Defined in: [repositories/SupplierProductRepository.ts:33](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierProductRepository.ts#L33)

Saves a SupplierProduct.

#### Parameters

##### supplier

[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)

Entity to save.

#### Returns

`Promise`\<[`SupplierProduct`](../../../entities/SupplierProduct/classes/SupplierProduct.md)\>

Promise<SupplierProduct>

***

### updateData()

> **updateData**(`supplier`, `product`, `price`, `availableQuantity`): `Promise`\<`void`\>

Defined in: [repositories/SupplierProductRepository.ts:88](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/SupplierProductRepository.ts#L88)

Updates price and quantity/availability data.

#### Parameters

##### supplier

[`Supplier`](../../../entities/Supplier/classes/Supplier.md)

The Supplier.

##### product

[`Product`](../../../entities/Product/classes/Product.md)

The Product.

##### price

`number`

New price.

##### availableQuantity

`number`

New quantity.

#### Returns

`Promise`\<`void`\>

Promise<void>
