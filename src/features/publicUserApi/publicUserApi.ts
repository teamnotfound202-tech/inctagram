
import type {GetPublicUsers} from '@/features/publicUserApi/types';
import {baseApi} from '@/shared/api';

export const publicUserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPublicUsers: builder.query<GetPublicUsers, void>({
            query: () => "/api/v1/public-user",
        }),
    }),
})

export const {useGetPublicUsersQuery} = publicUserApi