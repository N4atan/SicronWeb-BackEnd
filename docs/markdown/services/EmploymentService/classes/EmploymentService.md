[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [services/EmploymentService](../README.md) / EmploymentService

# Class: EmploymentService

Defined in: services/EmploymentService.ts:16

Service to handle employment logic for NGOs and Suppliers.
Centralizes hire, dismiss, and block operations to avoid duplication.

## Constructors

### Constructor

> **new EmploymentService**(): `EmploymentService`

#### Returns

`EmploymentService`

## Methods

### block()

> `static` **block**(`userRepo`, `orgRepo`, `org`, `reqUser`, `userEmployedProperty`, `blockListProperty`): `Promise`\<\{ `message?`: `string`; `status`: `number`; \}\>

Defined in: services/EmploymentService.ts:144

Blocks or unblocks a user/employee from an organization.

#### Parameters

##### userRepo

`Repository`\<[`User`](../../../entities/User/classes/User.md)\>

UserRepository instance.

##### orgRepo

`Repository`\<[`Organization`](../type-aliases/Organization.md)\>

Repository for the organization.

##### org

[`Organization`](../type-aliases/Organization.md)

The organization entity.

##### reqUser

[`User`](../../../entities/User/classes/User.md)

The user performing the block (usually the user themselves blocking the org).

##### userEmployedProperty

The property name on User for employed orgs.

`"employedNGOs"` | `"employedSuppliers"`

##### blockListProperty

The property name on User for blocked orgs.

`"blockedSuppliers"` | `"blockedNGOs"`

#### Returns

`Promise`\<\{ `message?`: `string`; `status`: `number`; \}\>

Promise<{ status: number, message?: string }> - Result status and message.

***

### dismiss()

> `static` **dismiss**(`userRepo`, `orgRepo`, `org`, `userUUID`, `userEmployedProperty`, `reqUser`): `Promise`\<\{ `message?`: `string`; `status`: `number`; \}\>

Defined in: services/EmploymentService.ts:85

Removes an employee from an organization.

#### Parameters

##### userRepo

`Repository`\<[`User`](../../../entities/User/classes/User.md)\>

UserRepository instance.

##### orgRepo

`Repository`\<[`Organization`](../type-aliases/Organization.md)\>

Repository for the organization.

##### org

[`Organization`](../type-aliases/Organization.md)

The organization entity.

##### userUUID

`string`

The UUID of the user to remove.

##### userEmployedProperty

The property name on User for employed orgs.

`"employedNGOs"` | `"employedSuppliers"`

##### reqUser

The user making the request (for permission check).

###### role

`string`

###### uuid

`string`

#### Returns

`Promise`\<\{ `message?`: `string`; `status`: `number`; \}\>

Promise<{ status: number, message?: string }> - Result status and message.

***

### hire()

> `static` **hire**(`userRepo`, `orgRepo`, `org`, `userUUID`, `role`, `blockListProperty`, `employeesProperty`, `userEmployedProperty`): `Promise`\<\{ `message?`: `string`; `status`: `number`; \}\>

Defined in: services/EmploymentService.ts:30

Adds an employee to an organization.

#### Parameters

##### userRepo

`Repository`\<[`User`](../../../entities/User/classes/User.md)\>

UserRepository instance.

##### orgRepo

`Repository`\<[`Organization`](../type-aliases/Organization.md)\>

Repository for the organization (NGO or Supplier).

##### org

[`Organization`](../type-aliases/Organization.md)

The organization entity (must include employees relation).

##### userUUID

`string`

The UUID of the user to add.

##### role

[`UserRole`](../../../entities/User/enumerations/UserRole.md)

The role to assign (NGO_EMPLOYER or SUPPLIER_EMPLOYER).

##### blockListProperty

The property name on User that holds blocked UUIDs.

`"blockedSuppliers"` | `"blockedNGOs"`

##### employeesProperty

`"employees"`

The property name on Organization that holds the list of employees.

##### userEmployedProperty

The property name on User that holds the list of employed organizations.

`"employedNGOs"` | `"employedSuppliers"`

#### Returns

`Promise`\<\{ `message?`: `string`; `status`: `number`; \}\>

Promise<{ status: number, message?: string }> - Result status and message.
