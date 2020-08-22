import React, { useState, useEffect  } from 'react';

const months = [
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
]

const timeFormats = [
    'hh:mm',
    'hh:mm:ss',
    'HH:mm',
    'HH:mm:ss'
]

export const Time = ({show, currentActionNumber, actionStack, editActionStack, elementList, editElementList,handleElementChange, elementNumber}) => {
    const [dateTime , setDateTime] = useState("")
    const [dateFormat, setDateFormat] = useState(0)
    const elementSymbol = "<date>"

    const looseJsonParse = (obj) => {
        return Function('"use strict";return (' + obj + ')')();
    }
    useEffect(() => {
        if (!elementList.find((el,i) => el.element === "Time")) {
            const tmpList = Array.isArray(elementList) && elementList.length > 0 ? [...elementList] : []
            tmpList.push({element:"Time",symbol:elementSymbol, result: "new Date()"})
            const tmpString = "new Date()"
            let tmpObj = looseJsonParse(tmpString)
            console.log(tmpObj)
            editElementList(tmpList)
            setDateTime(formatTime(dateFormat))
        }
    }, [elementList, editElementList])

    const updateParent = (e) => {
        const {name, value} = e.target
        handleElementChange(name,value,elementNumber)
    }

    const formatTime = (format) => {
        const curDate = new Date()

        const timeParts = timeFormats[format].split(":")
        let stringDate, stringHour
        let isMilitary = true

        if (timeParts[0] === 'HH')
            stringHour = curDate.getHours()
        else if (timeParts[0] === 'hh') {
            isMilitary = false
            const hour = curDate.getHours()
            stringHour = hour === 0 ? 12 : hour < 13 ? hour : hour-12
        }

        stringDate = `${stringHour}:${curDate.getMinutes()}${timeParts.length === 3 ? ':'+curDate.getSeconds() : ''}${isMilitary ? '' : curDate.getHours() > 11 ? 'PM' : 'AM'}`
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
                    updateParent(e)
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
            {show && <div>{addElementHandler()}</div>}
        </div>
    )

}