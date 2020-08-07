const look = async (inObj, inCmd) => {
    inObj = inObj || null
    inCmd = inCmd || null
    //let promise = new Promise((resolve, reject) => { });
    let retVal   
    if (inObj === null)
        retVal = await new Promise((resolve, reject) => () => setResponse(resolve,"You see nothing."))

    if (typeof(inObj['placeId']) !== 'undefined') {
        const exits = inObj.exits
        const poi = inObj.poi

        if (inCmd === null || inCmd.length === 1) {
            retVal = await new Promise((resolve, reject) => setResponse(resolve, inObj.description))
        }
        else {
        const target = inCmd[1]
        try {
        //Check for valid look targets in the place
        retVal = await new Promise((resolve, reject) => checkExits(exits,target,resolve, reject))
        if (retVal === null)
            retVal = await new Promise((resolve, reject) => checkPoi(poi,target,resolve, reject))

        //retVal = await checkExits(exits,target)  
        
        }catch(e) {
            throw e;      // let caller know the promise was rejected with this reason
        }
        }
    }
    return retVal
}
function setResponse(resolve, msg) {
    return resolve(msg)
}
function checkPoi(poi,target,resolve,reject) {
    if (Array.isArray(poi))
    poi.forEach(poi => {
        console.log(poi)
        if (poi.word.toLowerCase() === target.toLowerCase()) return resolve(poi.description)
    })
    const article = target.slice(-1) === 's' ? 'are' : 'is'
    return resolve(`There ${article} no ${target} here.`)
}
function checkExits(exits,target,resolve, reject) {
    if (Array.isArray(exits))
    exits.forEach(exit => {
        for (const [key,value] of Object.entries(exit)) {
            if (key.toLowerCase() === target.toLowerCase()) {
                return resolve(value.title)
            }
        }
    })
    return resolve(null)
}
export default look