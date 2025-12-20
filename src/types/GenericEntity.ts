/**
 * @fileoverview GenericEntity - Abstract base class for SICRON entities with dual identifier pattern
 * @author SICRON Backend Team
 * @version 1.1.0
 * @since 1.0.0
 */

/**
 * Abstract base class providing common identifier patterns for SICRON entities.
 * 
 * This class implements the dual identifier pattern used throughout the SICRON system,
 * where entities have both a database-generated ID (integer) and a UUID (string) field.
 * 
 * ## Design Philosophy
 * 
 * The dual identifier system serves multiple architectural and security purposes:
 * 
 * ### Security Through Obscurity
 * UUIDs are cryptographically random and non-sequential, preventing:
 * - Enumeration attacks where attackers guess sequential IDs
 * - Information disclosure about internal database structure
 * - Timing attacks based on ID progression
 * 
 * Example attack prevention:
 * ```typescript
 * // Bad: Exposing sequential IDs
 * GET /api/users/1  // Next: /api/users/2, /api/users/3...
 * 
 * // Good: Using UUIDs
 * GET /api/users/550e8400-e29b-41d4-a716-446655440000  // Not guessable
 * ```
 * 
 * ### API Stability and Versioning
 * UUIDs remain stable even when:
 * - Database schema changes
 * - Internal data migrations occur
 * - Entity relationships are restructured
 * - Microservices are split or merged
 * 
 * ### Distributed System Compatibility
 * UUIDs can be generated independently across services:
 * ```typescript
 * // Service A creates entity with UUID
 * const entity = await serviceA.create({ name: "NGO A" });
 * 
 * // Service B can reference same entity without database lookup
 * await serviceB.linkToEntity(entity.uuid);
 * ```
 * 
 * ### Performance Considerations
 * - **ID fields**: Optimized for database joins and foreign key relationships
 * - **UUID fields**: Used for external references and API endpoints
 * 
 * @example
 * ```typescript
 * // Basic usage
 * class User extends GenericEntity {
 *   username: string;
 *   email: string;
 * }
 * 
 * // Usage in repositories
 * class UserRepository {
 *   async findByUUID(uuid: string): Promise<User | null> {
 *     return this.repository.findOne({ where: { uuid } });
 *   }
 * 
 *   async findById(id: number): Promise<User | null> {
 *     return this.repository.findOne({ where: { id } });
 *   }
 * 
 *   async createSecureResponse(user: User): Promise<UserResponse> {
 *     // Safe to expose UUID in public API
 *     return {
 *       uuid: user.uuid,      // Public API safe
 *       username: user.username,
 *       email: user.email
 *       // Note: user.id is NOT exposed
 *     };
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Usage in services with proper security
 * class NGOService {
 *   async getNGOForPublicAPI(uuid: string): Promise<NGOPublicDTO> {
 *     const ngo = await this.ngoRepo.findByUUID(uuid);
 *     if (!ngo) throw new NotFoundError();
 * 
 *     return {
 *       uuid: ngo.uuid,        // Safe for public API
 *       name: ngo.name,
 *       description: ngo.description
 *       // ngo.id is intentionally not included
 *     };
 *   }
 * 
 *   async findNGOsForJoin(limit: number): Promise<NGO[]> {
 *     // ID-based queries are faster for joins
 *     return this.ngoRepo.createQueryBuilder('ngo')
 *       .leftJoinAndSelect('ngo.manager', 'manager')
 *       .orderBy('ngo.id', 'DESC')  // Fast integer comparison
 *       .take(limit)
 *       .getMany();
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Audit trail example
 * class AuditService {
 *   async logEntityAccess(entity: GenericEntity, action: string): Promise<void> {
 *     await this.auditRepo.save({
 *       entityUuid: entity.uuid,      // Stable reference
 *       action: action,
 *       timestamp: new Date(),
 *       // entity.id would be useless if entity gets re-keyed
 *     });
 *   }
 * }
 * ```
 * 
 * @design-patterns
 * - **Entity Component System**: Entities extend this base for consistent behavior
 * - **Repository Pattern**: Both ID and UUID-based finders are available
 * - **Data Transfer Object**: Always use UUID for external APIs
 * 
 * @security-guidelines
 * 1. Never expose `id` field in public APIs or logs
 * 2. Always use `uuid` for external entity references
 * 3. Use `id` only for internal database operations
 * 4. Index both `id` and `uuid` fields in database
 * 5. Validate UUID format in input validation
 * 
 * @performance-guidelines
 * - Use `id` for JOIN operations (faster integer comparison)
 * - Use `uuid` for WHERE clauses on external APIs
 * - Cache entities by `uuid` for distributed systems
 * - Consider `id` for bulk operations and reporting
 * 
 * @migration-notes
 * - When migrating data, preserve UUIDs to maintain API compatibility
 * - ID changes are internal-only and shouldn't affect external systems
 * - Consider UUIDs as permanent entity fingerprints
 * 
 * @see {@link https://tools.ietf.org/html/rfc4122} RFC 4122 - UUID Specification
 * @see {@link https://typeorm.io/entities#column-options} TypeORM Column Options
 */
import {PrimaryGeneratedColumn, Column, Generated} from 'typeorm';

