
// inObj = props, inCmd = array of input words
const goto = async (inObj, inCmd, modalReturn) => {
    let retVal
    if (inCmd === null || inCmd.length === 1) {//no modifiers 
        retVal = await new Promise((resolve, reject) => setResponse(resolve, 'Nowhere to go.'))
    } else {
        const placeId = Number(inCmd[1])
        if (isNaN(placeId)) retVal = await new Promise((resolve, reject) => setResponse(resolve, 'Where?'))
        else {
            const user = inObj.inUser
            const stateData = user.stateData
            stateData.newRoom=placeId
            stateData.adminMove=true
            user.stateData = stateData
            inObj.updateUserHandler(user)
            retVal = await new Promise((resolve, reject) => setResponse(resolve, 'Here we go!'))
        }
    }

    return retVal
}

function setResponse(resolve, msg) {
    return resolve(msg)
}

export default goto
