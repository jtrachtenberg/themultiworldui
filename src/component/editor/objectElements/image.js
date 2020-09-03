import React, { useState, useEffect  } from 'react';
import ReactPlayer from 'react-player'
import {Modal} from '../utils/Modal'
import Portal from '../utils/Portal'

export const Image = ({show, currentActionNumber, defaultElementFormat, actionStack, editActionStack, elementList, editElementList,handleElementChange, elementNumber}) => {
    const [image , setImage] = useState({})
    const elementSymbol = "<image>"
    const elementType = "action"
   
    useEffect(() => {
        if (defaultElementFormat === null) return
        setImage(defaultElementFormat)
    },[defaultElementFormat])

    useEffect(() => {
        if (!Array.isArray(elementList)) return
        if (!elementList.find((el,i) => el.element === "Image")) {
            const tmpList = Array.isArray(elementList) && elementList.length > 0 ? [...elementList] : []
         
            // eslint-disable-next-line
            const elementResultObj = {function:{arguments:"elementFormat, props, inputParts",body:"const curDate = new Date();const timeParts = elementFormat.split(`:`);let stringDate, stringHour;let isMilitary = true;if (timeParts[0] === 'HH') {stringHour = curDate.getHours() > 9 ? curDate.getHours().toString() : `0`+curDate.getHours();}else if (timeParts[0] === 'hh') {isMilitary = false;const hour = curDate.getHours();stringHour = hour === 0 ? `12` : hour < 13 ? hour.toString() : (hour-12).toString();}stringDate = `${stringHour}:${curDate.getMinutes() < 10 ? '0'+curDate.getMinutes() : curDate.getMinutes()}${timeParts.length === 3 ? curDate.getSeconds() < 10 ? '.0'+curDate.getSeconds() : '.'+curDate.getSeconds() : ''}${isMilitary ? '' : curDate.getHours() > 11 ? 'PM' : 'AM'}`;return stringDate;"}}
            tmpList.push({element:"Image",elementType:elementType,elementSymbol:elementSymbol, elementResult: elementResultObj, elementFormat: audio})
            editElementList(tmpList)
            setDateTime(formatTime(dateFormat))
        }
    },[audio, editElementList, elementList])
}