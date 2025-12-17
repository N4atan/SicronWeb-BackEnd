/**
 * Enum representing the approval status of an entity or request.
 */
export enum ApprovalStatus {
    /** Entity is waiting for approval. */
    PENDING = 'pending',
    /** Entity has been approved. */
    APPROVED = 'approved',
    /** Entity has been rejected. */
    REJECTED = 'rejected',
}
