[**SicronWeb API v1.0.0**](../../../README.md)

***

[SicronWeb API](../../../README.md) / [middlewares/cacheMiddleware](../README.md) / cacheMiddleware

# Function: cacheMiddleware()

> **cacheMiddleware**(`durationSeconds`): (`req`, `res`, `next`) => `Promise`\<`void` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: middlewares/cacheMiddleware.ts:9

Higher-order middleware function to cache GET responses in Redis.

## Parameters

### durationSeconds

`number` = `60`

Time to live in seconds (default 60).

## Returns

> (`req`, `res`, `next`): `Promise`\<`void` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>

### Parameters

#### req

`Request`

#### res

`Response`

#### next

`NextFunction`

### Returns

`Promise`\<`void` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>
