import React from 'react'

const formatPopulation = (response) => {
    let finalArray = []
    response.forEach((item) => {
        const inArray = finalArray[item.placeId]||[]
        inArray.push(item.userName)
        finalArray[item.placeId]=inArray
    })
    console.log(finalArray)
    finalArray.map( (item,i) => {
        console.log('i',i)
        console.log('item',item)
    })
    return finalArray.map ( (item,i) => <span key={i}><span>PlaceId: {i} : </span><span>{item.map( (person,i) => i === item.length-1 ? person : `${person}, `)}</span><br/> </span>)
}

// inObj = props, inCmd = array of input words
const population = async (inObj, inCmd, modalReturn) => {
    if (typeof inObj.type === 'string' && inObj.type.toString() === 'admin'.toString()) {
    //const returnObj = inObj.response.map(item => <span>Place: {item.placeId} <span>{item.people.map(person => <span></span>)}</span></span>)
    let returnObj = formatPopulation(inObj.response)
    return new Promise(resolve => resolve(returnObj))
    }
    const socket = inObj.socket
    let retVal
    const data = {
        type: 'admin',
        cmd: 'getAdminPopulation',
        admincmd: 'population',
        userId: inObj.inUser.userId
    }
    socket.emit('incoming data', data)

    retVal = await new Promise((resolve, reject) => setResponse(resolve, 'Getting Population...'))
    return retVal
}

function setResponse(resolve, msg) {
    return resolve(msg)
}

export default population