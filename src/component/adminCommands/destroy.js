// inObj = props, inCmd = array of input words
const destroy = async (inObj, inCmd, modalReturn) => {
    inObj = inObj || null
    inCmd = inCmd || null
    let retVal   
    if (inObj === null)
        retVal = await new Promise((resolve, reject) => () => setResponse(resolve,"Nothing to do here."))

    const place = inObj.inPlace
    if (typeof(place['placeId']) !== 'undefined') {
        const objects = place.objects
        if (inCmd === null || inCmd.length === 1) {
            retVal = await new Promise((resolve, reject) => setResponse(resolve, "You got it!"))
        }
        else {
            const target = inCmd[1]
            try {
                const newObjects = checkObjects(objects,target)
                if (newObjects === null) {
                    const article = target.slice(-1) === 's' ? 'are' : 'is'
                    const retMsg = `There ${article} no ${target} here.`
                    retVal = await new Promise((resolve, reject) => resolve(retMsg))
                } else {//get the object
                    const retObj = {type:"objects",msg: `The ${target} has been destroyed.`, value: newObjects.objects, modifiers: [],response: `You destroyed the ${target}!`}
                    retVal = await new Promise((resolve, reject) => resolve(retObj))
                }      
            }catch(e) {
                throw e;
            }
        }
    }
    return retVal
}

function checkObjects(objects,target) {
    let retVal = null
    if (Array.isArray(objects))
        for (const object of objects) {
            const titleArray = object.title.split(" ")
            if (titleArray.find(word => word.toLowerCase() === target.toLowerCase())) {
                const retArray = objects.filter(obj => obj.objectId !== object.objectId)
                retVal = {
                    invObj:object,objects:retArray
                }
                
                break;
            }   
        }

    return retVal
}

function setResponse(resolve, msg) {
    return resolve(msg)
}

export default destroy