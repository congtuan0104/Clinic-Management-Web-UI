import { IServicePlan } from '@/types';

export interface IAddClinicRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  description?: string;
  lat?: number;
  long?: number;
  planId: string;
}

export interface IClinicQueryParams {
  ownerId?: string;
  name?: string;
  staffId?: number;
  isActive?: boolean;
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
  lat?: number;
  long?: number;
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
  plans?: IServicePlan;
}

export interface IClinicWithSubscription {
  clinic: IClinic;
  subscription: IClinicSubscription;
}

export interface IAddUserGroupRoleRequest {
  name: string;
  description: string;
  permissions: number[];
}

export interface IUserGroupRole {
  id: number;
  name: string;
  description: string;
  rolePermissions: IRolePermission[];
}

export interface IRolePermission {
  id: number;
  optionName: string;
  description?: string;
  isServiceOption?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface IUpdateClinic {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  description?: string;
  lat?: number;
  long?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IUpdateRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  lat?: number;
  long?: number;
  description?: string;
}

export interface IClinicMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  isOwner: boolean;
  role: {
    id: number;
    name: string;
  };
}

export interface IInviteClinicMemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  clinicId: string;
}
