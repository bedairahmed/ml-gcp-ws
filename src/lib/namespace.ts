/**
 * Firestore Namespace Isolation
 *
 * Each Cloud Run instance can set VITE_NAMESPACE to isolate its data
 * in the shared Firestore database. For example:
 *   VITE_NAMESPACE=student1  → collections become "student1_users", "student1_events", etc.
 *
 * If not set, collections use their default names (no prefix).
 */

const NAMESPACE = import.meta.env.VITE_NAMESPACE || "";

/**
 * Returns a namespaced collection name.
 * e.g. ns("users") → "student1_users" (if VITE_NAMESPACE=student1)
 *      ns("users") → "users"          (if no namespace set)
 */
export const ns = (collectionName: string): string => {
  return NAMESPACE ? `${NAMESPACE}_${collectionName}` : collectionName;
};

export const getNamespace = (): string => NAMESPACE;
