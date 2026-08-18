export interface AssignedOperator {
  user_id: string;
  username: string;
  name: string;
  email: string;
  assigned_at: string;
  assigned_by: string;
  status: 'ACTIVE' | 'REVOKED';
}

export interface AssignGateOperatorResponse {
  status: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
  assigned_at: string;
}
