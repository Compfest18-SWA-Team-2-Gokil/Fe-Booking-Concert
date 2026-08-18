export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: 'BUYER' | 'ORGANIZER' | 'GATE_OPERATOR' | 'ADMIN';
}
