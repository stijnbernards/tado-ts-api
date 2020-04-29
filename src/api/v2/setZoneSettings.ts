import {Setting} from "~/api/v2/getZoneState";
import tadoRequest from "~/tadoRequest";
import makeUrl from "~/makeUrl";

export interface SetSettings {
    setting: Setting,
    termination: Termination
}

export interface Termination {
    type: 'MANUAL' | string
}

export interface OverlayResponse {
    type: 'MANUAL' | string
    setting: Setting
    termination: {
        type: 'MANUAL' | string
        projectedExpiry?: string
    }
}

const API_URL = '/api/v2/homes/:homeId/zones/:zoneId/overlay'

export default function setZoneSettings(homeId: string, zoneId: string, newSettings: SetSettings) {
    return tadoRequest<OverlayResponse>(
        makeUrl(API_URL, {':homeId': homeId, ':zoneId': zoneId}),
        {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'PUT',
            body: JSON.stringify(newSettings)
    })
}
