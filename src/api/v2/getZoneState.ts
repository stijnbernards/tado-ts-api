import tadoRequest from "~/tadoRequest";
import makeUrl from "~/makeUrl";

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
    sensorDataPoints?: {}
}

export interface Setting {
    type: 'HEATING' | 'HOT_WATER' | string,
    power: string,
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
