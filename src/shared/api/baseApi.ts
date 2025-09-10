import {baseQueryWithReAuth} from '@/shared/api/baseQueryWithReauth';
import {createApi} from '@reduxjs/toolkit/query/react';


export const baseApi = createApi({
  reducerPath: 'inctagramApi',
  baseQuery: baseQueryWithReAuth,

  endpoints: () => ({})
});

export type baseApi = typeof baseApi;

// async (args, api, extraOptions) => {
//     const result = await fetchBaseQuery({
//         baseUrl: 'https://connectpix.site/api/v1/',
//         prepareHeaders: (headers) => {
//             if (typeof window !== 'undefined') {
//                 headers.set(
//                     'Authorization',
//                     `Bearer ${sessionStorage.getItem(ACCESS_TOKEN)}`
//                 );
//             }
//         }
//     })(args, api, extraOptions);
//
//     handleError(api, result);
//
//     return result;
// },