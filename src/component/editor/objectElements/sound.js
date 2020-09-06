import React, { useState, useEffect  } from 'react';
import {MediaSearch} from '../../utils/MediaSearch'

export const Sound = ({show, currentActionNumber, defaultElementFormat, actionStack, editActionStack, elementList, editElementList,handleElementChange, elementNumber}) => {
    const [audio , setAudio] = useState({})
    //const [forceOpen, setForceOpen] = useState(false)
    const [modalReturn, setModalReturn] = useState({})
    const elementSymbol = "<sound>"
    const elementType = "action"

    useEffect(() => {
        if (typeof modalReturn.src !== 'undefined') {
            handleElementChange('elementFormat',modalReturn.src,elementSymbol, currentActionNumber)
            setModalReturn({})
        }

    }, [modalReturn, currentActionNumber, handleElementChange])

    useEffect(() => {
        if (defaultElementFormat === null) return
        setAudio(defaultElementFormat)
    },[defaultElementFormat])

    useEffect(() => {
        if (!Array.isArray(elementList)) return
        if (!elementList.find((el,i) => el.element === "Sound")) {
            const tmpList = Array.isArray(elementList) && elementList.length > 0 ? [...elementList] : []



            const elementResultObj = {function:{arguments:"elementFormat,props,inputParts,cli,React,ReactPlayer,isSafari",body:"const resultStr=/*#__PURE__*/React.createElement('span', null, /*#__PURE__*/React.createElement('span', {className: 'inlineAudio'}, /*#__PURE__*/React.createElement(ReactPlayer, {playing: false,width: isSafari ? '44px' : '102px',height: '20px',controls: true, url: elementFormat }), ' '), /*#__PURE__*/React.createElement('span', null, 'You hear something: ', inputParts[0]));cli.formatResults(resultStr, {}, () => {});const audio = new Audio(elementFormat);audio.addEventListener('canplaythrough', event => {audio.play();});"}}
            tmpList.push({element:"Sound",elementType:elementType,elementSymbol:elementSymbol, elementResult: elementResultObj, elementFormat: audio})
            editElementList(tmpList)
        }
    },[audio, editElementList, elementList])

    const addElementHandler = () => {
        return (
        <section>
            <MediaSearch audioOnly={true} modalReturn={setModalReturn} handleAudio={setModalReturn} forceOpen={false} />
        </section>
        )
    }

    return(
        <div>
            {show && addElementHandler()}
        </div>
    )

}