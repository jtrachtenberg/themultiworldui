import * as Constants from '../constants'

const getUserId = (user) => {
    user = user||null
    if (!user) user = JSON.parse(localStorage.getItem('user'))
    if (user)
      return user.userId
    else return 0
  
  }
  const getToken = (user) => {
    user = user||null
    if (!user) user = JSON.parse(localStorage.getItem('user'))
    if (user)
      return user.token
    else return 0
  }

export const fetchMediaData = async (cmd, postData) => {
const postUrl = `${Constants.HOST_URL}:${Constants.UNSPLASH_PORT}/${cmd}`

let retVal = await new Promise((resolve, reject) => {
    fetch(postUrl, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData)
    }).then(response => response.json())
    .then (response => {
        return resolve(response)
    })
    .catch(e => {
        return reject(e)
    })
})

    return retVal
}

export const fetchData = async (cmd, postData) => {
    const postUrl = `${Constants.HOST_URL}:${Constants.EXPRESS_PORT}/${cmd}`
    const headers = {"Content-Type": "application/json"};
    const options = {method: "POST"}

    let token = postData.token
    let userId = postData.userId
    if (!token) token = getToken()
    if (!userId) {
        postData.userId = getUserId()
    }
    delete postData.token
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    let retVal = await new Promise((resolve, reject) => {
        fetch(postUrl, {
        ...options,
        headers: {
            ...headers,
        },
        body: JSON.stringify(postData)
        }).then(response => response.json())
        .then (response => {
            if (response.status === 401) throw new Error(401)
            return resolve(response)
        })
        .catch(e => {
            return reject(e)
        })
    })

    return retVal
}