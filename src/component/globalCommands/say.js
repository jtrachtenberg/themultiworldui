// inObj = props, inCmd = array of input words
const say = async (inObj, inCmd) => {
    const socket = inObj.socket
    let retVal
    if (inCmd === null || inCmd.length === 1) {//no modifiers 
        retVal = await new Promise((resolve, reject) => setResponse(resolve, 'You are very quiet.'))
    } else {
        inCmd.shift()
        const message = inCmd.join(" ")
        const placeId = inObj.inPlace.placeId
        socket.emit('incoming data', {msg: message, msgPlaceId: placeId, userName: inObj.inUser.userName})
        retVal = await new Promise((resolve, reject) => setResponse(resolve, `You say: ${message}`))
    }

    return retVal
}

function setResponse(resolve, msg) {
    return resolve(msg)
}

export default say