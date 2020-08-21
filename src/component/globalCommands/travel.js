import {fetchData} from '../utils/fetchData'

// inObj = props, inCmd = array of input words
const travel = async (inObj, inCmd) => {

    let retVal
    if (inCmd === null || inCmd.length === 1) {//no modifiers 
        retVal = await new Promise((resolve, reject) => setResponse(resolve, 'Nowhere to go.'))
    } else {
        let userName = inCmd[1]
        if (userName[0] === '@') userName = userName.substr(1)

        const postData = {
            userName: userName
        }
        await fetchData('loadDefaultPlace', postData)
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