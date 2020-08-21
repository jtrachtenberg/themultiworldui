import {loadObject} from '../utils/formUtils'
import {userStateData} from '../utils/defaultObjects'
import {fetchData} from '../utils/fetchData'

export const userLogin = (user, handler) => {
    let postUrl = `loginUser`
    if (user.userId === -1)
        postUrl = `addUser`

    fetchData(postUrl, user)
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