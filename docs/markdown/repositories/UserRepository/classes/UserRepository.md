[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [repositories/UserRepository](../README.md) / UserRepository

# Class: UserRepository

Defined in: [repositories/UserRepository.ts:9](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserRepository.ts#L9)

Repository for User entity operations.

## Constructors

### Constructor

> **new UserRepository**(): `UserRepository`

#### Returns

`UserRepository`

## Properties

### repository

> **repository**: `Repository`\<[`User`](../../../entities/User/classes/User.md)\>

Defined in: [repositories/UserRepository.ts:11](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserRepository.ts#L11)

## Methods

### createAndSave()

> **createAndSave**(`data`): `Promise`\<[`User`](../../../entities/User/classes/User.md)\>

Defined in: [repositories/UserRepository.ts:18](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserRepository.ts#L18)

Creates and saves a new User.

#### Parameters

##### data

`Partial`\<[`User`](../../../entities/User/classes/User.md)\>

Partial User data.

#### Returns

`Promise`\<[`User`](../../../entities/User/classes/User.md)\>

Promise<User> - The created user.

***

### findAll()

> **findAll**(`options?`): `Promise`\<[`User`](../../../entities/User/classes/User.md)[]\>

Defined in: [repositories/UserRepository.ts:29](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserRepository.ts#L29)

Finds users matching criteria.

#### Parameters

##### options?

`FindManyOptions`\<[`User`](../../../entities/User/classes/User.md)\>

Find options.

#### Returns

`Promise`\<[`User`](../../../entities/User/classes/User.md)[]\>

Promise<User[]> - List of users.

***

### findByEmail()

> **findByEmail**(`email`): `Promise`\<[`User`](../../../entities/User/classes/User.md) \| `null`\>

Defined in: [repositories/UserRepository.ts:73](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserRepository.ts#L73)

Finds a user by Email.

#### Parameters

##### email

`string`

User Email.

#### Returns

`Promise`\<[`User`](../../../entities/User/classes/User.md) \| `null`\>

Promise<User | null>

***

### findById()

> **findById**(`id`): `Promise`\<[`User`](../../../entities/User/classes/User.md) \| `null`\>

Defined in: [repositories/UserRepository.ts:39](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserRepository.ts#L39)

Finds a user by ID.

#### Parameters

##### id

`number`

User ID.

#### Returns

`Promise`\<[`User`](../../../entities/User/classes/User.md) \| `null`\>

Promise<User | null>

***

### findByUUID()

> **findByUUID**(`uuid`): `Promise`\<[`User`](../../../entities/User/classes/User.md) \| `null`\>

Defined in: [repositories/UserRepository.ts:55](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserRepository.ts#L55)

Finds a user by UUID, loading essential relations for permissions.
Relations: managedNGO, managedSupplier, employedNGOs, employedSuppliers.

#### Parameters

##### uuid

`string`

User UUID.

#### Returns

`Promise`\<[`User`](../../../entities/User/classes/User.md) \| `null`\>

Promise<User | null>

***

### remove()

> **remove**(`user`): `Promise`\<[`User`](../../../entities/User/classes/User.md)\>

Defined in: [repositories/UserRepository.ts:93](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserRepository.ts#L93)

Removes a user entity.

#### Parameters

##### user

[`User`](../../../entities/User/classes/User.md)

User entity to remove.

#### Returns

`Promise`\<[`User`](../../../entities/User/classes/User.md)\>

Promise<User> - The removed user.

***

### save()

> **save**(`user`): `Promise`\<[`User`](../../../entities/User/classes/User.md)\>

Defined in: [repositories/UserRepository.ts:83](https://github.com/n4atan/sicronweb-backend/blob/6da41d0cd73c23ac881e1b63eab5f24170dd199e/src/repositories/UserRepository.ts#L83)

Saves a user entity.

#### Parameters

##### user

[`User`](../../../entities/User/classes/User.md)

User entity to save.

#### Returns

`Promise`\<[`User`](../../../entities/User/classes/User.md)\>

Promise<User> - The saved user.
