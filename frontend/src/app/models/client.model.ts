export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  nextRenewalDate?: Date;
  isActive: boolean;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  nextRenewalDate?: string;
  isActive?: boolean;
  userId?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}