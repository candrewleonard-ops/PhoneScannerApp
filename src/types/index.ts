export * from './database';
export * from './navigation';

export interface User {
  id: string;
  email: string;
  name?: string;
}
