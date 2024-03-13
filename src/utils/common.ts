import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';

export const LocalStorage = {
  get(key: string) {
    const data = window.localStorage.getItem(key);

    //type ReturnType = ???
    if (data !== null) {
      return data;
    }

    return null;
  },

  set(key: string, value: any) {
    window.localStorage.setItem(key, value as any);
  },

  remove(key: string) {
    window.localStorage.removeItem(key);
  },

  clear() {
    window.localStorage.clear();
  },
};

export const cookies = {
  getAll(option?: OptionsType) {
    const data = getCookies(option);

    if (data !== null || data !== undefined) {
      return data;
    }

    return null;
  },
  get(key: string, option?: OptionsType) {
    const data = getCookie(key, option);

    if (data !== null || data !== undefined) {
      return data;
    }

    return null;
  },

  set(key: string, value: any, option?: OptionsType) {
    setCookie(key, value, option);
  },

  remove(key: string, option?: OptionsType) {
    deleteCookie(key, option);
  },
};

// export function uniqueBy(a: any, key: any) {
//   var seen = {};
//   return a.filter(function(item: any) {
//       var k = key(item);
//       return seen.hasOwnProperty(k) ? false : (seen[k] = true);
//   })
// }
