import tadoRequest from "~/tadoRequest";

export const API_URL = '/api/v2/homes/:homeId/state'

interface HomeState {
    presence: string
}

export default function homeState(homeId: string) {
    return tadoRequest<HomeState>(API_URL.replace(':homeId', homeId))
}
