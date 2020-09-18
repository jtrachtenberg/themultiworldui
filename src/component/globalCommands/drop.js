import {chooseObject} from '../utils/chooseObject'
import {disambiguation} from '../utils/disambiguation'
// inObj = props, inCmd = array of input words
// This will take the current place and react to poi and exits

const drop = async (inObj, inCmd) => {
    inObj = inObj || null
    inCmd = inCmd || null
    let retVal   
    if (inObj === null)
        retVal = await new Promise((resolve, reject) => () => setResponse(resolve,"Nothing."))
    else if (inObj.src === 'disambigulation') {
        const target = inObj.target
        const inUser = Object.assign(inObj.inUser)
        const stateData = inUser.stateData
        stateData.inventory= stateData.inventory.filter(item => item.objectId !== inObj.obj.objectId)
        inUser.stateData=stateData

        
        const objects = (Array.isArray(inObj.inPlace.objects) && inObj.inPlace.objects.length > 0) ? [...inObj.inPlace.objects] : []
        objects.push(inObj.obj)
        const retObj = {type:"objects",msg: `${inUser.userName} dropped the ${target}.`,value: objects, outUser: inUser,response: `You dropped the ${target}.`}
        retVal = await new Promise((resolve, reject) => resolve(retObj))
    } else {
        const inventory = Array.isArray(inObj.inUser.stateData.inventory) ? inObj.inUser.stateData.inventory : []
        if (inventory.length === 0) return await new Promise((resolve, reject) => resolve("You have nothing."))

        if (inCmd === null || inCmd.length === 1) {
            retVal = await new Promise((resolve, reject) => setResponse(resolve, "Mic drop: boom!"))
        }
        else {
            const target = inCmd[1]
            try {
                const newObjects = chooseObject({objectList:inventory,target:target,cmd:'drop',ambHandler:disambiguation})
            if (newObjects === null) {
                const article = target.slice(-1) === 's' ? 'are' : 'is'
                const retMsg = `There ${article} no ${target} in your inventory.`
                retVal = await new Promise((resolve, reject) => resolve(retMsg))
            } else if (Array.isArray(newObjects)) {
                if (newObjects.length === 1) {//drop the object
                    const inUser = Object.assign(inObj.inUser)
                    const stateData = inUser.stateData
                    stateData.inventory = stateData.inventory.filter(item => item.objectId !== newObjects[0].value.objectId)
                    inUser.stateData=stateData

                    
                    const objects = (Array.isArray(inObj.inPlace.objects) && inObj.inPlace.objects.length > 0) ? [...inObj.inPlace.objects] : []
                    objects.push(newObjects[0].value)
                    const retObj = {type:"objects",msg: `${inUser.userName} dropped the ${target}.`,value: objects, outUser: inUser,response: `You dropped the ${target}.`}
                    retVal = await new Promise((resolve, reject) => resolve(retObj))
                }
            } else {
                retVal = newObjects
            }
            
            }catch(e) {
                throw e;
            }
        }
    }
    return retVal
}
function setResponse(resolve, msg) {
    return resolve(msg)
}

export default drop