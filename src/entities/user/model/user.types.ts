export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  avatar?: string;
}

export type CurrentUser = User & {
  isAuthenticated: boolean;
  role: 'admin' | 'user' | 'guest';
};

export type CreateUserDto = Omit<User, 'id'>;
export type UpdateUserDto = Partial<CreateUserDto> & { id: number };
