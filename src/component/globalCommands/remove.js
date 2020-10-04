import {chooseObject} from '../utils/chooseObject'
import {disambiguation} from '../utils/disambiguation'
// inObj = props, inCmd = array of input words
const remove = async (inObj, inCmd, modalReturn) => {
    inObj = inObj || null
    inCmd = inCmd || null
    let retVal   
    if (inObj === null)
        retVal = await new Promise((resolve, reject) => () => setResponse(resolve,"Nothing to do here."))
    else if (inObj.src === 'disambigulation') {
        if (!inObj.isAdmin && inObj.inPlace.userId !== inObj.inUser.userId) retVal = await new Promise((resolve, reject) => () => setResponse(resolve,"You can't remove that."))
        else {
            if (inObj.obj.type === 'NPC') {
                const socket = inObj.socket
                const data = {
                    type: 'admin',
                    cmd: 'deleteNPC',
                    admincmd: 'destroy',
                    needResponse: false,
                    elements: {userId: inObj.inUser.userId, objectId: inObj.obj.objectId, placeId: inObj.inPlace.placeId}
                }
                socket.emit('incoming data', data)
            }
            const retObj = {type:"objects",msg: `The ${inObj.target} has been destroyed.`, value: inObj.inPlace.objects.filter(object => object.objectId !== inObj.obj.objectId), modifiers: [],response: `You destroyed the ${inObj.target}!`}
            retVal = await new Promise((resolve, reject) => resolve(retObj))
        }
    } else {
        const place = inObj.inPlace
        if (typeof(place['placeId']) !== 'undefined') {
            const objects = place.objects
            if (inCmd === null || inCmd.length === 1) {
                retVal = await new Promise((resolve, reject) => setResponse(resolve, "Remove what?"))
            }
            else {
                const target = inCmd[1]
                try {
                    const newObjects = chooseObject({objectList:objects,target:target,cmd:'remove',ambHandler:disambiguation})
                    if (newObjects === null) {
                        const article = target.slice(-1) === 's' ? 'are' : 'is'
                        const retMsg = `There ${article} no ${target} here.`
                        retVal = await new Promise((resolve, reject) => resolve(retMsg))
                    } else if (Array.isArray(newObjects)) {
                        if (!inObj.isAdmin && inObj.inPlace.userId !== inObj.inUser.userId) retVal = await new Promise((resolve, reject) => () => setResponse(resolve,"You can't remove that."))
                        else if (newObjects.length === 1) {
                            if (newObjects[0].value.type === 'NPC') {
                                const socket = inObj.socket
                                const data = {
                                    type: 'admin',
                                    cmd: 'deleteNPC',
                                    admincmd: 'destroy',
                                    needResponse: false,
                                    needReload: true,
                                    elements: {userId: inObj.inUser.userId, objectId: newObjects[0].value.objectId, placeId: inObj.inPlace.placeId}
                                }
                                socket.emit('incoming data', data)
                            }
                            const retObj = {type:"objects",msg: `${target} fades away.`, value: objects.filter(object => object.objectId !== newObjects[0].value.objectId), modifiers: [],response: `You removed ${target}!`}
                            retVal = await new Promise((resolve, reject) => resolve(retObj))
                        }
                    } else {//disambig
                        retVal = newObjects
                    }      
                }catch(e) {
                    throw e;
                }
            }
        }
    }
    return retVal
}

function setResponse(resolve, msg) {
    return resolve(msg)
}

export default remove