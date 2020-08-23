import * as Constants from '../constants'


export const fetchData = async (cmd, postData) => {
    const postUrl = `${Constants.HOST_URL}:${Constants.EXPRESS_PORT}/${cmd}`

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