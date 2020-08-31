// inObj = props, inCmd = array of input words
// This will take the current place and react to poi and exits
const look = async (inObj, inCmd) => {
    inObj = inObj || null
    inCmd = inCmd || null
    //let promise = new Promise((resolve, reject) => { });
    let retVal   
    if (inObj === null)
        retVal = await new Promise((resolve, reject) => () => setResponse(resolve,"You see nothing."))

    const place = inObj.inPlace
    if (typeof(place['placeId']) !== 'undefined') {
        const exits = place.exits
        const poi = place.poi
        const objects = place.objects

        if (inCmd === null || inCmd.length === 1) {
            retVal = await new Promise((resolve, reject) => setResponse(resolve, place.description))
        }
        else {
        let target = inCmd[1]
        if (target === 'at' && inCmd.length > 2) target = inCmd[2]
        try {
        //Check for valid look targets in the place
        retVal = await new Promise((resolve, reject) => checkPoi(poi,target,resolve, reject))
        if (retVal === null)
            retVal = await new Promise((resolve, reject) => checkExits(exits,target,resolve, reject))
        if (retVal === null)
            retVal = await new Promise((resolve, reject) => checkObjects(objects,target,resolve,reject))
        if (retVal === null) {
            const article = target.slice(-1) === 's' ? 'are' : 'is'
            const retMsg = `There ${article} no ${target} here.`
            console.log(retMsg)
            retVal = await new Promise((resolve, reject) => resolve(retMsg))
        }
        //retVal = await checkExits(exits,target)  
        
        }catch(e) {
            throw e;      // let caller know the promise was rejected with this reason
        }
        }
    }
    console.log(retVal)
    return retVal
}
function setResponse(resolve, msg) {
    return resolve(msg)
}
function checkObjects(objects,target,resolve,reject) {
    if (Array.isArray(objects))
        objects.forEach(object => {
            const titleArray = object.title.split(" ")
            if (titleArray.find(word => word.toLowerCase() === target.toLowerCase()))
                return resolve(object.description)
        })
    return resolve(null)
}
function checkPoi(poi,target,resolve,reject) {
    if (Array.isArray(poi))
    poi.forEach(poi => {
        if (poi.word.toLowerCase() === target.toLowerCase()) return resolve(poi.description)
    })
    return resolve(null)
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