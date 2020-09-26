import React, { useState, useEffect  } from 'react';

const timeFormats = [
    'hh:mm',
    'hh:mm:ss',
    'HH:mm',
    'HH:mm:ss'
]
export const elementSymbol = "<time>"
export const Time = ({actionStack, editActionStack, actionStackIndex, elementIndex}) => {
    const [dateTime , setDateTime] = useState("")
    const [dateFormat, setDateFormat] = useState(0)
    const elementSymbol = "<time>"
    const elementType = "replace"

    useEffect(() => {
        const inElementListItem = actionStack[actionStackIndex].elementList[elementIndex]

        if (typeof inElementListItem.elementFormat === 'string') {//edit mode
            setDateFormat(timeFormats.findIndex(item => item.toString() === inElementListItem.elementFormat.toString()))
        }
// eslint-disable-next-line react-hooks/exhaustive-deps 
    },[])

    useEffect(() => {
        if (typeof actionStack[actionStackIndex].elementList[elementIndex].elementFormat !== 'string' || (actionStack[actionStackIndex].elementList[elementIndex].elementFormat.toString() !== timeFormats[dateFormat].toString())) {
            const currentActionStack = Object.assign(actionStack)
            const currentAction = Object.assign(currentActionStack[actionStackIndex])
            const currentElement = currentAction.elementList[elementIndex]
            
            // eslint-disable-next-line
            const elementResultObj = {function:{arguments:"elementFormat",body:"const curDate = new Date();const timeParts = elementFormat.split(`:`);let stringDate, stringHour;let isMilitary = true;if (timeParts[0] === 'HH') {stringHour = curDate.getHours() > 9 ? curDate.getHours().toString() : `0`+curDate.getHours();}else if (timeParts[0] === 'hh') {isMilitary = false;const hour = curDate.getHours();stringHour = hour === 0 ? `12` : hour < 13 ? hour.toString() : (hour-12).toString();}stringDate = `${stringHour}:${curDate.getMinutes() < 10 ? '0'+curDate.getMinutes() : curDate.getMinutes()}${timeParts.length === 3 ? curDate.getSeconds() < 10 ? '.0'+curDate.getSeconds() : '.'+curDate.getSeconds() : ''}${isMilitary ? '' : curDate.getHours() > 11 ? 'PM' : 'AM'}`;return stringDate;"}}

            currentElement.elementName = "Time"
            currentElement.elementType = elementType
            currentElement.elementSymbol = elementSymbol
            currentElement.elementResult = elementResultObj
            currentElement.elementFormat = timeFormats[dateFormat]

            currentAction.elementList[elementIndex] = currentElement
            currentActionStack[actionStackIndex] = currentAction
            editActionStack(currentActionStack)
        }
    })

    const formatTime = (format) => {
        const curDate = new Date()

        const timeParts = timeFormats[format].split(":")
        let stringDate, stringHour
        let isMilitary = true

        if (timeParts[0] === 'HH')
            stringHour = curDate.getHours() > 9 ? curDate.getHours().toString() : "0"+curDate.getHours()
        else if (timeParts[0] === 'hh') {
            isMilitary = false
            const hour = curDate.getHours()
            stringHour = hour === 0 ? "12" : hour < 13 ? hour.toString() : (hour-12).toString()
        }

        stringDate = `${stringHour}:${curDate.getMinutes() < 10 ? '0'+curDate.getMinutes() : curDate.getMinutes()}${timeParts.length === 3 ? curDate.getSeconds() < 10 ? '.0'+curDate.getSeconds() : '.'+curDate.getSeconds() : ''}${isMilitary ? '' : curDate.getHours() > 11 ? 'PM' : 'AM'}`
        return stringDate
    }

    const formatTimeFormats = () => {
        return timeFormats.map((value,i) => <option key={i} value={i}>{value}</option>)
    }

    const addElementHandler = () => {
        return (
        <section>
            <label>Time Format</label>
                <select name="elementFormat" value={dateFormat} onChange={(e) => {
                    setDateFormat(e.target.value)
                    setDateTime(formatTime(e.target.value))
                }} >
                {formatTimeFormats()}
                </select>
            <div className="elementValue Time">{dateTime}</div>
            <input name="elementValue" value={dateTime} type="hidden" />
        </section>
        )
    }

    return(
        <div>
            {addElementHandler()}
        </div>
    )

}