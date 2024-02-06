export interface ISupplies {
  id: number;
  name: string;
  stock: number;
  expiry?: string;
  unit: string;
  description?: string;
  note?: string;
  vendor?: string;
  categoryId?: number;
  categoryName?: string;
  clinicId: string;
  expiredAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  isDisabled: boolean;
  disabledAt?: Date;
}

export interface ISuppliesQueryParams {
  clinicId?: string;
  medicineName?: string;
  vendor?: string;
  isDisabled?: boolean;
}

export interface ICreateSuppliesPayload {
  medicineName: string;
  stock: number;
  expiry?: string;
  unit: string;
  description?: string;
  note?: string;
  vendor?: string;
  categoryId?: number;
  clinicId: string;
}
