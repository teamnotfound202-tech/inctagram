import {baseApi} from "@/shared/api";
import { DeleteDevice, DevicesTypeResponse } from '@/features/devices/api/types'

export const devicesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCurrentDevice: builder.query<DevicesTypeResponse, void>({
      query: () => '/sessions',
      providesTags: ['GetDevice'],
    }),
    terminateAll: builder.mutation<void, void>({
      query: () => ({
        url: '/sessions/terminate-all',
        method: 'DELETE',
      }),
      invalidatesTags: ['GetDevice'],
    }),
    deleteDevice: builder.mutation<void, DeleteDevice>({
      query: ({ deviceId }) => ({
        url: `/sessions/${deviceId}`,
        method: 'DELETE',
        params: {deviceId}
      }),
    }),
  }),
})

export const {useGetCurrentDeviceQuery, useTerminateAllMutation,useDeleteDeviceMutation} = devicesApi