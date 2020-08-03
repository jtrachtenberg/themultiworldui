import {loadObject} from '../utils/formUtils'
import {userStateData} from '../utils/defaultObjects'

export const userLogin = (user, handler) => {
    let postUrl = "http://localhost:7555/loginUser"
    if (user.userId === -1)
        postUrl = "http://localhost:7555/addUser"

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