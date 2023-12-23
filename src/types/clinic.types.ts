export interface IAddClinicRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  description?: string;
  planId: string;
}

export interface IAddClinicService {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IClinic {
  id: string;
  name: string;
  phone: string;
  email: string;
  ownerId: string;
  address: string;
  logo?: string;
  description?: string;
  metadata?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  subscriptions?: IClinicSubscription[];
}

export interface IClinicSubscription {
  id: string;
  clinicId: string;
  planId: number;
  status: number;
  subcribedAt: Date;
  expiredAt: Date;
  unSubcribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isDisabled: boolean;
  disabledAt?: Date;
}

export interface IClinicWithSubscription {
  clinic: IClinic;
  subscription: IClinicSubscription;
}
