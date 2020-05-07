import tadoRequest from "../../tadoRequest";
import makeUrl from "../../makeUrl";

export const API_URL = '/api/v2/homes/:homeId/zones'

export interface Zone {
    id: number,
    name: string,
    type: 'HEATING' | 'HOT_WATER' | string
    dateCreated: string,
    deviceTypes: string[],
    devices: Device[],
    reportAvailable: boolean,
    supportsDazzle: boolean,
    dazzleEnabled: boolean,
    dazzleMode: DazzleMode,
    openWindowDetection: OpenWindowDetection
}

export interface Device {
    deviceType: string,
    serialNo: string,
    shortSerialNo: string,
    currentFwVersion: number,
    connectionState: DeviceConnectionState,
    characteristics: DeviceCharacteristics,
    batteryState: string,
    duties: string[]
}

export interface DeviceConnectionState {
    value: boolean,
    timestamp: string
}

export interface DeviceCharacteristics {
    // TODO:Check enum values
    capabilities: string[]
}

export interface DazzleMode {
    supported: boolean,
    enabled: boolean
}

export interface OpenWindowDetection {
    supported: boolean,
    enabled: boolean,
    timeoutInSeconds: number
}

export default function getZones(homeId: string) {
    return tadoRequest<Zone[]>(
        makeUrl(API_URL, {':homeId': homeId})
    )
}