export abstract class GenericEntity {
    /**
     * Internal database-generated primary key identifier.
     * 
     * This field serves as the primary key in the database and is automatically
     * generated using TypeORM's @PrimaryGeneratedColumn() decorator. It provides:
     * 
     * - **Performance**: Integer comparison is significantly faster than string comparison
     * - **Storage Efficiency**: Uses 4-8 bytes vs 36 bytes for UUIDs
     * - **Foreign Key Optimization**: Database joins are optimized for integer keys
     * - **Sequential Access**: Enables efficient range queries and pagination
     * 
     * ### Database Configuration
     * ```sql
     * -- Auto-increment primary key
     * ALTER TABLE usertbl ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY;
     * ```
     * 
     * ### TypeORM Decorator
     * ```typescript
     * @PrimaryGeneratedColumn()
     * public id?: number;
     * ```
     * 
     * ### Usage Guidelines
     * - **Internal Use Only**: Never expose in public APIs, logs, or external communications
     * - **Database Operations**: Use for all internal queries, joins, and relationships
     * - **Performance Critical**: Preferred for bulk operations and reporting
     * - **Foreign Keys**: Use as foreign key references in related tables
     * 
     * ### Security Considerations
     * - Do not log this field in production logs
     * - Do not include in API responses or error messages
     * - Do not use in client-side calculations or display
     * - Treat as internal implementation detail
     * 
     * @example
     * ```typescript
     * // Good: Internal database operations
     * await userRepo.findOne({ where: { id: userId } });
     * await queryBuilder.where('user.id = :id', { id: userId });
     * 
     * // Bad: External API usage
     * return { id: user.id, name: user.name };  // Never expose!
     * ```
     * 
     * @performance High - Optimized for database operations
     * @visibility Internal use only
     * @format Auto-incrementing integer
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Public-facing universally unique identifier for the entity.
     * 
     * This field contains a UUID (Universally Unique Identifier) that serves as the
     * primary external reference for the entity. Generated using TypeORM's @Generated('uuid')
     * decorator, it provides:
     * 
     * - **Global Uniqueness**: Extremely low probability of collisions
     * - **Security**: Non-guessable, non-sequential identifiers
     * - **Distribution Ready**: Can be generated independently across services
     * - **API Stability**: Remains constant even if internal ID changes
     * 
     * ### Database Configuration
     * ```sql
     * -- Unique constraint with index for performance
     * ALTER TABLE usertbl ADD COLUMN uuid VARCHAR(36) UNIQUE;
     * CREATE INDEX idx_usertbl_uuid ON usertbl(uuid);
     * ```
     * 
     * ### TypeORM Decorator
     * ```typescript
     * @Column({unique: true, length: 36})
     * @Generated('uuid')
     * public uuid!: string;
     * ```
     * 
     * ### UUID Format
     * - **Length**: 36 characters (including hyphens)
     * **Format**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` where x is a hexadecimal digit
     * **Example**: `550e8400-e29b-41d4-a716-446655440000`
     * **Standard**: RFC 4122 Version 4 UUID
     * 
     * ### Usage Guidelines
     * - **Public APIs**: Primary identifier for all external references
     * - **URLs and Links**: Use in API endpoints and resource URLs
     * - **Cross-Service**: Reference entities across microservices
     * - **Audit Trails**: Stable identifier for logging and monitoring
     * - **Client Communication**: Safe to share with frontend and external systems
     * 
     * ### Security Benefits
     * - **Enumeration Prevention**: Cannot guess next/previous entities
     * - **Information Hiding**: Doesn't reveal database structure or size
     * - **Timing Attack Resistance**: No sequential pattern to exploit
     * - **BOLA Protection**: Broken Object Level Authorization prevention
     * 
     * @example
     * ```typescript
     * // Good: Public API usage
     * return { uuid: user.uuid, name: user.name, email: user.email };
     * GET /api/users/550e8400-e29b-41d4-a716-446655440000
     * 
     * // Good: Cross-service communication
     * await externalService.notifyUser(user.uuid, 'Account updated');
     * 
     * // Good: Audit logging
     * logger.info('User accessed', { userUuid: user.uuid, action: 'login' });
     * ```
     * 
     * @example
     * ```typescript
     * // Repository pattern with both identifiers
     * class UserRepository {
     *   // Fast internal lookup by ID
     *   async findById(id: number): Promise<User | null> {
     *     return this.repository.findOne({ where: { id } });
     *   }
     * 
     *   // Secure external lookup by UUID
     *   async findByUUID(uuid: string): Promise<User | null> {
     *     return this.repository.findOne({ where: { uuid } });
     *   }
     * 
     *   // Public API response - only UUID
     *   toPublicDTO(user: User): UserPublicDTO {
     *     return {
     *       uuid: user.uuid,      // Safe for public API
     *       username: user.username,
     *       email: user.email
     *       // user.id is intentionally excluded
     *     };
     *   }
     * }
     * ```
     * 
     * @see {@link https://www.rfc-editor.org/rfc/rfc4122} RFC 4122 - UUID Specification
     * @see {@link https://typeorm.io/entities#column-options} TypeORM Column Options
     * @performance Medium - String operations, indexed for production use
     * @visibility Public API safe
     * @format RFC 4122 Version 4 UUID (36 characters)
     */
    @Column({unique: true, length: 36})
    @Generated('uuid')
    public uuid!: string;
}
