import React, { useState, useEffect  } from 'react';
import {MediaSearch} from '../../utils/MediaSearch'
//TODO: read in format on edit
export const Sound = ({actionStack, editActionStack, actionStackIndex, elementIndex}) => {
    const [modalReturn, setModalReturn] = useState({})
    const elementSymbol = "<sound>"
    const elementType = "action"

    useEffect(() => {
        const inElementListItem = actionStack[actionStackIndex].elementList[elementIndex]

        if (typeof inElementListItem.elementFormat === 'string') {//edit mode
            setModalReturn({src: inElementListItem.elementFormat})
        }
// eslint-disable-next-line react-hooks/exhaustive-deps 
    },[])

    useEffect(() => {
        const elementFormat = typeof modalReturn.src !== 'undefined' ? modalReturn.src : ""
        if (typeof actionStack[actionStackIndex].elementList[elementIndex].elementFormat !== 'string' || (actionStack[actionStackIndex].elementList[elementIndex].elementFormat.toString() !== elementFormat.toString())) {
            const currentActionStack = [...actionStack]
            const element = currentActionStack[actionStackIndex].elementList[elementIndex]
            const elementResultObj = {function:{arguments:"elementFormat,props,inputParts,cli,React,ReactPlayer,isSafari",body:"const resultStr=/*#__PURE__*/React.createElement('span', null, /*#__PURE__*/React.createElement('span', {className: 'inlineAudio'}, /*#__PURE__*/React.createElement(ReactPlayer, {playing: false,width: isSafari ? '44px' : '102px',height: '20px',controls: true, url: elementFormat }), ' '), /*#__PURE__*/React.createElement('span', null));cli.formatResults(resultStr, {}, () => {});const audio = new Audio(elementFormat);audio.addEventListener('canplaythrough', event => {audio.play();});"}}
            element.elementFormat = elementFormat
            element.element="Sound"
            element.elementType=elementType
            element.elementSymbol=elementSymbol
            element.elementResult=elementResultObj
            
            currentActionStack[actionStackIndex].elementList[elementIndex] = element
            editActionStack(currentActionStack)
        }
    })

    const addElementHandler = () => {
        return (
        <section>
            <MediaSearch audioOnly={true} modalReturn={setModalReturn} handleAudio={setModalReturn} forceOpen={false} />
        </section>
        )
    }

    return(
        <div>
            {addElementHandler()}
        </div>
    )

}