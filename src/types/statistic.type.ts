export interface IStatistic {
  totalPatients: number;
  // totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
}

export interface IStatisticDate {
  date: string;
  numberOfPatients: number;
  numberOfAppointments: number;
  revenue: number;
}

export interface IGetStatisticParams {
  clinicId: string;
  date?: string;
  days?: string;
}

export interface IGetStatisticDateParams {
  clinicId: string;
  startDate: string;
  endDate: string;
}
