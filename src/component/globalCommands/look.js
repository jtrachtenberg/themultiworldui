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
        switch(inObj.type) {
            case 'poi': retVal = await new Promise((resolve, reject) => resolve(inObj.obj.description));break;
            case 'object': retVal = await new Promise((resolve, reject) => resolve(inObj.obj.description));break;
            case 'exit': retVal = await new Promise((resolve, reject) => resolve(inObj.obj.value.title));break;
            default: retVal = await new Promise(resolve => resolve("You see nothing."));break;
        }
    } else {
        const place = inObj.inPlace
        if (typeof(place['placeId']) !== 'undefined') {
            const exits = place.exits||[]
            const poi = place.poi||[]
            const objects = place.objects||[]
            const inventory = inObj.inUser.stateData.inventory||[]

            if (inCmd === null || inCmd.length === 1) {
                retVal = await new Promise((resolve, reject) => setResponse(resolve, place.description))
            }
            else {
            let target = inCmd[1]
            if (target === 'at' && inCmd.length > 2) target = inCmd[2]
            try {
                const tmp = chooseObject({objectList:[...poi,...exits,...objects,...inventory],target:target,cmd:'look',ambHandler:disambiguation})

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
                            case 'exit': retVal = await new Promise((resolve, reject) => resolve(tmp[0].value.value.title));break;
                            default: retVal = await new Promise((resolve, reject) => resolve(tmp[0].value.title));break;
                        }
                    }
                } else {
                    console.log(typeof tmp)
                    retVal = tmp
                }
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
export default look