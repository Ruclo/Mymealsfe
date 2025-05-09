export enum UserRole {
    Admin = 'AdminRole',
    RegularStaff = 'Regular Staff'
}

export type User = {
  username: string;
  role: UserRole
};