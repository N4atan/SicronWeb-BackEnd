[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [utils/sqlErrorUtil](../README.md) / SQLErrorUtil

# Class: SQLErrorUtil

Defined in: utils/sqlErrorUtil.ts:6

Utility for handling SQL Errors (TypeORM / MySQL).

## Constructors

### Constructor

> **new SQLErrorUtil**(): `SQLErrorUtil`

#### Returns

`SQLErrorUtil`

## Methods

### handle()

> `static` **handle**(`err`, `res`): `boolean`

Defined in: utils/sqlErrorUtil.ts:14

Handles common SQL errors and sends appropriate response.

#### Parameters

##### err

`any`

The Error object.

##### res

`Response`

Express Response.

#### Returns

`boolean`

boolean - True if error was handled, False otherwise.
