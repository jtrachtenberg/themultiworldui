export const User = {
    userId: 0,
    userName: "",
    email: "",
    description: "",
    isRoot: false,
    stateData: null
}

export const userStateData = {
    currentRoom: 0,
    currentSpace: 0
}

export const Space = {
    spaceId: 0,
    userId: 0,
    title: "",
    description: ""
}

export const Place = {
    placeId: 0,
    spaceId: 0,
    title: "",
    description: "",
    exits: null
}