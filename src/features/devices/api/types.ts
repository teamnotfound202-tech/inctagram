import { ISOStringFormat } from 'date-fns'


export type CurrentDeviceType = {
  deviceId: number
  ip: string
  lastActive: ISOStringFormat
  browserName: string
  browserVersion: string
  deviceName: string
  osName: string
  osVersion: string
  deviceType?: string
}

export type OtherDevice = {
  deviceId: number
  ip: string
  lastActive: ISOStringFormat
  browserName: string
  browserVersion: string
  deviceName: string
  osName: string
  osVersion: string
  deviceType?: string
}

export type DevicesTypeResponse = {
  current: CurrentDeviceType
  others: OtherDevice[]
}

export type DeleteDevice = {
  deviceId: number
}