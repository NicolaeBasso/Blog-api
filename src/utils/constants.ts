export const jwtSecret = process.env.JWT_SECRET;
export const clientUrl = process.env.CORE_SERVICE_CLIENT_URL;
export enum UserRole {
  BLOGGER = 'BLOGGER',
  ADMIN = 'ADMIN',
}
export const ROLES_KEY = 'role';
