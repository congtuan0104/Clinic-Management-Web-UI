export interface IAddClinicRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
    description: string;
    planId: string;
  }

  export interface IAddClinicService {
    id: number;
    name: string;    
    email: string,
    phone: string,
    address: string,
    isActive: boolean,
    createdAt: Date;
    updatedAt?: Date;
  }