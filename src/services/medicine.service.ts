import { IApiResponse } from '@/types';
import axios from 'axios';

export const medicineApi = {
  suggestMedicine: (
    keyword: string,
  ): Promise<IApiResponse<[number, string[], null, string[][]]>> => {
    return axios.get(
      `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${keyword}&cf=DISPLAY_NAME`,
    );
  },
};
