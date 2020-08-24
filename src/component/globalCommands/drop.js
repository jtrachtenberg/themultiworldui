// inObj = props, inCmd = array of input words
// This will take the current place and react to poi and exits

const drop = async (inObj, inCmd) => {
    inObj = inObj || null
    inCmd = inCmd || null
    let retVal   
    if (inObj === null)
        retVal = await new Promise((resolve, reject) => () => setResponse(resolve,"Nothing."))

        const inventory = Array.isArray(inObj.inUser.stateData.inventory) ? inObj.inUser.stateData.inventory : []
        if (inventory.length === 0) return await new Promise((resolve, reject) => resolve("You have nothing."))

        if (inCmd === null || inCmd.length === 1) {
            retVal = await new Promise((resolve, reject) => setResponse(resolve, "Mic drop: boom!"))
        }
        else {
            const target = inCmd[1]
            try {
                const newObjects = checkObjects(inventory,target)
            if (newObjects === null) {
                const article = target.slice(-1) === 's' ? 'are' : 'is'
                const retMsg = `There ${article} no ${target} in your inventory.`
                retVal = await new Promise((resolve, reject) => resolve(retMsg))
            } else {//drop the object
                const inUser = Object.assign(inObj.inUser)
                const stateData = inUser.stateData
                stateData.inventory = newObjects.inventory
                inUser.stateData=stateData

                
                const objects = (Array.isArray(inObj.inPlace.objects) && inObj.inPlace.objects.length > 0) ? [...inObj.inPlace.objects] : []
                console.log(objects)
                objects.push(newObjects.dropObj)
                const retObj = {type:"objects",value: objects, outUser: inUser,response: `You dropped the ${target}.`}
                retVal = await new Promise((resolve, reject) => resolve(retObj))

            }
            
            }catch(e) {
                throw e;
            }
        }
    
    return retVal
}
function setResponse(resolve, msg) {
    return resolve(msg)
}
function checkObjects(inventory,target) {
    let retVal = null
    if (Array.isArray(inventory))
        for (const object of inventory) {
            const titleArray = object.title.split(" ")
            if (titleArray.find(word => word.toLowerCase() === target.toLowerCase())) {
                const retArray = inventory.filter(obj => obj.objectId !== object.objectId)
                console.log(retArray)
                retVal = {
                    dropObj:object,inventory:retArray
                }
                
                break;
            }   
        }

    return retVal
}

export default drop