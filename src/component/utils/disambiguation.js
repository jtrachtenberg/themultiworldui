import React from 'react'

export const disambiguation = (objectsFound, cmd, target) => {
    objectsFound = objectsFound||[]
    let finalArray = [{retResult:<span></span>,cmd:cmd,target:target}]
    const retString = []
    console.log(objectsFound)
    objectsFound.forEach( (item,i ) => {  
        if (Array.isArray(item[cmd])) {//cmd disambiguation
            retString.push(`${i+1}: ${item.objTitle}`)
            console.log(retString)
        } else {  
            if (item.type === 'object') {
                retString.push(`${i+1}: Object: ${item.value.title}`)
            } else if (item.type === 'exit') {
                retString.push(`${i+1}: Exit: ${item.value.key}`)
            } else if (item.type === 'poi') {
                retString.push(`${i+1}: Point of Interest: ${item.value.word}`)
            }
        }
    })
    const finalReturnResult = retString.map( (item, i) => {
        const ret = i === 0 ? <span key={i}><p>Did you mean:</p><p>{item}</p></span> : <span key={i}><p>{item}</p></span>
        return ret
    })
    
    finalArray[0].retResult = finalReturnResult
    finalArray=[...finalArray,objectsFound]
    return new Promise(resolve => resolve(finalArray))
}