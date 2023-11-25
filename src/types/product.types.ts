/**
 * Các chức năng trong một gói sản phẩm
 */
export interface IPlanOption {
  id: number;
  planId: number;
  // planName: string;
  // description: string;
  optionId: number;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Các gói sản phẩm chức năng cung cấp cho phòng khám
 */
export interface IServicePlan {
  id: number;
  planName: string;
  currentPrice: number;
  duration: number;
  description: string;
  isActive: boolean;
  updatedAt: Date;
  createdAt: Date;
  planOptions: IPlanOption[];
}
