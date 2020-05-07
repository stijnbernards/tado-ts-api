import tadoRequest from "../../tadoRequest";
import makeUrl from "../../makeUrl";

const API_URL = '/api/v2/homes/:homeId/zones/:zoneId/state'

export interface ZoneState {
    tadoMode: string,
    geolocationOverride: boolean,
    geolocationOverrideDisableTime?: string,
    preparation?: string,
    setting: Setting,
    overlayType?: string,
    overlay?: string,
    openWindow?: string,
    nextScheduleChange?: NextScheduleChange,
    link: Link,
    activityDataPoints?: {},
    sensorDataPoints: SensorDataPoints
}

export interface InsideTemperature {
    celsius: string
    fahrenheit: string
    type: 'TEMPERATURE' | string
    timestamp: string
}

export interface SensorDataPoints {
    insideTemperature?: InsideTemperature
    humidity?: Humidity
}

export interface Humidity {
    type: 'PERCENTAGE' | string
    percentage: string
    timestamp: string
}

export interface Setting {
    type: 'HEATING' | 'HOT_WATER' | string,
    power: 'ON' | string,
    temperature?: Temperature
}

export interface Temperature {
    celsius: number
    fahrenheit: number
}

export interface NextScheduleChange {
    start: string
    setting: Setting
}

export interface Link {
    state: string
}

export default function getZoneState(homeId: string, zoneId: string) {
    return tadoRequest<ZoneState>(
        makeUrl(API_URL, {
            ':homeId': homeId,
            ':zoneId': zoneId
        })
    )
}
