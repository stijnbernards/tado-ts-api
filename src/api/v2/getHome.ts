import tadoRequest from "../../tadoRequest";

export const API_URL = '/api/v2/homes/'

export interface Home {
    id: number
    name: string
    dateTimeZone: string
    dateCreated: string
    temperatureUnit: string
    installationCompleted: boolean
    partner: string
    simpleSmartScheduleEnabled: boolean
    awayRadiusInMeters: number
    usePreSkillsApps: boolean
    skills: string[]
    christmasModeEnabled: boolean
    contactDetails: ContactDetails
    address: Address
    geolocation: GeoLocation
    consentGrantSkippable: boolean
}

export interface ContactDetails {
    name: string
    email: string
    phone: string
}

export interface Address {
    addressLine1: string
    addressLine2: string
    zipCode: string
    city: string
    state: string
    country: string
}

export interface GeoLocation {
    latitude: number
    longitude: number
}

export default function getHome(homeId: string) {
    return tadoRequest<Home>(`${API_URL}${homeId}`)
}
