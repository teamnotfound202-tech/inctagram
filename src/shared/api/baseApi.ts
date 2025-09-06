import { ACCESS_TOKEN } from '@/shared/lib/constants/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'inctagramApi',
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: 'https://connectpix.site/api/v1/',
      prepareHeaders: (headers) => {
        if (typeof window !== 'undefined') {
          headers.set(
            'Authorization',
            `Bearer ${sessionStorage.getItem(ACCESS_TOKEN)}`
          );
        }
      }
    })(args, api, extraOptions);

    return result;
  },
  endpoints: () => ({})
});
export type baseApi = typeof baseApi;
