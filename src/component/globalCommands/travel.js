import * as Constants from '../constants'

// inObj = props, inCmd = array of input words
const travel = async (inObj, inCmd) => {

    let retVal
    if (inCmd === null || inCmd.length === 1) {//no modifiers 
        retVal = await new Promise((resolve, reject) => setResponse(resolve, 'Nowhere to go.'))
    } else {
        let userName = inCmd[1]
        if (userName[0] === '@') userName = userName.substr(1)

        let postUrl = `${Constants.HOST_URL}:${Constants.EXPRESS_PORT}/loadDefaultPlace`
        const postData = {
            userName: userName
        }
        await fetch(postUrl, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(response => {
            const retObj = response[0]
            retObj.type = 'place'
            retVal = new Promise((resolve, reject) => setResponse(resolve, retObj))
        })
        .catch(err => {
            console.log(err);
        })

        
    }

    return retVal
}

function setResponse(resolve, msg) {
    return resolve(msg)
}

export default travel