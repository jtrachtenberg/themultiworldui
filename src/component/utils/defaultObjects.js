import * as Constants from '../constants'

export const User = {
    userId: 0,
    userName: "",
    email: "",
    description: "",
    isRoot: false,
    stateData: null
}

export const userStateData = {
    currentRoom: Constants.DEFAULT_PLACE,
    currentSpace: Constants.DEFAULT_SPACE
}

export const Space = {
    spaceId: Constants.DEFAULT_SPACE,
    userId: 0,
    title: "",
    description: ""
}

export const Place = {
    placeId: 0,
    spaceId: 0,
    title: "",
    description: "",
    exits: [],
    poi: [],
    objects: [],
    images: [],
    src: null,
    alt: null
}