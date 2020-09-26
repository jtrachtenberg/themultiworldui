import React from 'react'

export const disambiguation = (objectsFound, cmd, target) => {
    objectsFound = objectsFound||[]
    let finalArray = [{retResult:<span></span>,cmd:cmd,target:target}]
    const retString = []

    objectsFound.forEach( (item,i ) => {  
        if (typeof item.type === 'string') {
            if (item.type === 'object') {
                retString.push(`${i+1}: Object: ${item.value.title}`)
            } else if (item.type === 'exit') {
                retString.push(`${i+1}: Exit: ${item.value.key}`)
            } else if (item.type === 'poi') {
                retString.push(`${i+1}: Point of Interest: ${item.value.word}`)
            }
        } else {
            if (Array.isArray(item[cmd]) || typeof (item[cmd] === 'function')) {//cmd disambiguation
                const desc = typeof item.objTitle === 'string' ? item.objTitle : cmd
                retString.push(`${i+1}: ${desc}`)
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