import {loadObject} from '../utils/formUtils'
import {userStateData} from '../utils/defaultObjects'
import * as Constants from '../constants'

export const userLogin = (user, handler) => {
    let postUrl = `${Constants.HOST_URL}:${Constants.EXPRESS_PORT}/loginUser`
    if (user.userId === -1)
        postUrl = `${Constants.HOST_URL}:${Constants.EXPRESS_PORT}/addUser`

    fetch(postUrl, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(response => {
        const finalResponse = user.userId === -1 ? response[0] : response
        loadObject(finalResponse, user)
    if (typeof(user.password) !== 'undefined') delete user.password 
    if (user.stateData === null) {
        user.stateData = userStateData
    }
    localStorage.setItem('user', JSON.stringify(user));
    handler(user)
    return user
    })
    .catch(err => {
        console.log(err);
    }); 
    return user
}