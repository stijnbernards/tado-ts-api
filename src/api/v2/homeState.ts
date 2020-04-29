import tadoRequest from "~/tadoRequest";
import makeUrl from "~/makeUrl";

export const API_URL = '/api/v2/homes/:homeId/state'

interface HomeState {
    presence: string
}

export default function homeState(homeId: string) {
    return tadoRequest<HomeState>(
        makeUrl(API_URL, { ':homeId': homeId })
    )
}
