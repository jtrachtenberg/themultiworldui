import {chooseObject} from '../utils/chooseObject'
import {disambiguation} from '../utils/disambiguation'
// inObj = props, inCmd = array of input words
// This will take the current place and react to poi and exits
const look = async (inObj, inCmd) => {
    inObj = inObj || null
    inCmd = inCmd || null

    let retVal   
    if (inObj === null)
        retVal = await new Promise((resolve, reject) => () => setResponse(resolve,"You see nothing."))
    else if (inObj.src === 'disambigulation') {
        console.log(inObj)
        switch(inObj.type) {
            case 'poi': retVal = await new Promise((resolve, reject) => resolve(inObj.obj.description));break;
            case 'object': retVal = await new Promise((resolve, reject) => resolve(inObj.obj.description));break;
            case 'exit': retVal = await new Promise((resolve, reject) => resolve(inObj.obj.value.title));break;
            default: retVal = await new Promise(resolve => resolve("You see nothing."));break;
        }
    } else {
        const place = inObj.inPlace
        if (typeof(place['placeId']) !== 'undefined') {
            const exits = place.exits
            const poi = place.poi
            const objects = place.objects
            const inventory = inObj.inUser.stateData.inventory

            if (inCmd === null || inCmd.length === 1) {
                retVal = await new Promise((resolve, reject) => setResponse(resolve, place.description))
            }
            else {
            let target = inCmd[1]
            if (target === 'at' && inCmd.length > 2) target = inCmd[2]
            try {
                const tmp = chooseObject({objectList:[...poi,...exits,...objects,...inventory],target:target,cmd:'look',ambHandler:disambiguation})
                console.log(typeof tmp)
                if (tmp === null) {
                    const article = target.slice(-1) === 's' ? 'are' : 'is'
                    const retMsg = `There ${article} no ${target} here.`
                    retVal = await new Promise((resolve, reject) => resolve(retMsg))
                }
                else if (Array.isArray(tmp)) {
                    if (tmp.length === 1) {
                        switch (tmp[0].type) {
                            case 'object': retVal = await new Promise((resolve, reject) => resolve(tmp[0].value.description));break;
                            case 'poi': retVal = await new Promise((resolve, reject) => resolve(tmp[0].value.description));break;
                            default: retVal = await new Promise((resolve, reject) => resolve(tmp[0].value.title));break;
                        }
                    }
                } else {
                    console.log(typeof tmp)
                    retVal = tmp
                }
                /*
                console.log(tmp)
            //Check for valid look targets in the place
            retVal = await new Promise((resolve, reject) => checkPoi(poi,target,resolve, reject))
            if (retVal === null)
                retVal = await new Promise((resolve, reject) => checkExits(exits,target,resolve, reject))
            if (retVal === null)
                retVal = await new Promise((resolve, reject) => checkObjects(objects,target,resolve,reject))
            if (retVal === null)
                retVal = await new Promise((resolve, reject) => checkObjects(inventory,target,resolve,reject))
            if (retVal === null) {
                const article = target.slice(-1) === 's' ? 'are' : 'is'
                const retMsg = `There ${article} no ${target} here.`
                retVal = await new Promise((resolve, reject) => resolve(retMsg))
            }
            //retVal = await checkExits(exits,target)  
            */
            }catch(e) {
                throw e;      // let caller know the promise was rejected with this reason
            }
            }
        }
    }
    return retVal
}
function setResponse(resolve, msg) {
    return resolve(msg)
}
/*
function checkObjects(inventory,target,resolve,reject) {
    var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    if (Array.isArray(inventory))
        inventory.forEach(item => {
            const titleArray = item.title.replace(regex,'').split(" ")
            if (titleArray.find(word => word.toLowerCase() === target.toLowerCase()))
                return resolve(item.description)
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
*/
export default look