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

export interface IAdminStatisticDate {
  summary: {
    totalRevenue: number;
    totalClinics: number;
    startDate: string;
    endDate: string;
  }
  clinics: {
    clinicId: string;
    clinicName: string;
    totalRevenue: number;
    data: IStatisticDate[];
  }[]
  details: {
    date: string;
    revenue: number;
  }[]
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

export interface IGetAdminStatisticDateParams {
  startDate: string;
  endDate: string;
}
