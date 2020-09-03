import React, { useState, useEffect  } from 'react';

/*const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

const days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
]*/

const timeFormats = [
    'hh:mm',
    'hh:mm:ss',
    'HH:mm',
    'HH:mm:ss'
]

export const Time = ({show, currentActionNumber, defaultElementFormat, actionStack, editActionStack, elementList, editElementList,handleElementChange, elementNumber}) => {
    const [dateTime , setDateTime] = useState("")
    const [dateFormat, setDateFormat] = useState(0)
    const elementSymbol = "<time>"
    const elementType = "replace"

    useEffect(() => {
        if (defaultElementFormat === null) return
        timeFormats.forEach( (value,i) => {
            if (value === defaultElementFormat) setDateFormat(i)
        })
    },[defaultElementFormat])
    useEffect(() => {
        if (!Array.isArray(elementList)) return
        if (!elementList.find((el,i) => el.element === "Time")) {
            const tmpList = Array.isArray(elementList) && elementList.length > 0 ? [...elementList] : []
         
            // eslint-disable-next-line
            const elementResultObj = {function:{arguments:"elementFormat",body:"const curDate = new Date();const timeParts = elementFormat.split(`:`);let stringDate, stringHour;let isMilitary = true;if (timeParts[0] === 'HH') {stringHour = curDate.getHours() > 9 ? curDate.getHours().toString() : `0`+curDate.getHours();}else if (timeParts[0] === 'hh') {isMilitary = false;const hour = curDate.getHours();stringHour = hour === 0 ? `12` : hour < 13 ? hour.toString() : (hour-12).toString();}stringDate = `${stringHour}:${curDate.getMinutes() < 10 ? '0'+curDate.getMinutes() : curDate.getMinutes()}${timeParts.length === 3 ? curDate.getSeconds() < 10 ? '.0'+curDate.getSeconds() : '.'+curDate.getSeconds() : ''}${isMilitary ? '' : curDate.getHours() > 11 ? 'PM' : 'AM'}`;return stringDate;"}}
            tmpList.push({element:"Time",elementType:elementType,elementSymbol:elementSymbol, elementResult: elementResultObj, elementFormat: timeFormats[dateFormat]})
            editElementList(tmpList)
            setDateTime(formatTime(dateFormat))
        }
    },[dateFormat, editElementList, elementList])

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
                    const {name, value} = e.target
                    let finalValue
                    const tmpFormats = [...timeFormats]
                    if (name === 'elementFormat') finalValue = tmpFormats[value]
                    else finalValue=value
                    
                    handleElementChange(name,finalValue,elementSymbol, currentActionNumber)
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
            {show && addElementHandler()}
        </div>
    )

}