export const chooseObject = ({objectList, target, cmd, ambHandler}) => {
    const objectsFound = []
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

    objectList.forEach((item,i) => {
        switch(true) {
            case (typeof item.word !== 'undefined'): //poi
                if (item.word.toLowerCase() === target.toLowerCase()) objectsFound.push({type:'poi',value:item})
                break;
            case (typeof item.title !== 'undefined'): //object
                const titleArray = item.title.replace(regex,'').split(" ")
                if (titleArray.find(word => word.toLowerCase() === target.toLowerCase()))
                    objectsFound.push({type:'object',value:item})
                break;
            default: //exit
                for (const [key,value] of Object.entries(item)) {
                    if (key.toLowerCase() === target.toLowerCase()) {
                        objectsFound.push({type:'exit',value:{key:key,value:value}})
                    }
                }
        }
    })
    if (objectsFound.length === 0) return null
    if (objectsFound.length === 1)
        return objectsFound
    else if (typeof ambHandler === 'function') return ambHandler(objectsFound,cmd,target)
    else return objectsFound
}