[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [entities/NGOProduct](../README.md) / NGOProduct

# Class: NGOProduct

Defined in: [entities/NGOProduct.ts:11](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/entities/NGOProduct.ts#L11)

Entity representing a Product needed by an NGO.
This links an NGO to a generic Product definition, with specific quantity and notes.

## Constructors

### Constructor

> **new NGOProduct**(`partial`): `NGOProduct`

Defined in: [entities/NGOProduct.ts:32](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/entities/NGOProduct.ts#L32)

#### Parameters

##### partial

`Partial`\<`NGOProduct`\>

#### Returns

`NGOProduct`

## Properties

### id

> **id**: `number`

Defined in: [entities/NGOProduct.ts:13](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/entities/NGOProduct.ts#L13)

***

### ngo

> **ngo**: [`NGO`](../../NGO/classes/NGO.md)

Defined in: [entities/NGOProduct.ts:15](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/entities/NGOProduct.ts#L15)

***

### notes?

> `optional` **notes**: `string`

Defined in: [entities/NGOProduct.ts:30](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/entities/NGOProduct.ts#L30)

***

### product

> **product**: [`Product`](../../Product/classes/Product.md)

Defined in: [entities/NGOProduct.ts:22](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/entities/NGOProduct.ts#L22)

***

### quantity

> **quantity**: `number`

Defined in: [entities/NGOProduct.ts:28](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/entities/NGOProduct.ts#L28)

***

### supplierProduct?

> `optional` **supplierProduct**: [`SupplierProduct`](../../SupplierProduct/classes/SupplierProduct.md)

Defined in: [entities/NGOProduct.ts:26](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/entities/NGOProduct.ts#L26)
