import tadoRequest from "~/tadoRequest";

export const API_URL = '/api/v1/me'

export interface User {
    name: string
    email: string
    username: string
    enabled: boolean
    id: string
    homeId: number
    locale: string
    type: string
}

export default function me() {
    return tadoRequest<User>(API_URL)
}
