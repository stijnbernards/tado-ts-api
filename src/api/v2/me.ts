import tadoRequest from "../../tadoRequest";

export const API_URL = '/api/v2/me'

export interface User {
    name: string
    email: string
    username: string
    enabled: boolean
    id: string
    homes: UserHome[]
    locale: string
    type: string
}

export interface UserHome {
    name: string
    id: number
}

export default function me() {
    return tadoRequest<User>(API_URL)
}
