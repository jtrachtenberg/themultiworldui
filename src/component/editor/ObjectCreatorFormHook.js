import React, { useState, useEffect } from 'react';
import { setFormHeader, createHandler } from '../utils/formUtils';
import {ReactComponent as CreateIcon} from '../createobject.svg';

import {Modal} from '../utils/Modal'
import Portal from '../utils/Portal'
import * as Actions from './objectActions'
import * as Presets from './presetObjects'
import {CreateObjectModal} from './CreateObjectModal'

/*const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )
*/

export const ObjectCreatorFormHook = ({userId, objectHandler, spaces}) => {
    const [actionStack, editActionStack] = useState([])
    const [showModal, toggleShowModal] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [actions, editActions] = useState([])
    const [presets, editPresets] = useState([])
    const [currentAction, setCurrentAction] = useState(0)
    const [commandId, incrementId] = useState(1)
    const [currentActionNumber, setCurrentActionNumber] = useState(-1)
    const [currentElementNumber, setCurrentElementNumber] = useState(0)
    const [imageModal, setImageModal] = useState({})
    const [images, editImages] = useState([])
    const [elementStack, editElementStack] = useState([])

    useEffect(() => {
        let inCommands = []
        for (const [key, value] of Object.entries(Actions)) {
            inCommands.push({command: key, value: value})
        }
        editActions(inCommands)

        let inPresets = []
        for (const [key, value] of Object.entries(Presets)) {
            inPresets.push({command: key, value: value})
        }
        editPresets(inPresets)
    },[userId])

    const tabReset = (tab) => {
        let inCommands = []
        for (const [key, value] of Object.entries(Actions)) {
            inCommands.push({command: key, value: value})
        }
        editActions(inCommands)

        let inPresets = []
        for (const [key, value] of Object.entries(Presets)) {
            inPresets.push({command: key, value: value})
        }
        editPresets(inPresets)
    }

    const handleActionChange = (name,value,actionNumber)  => {
        const tmpActions = (Array.isArray(actionStack) && actionStack.length > 0) ? [...actionStack] : []

        const inAction = tmpActions[actionNumber] 
        inAction[name]=value
        tmpActions[actionNumber] = inAction
        editActionStack(tmpActions)
    }

    const hideModal = (e) => {
        //setModalReturn(e)
        toggleShowModal(false)
    }

    const handleElementChange = (name,value,elementSymbol, actionNumber) => {

        const newActionStack = Array.from(actionStack)
        const newCommand = newActionStack[actionNumber]
        newCommand.elementList =  newCommand.elementList.filter(function (el) {
            return el != null;
          });
        const elementListItem = Object.assign(newCommand.elementList.find(element => element.elementSymbol === elementSymbol))
        elementListItem[name] = value

        newCommand.elementList = newCommand.elementList.filter(function (el) {
            return el != null
        })

        newActionStack[actionNumber]=newCommand
        editActionStack(newActionStack)
    }

    const formatActions = () => {
        if (Array.isArray(actionStack) && actionStack.length === 0)
            return <div></div>
        if (!Array.isArray(actions) || actions.length === 0) return <span></span>
        console.log(actionStack)
        return actionStack.map((command,i) => {
            console.log(actions)
            const NewAction = actions.find((value) => value.command === command.command).value
            
            return <div key={i}><NewAction currentElementNumber={currentElementNumber} setCurrentElementNumber={setCurrentElementNumber} userId={userId} handleActionChange={handleActionChange} actionNumber={i} setCurrentActionNumber={setCurrentActionNumber} actionStack={actionStack} elementStack={elementStack} editActionStack={editActionStack} editElementStack={editElementStack} handleElementChange={handleElementChange} /></div>
        })
    }
    const formatActionsSelect = () => {
        if (Array.isArray(actions))
        return actions.map((value,i) => <option key={i} value={i}>{value.command}</option>)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let finalImages = Array.isArray(images) ? [...images] : []
        if (imageModal !== {}) finalImages.push(imageModal)

        actionStack.forEach(cmd => {
            cmd.elementList = cmd.elementList.filter(function (el) {
                return el != null
            })
        })
        const submitData = {
            userId: userId,
            title: title,
            description: description,
            isRoot: true,
            actionStack: actionStack,
            images: finalImages
        }
        toggleShowModal(false)
        createHandler("object", submitData, objectHandler)
        editActionStack([])
        setTitle("")
        setDescription("")
        //editTriggers([])
        setCurrentAction(0)
        incrementId(1)
        setCurrentActionNumber(-1)
        setCurrentElementNumber(0)
        setImageModal({})
    }

    const createPreset = async (name,value,actionNumber)  => {
        //createPreset
        const tmpActions = (Array.isArray(actionStack) && actionStack.length > 0) ? [...actionStack] : []

        if ( typeof(tmpActions[actionNumber]) === 'undefined') tmpActions[actionNumber] = {}
        const inAction = Object.assign(tmpActions[actionNumber])

        inAction[name]=value

        tmpActions[actionNumber] = inAction


        await editActionStack(tmpActions)

    }

    return(
    <div>
        <div>{setFormHeader("Object Creator")}<span><CreateIcon onClick={() => toggleShowModal(true)}/></span></div>
        {showModal && (
            <Portal id="objectModal">
                <Modal handleClose={hideModal} show={showModal}>
                    <CreateObjectModal tabReset={tabReset} currentElementNumber={currentElementNumber} setCurrentElementNumber={setCurrentElementNumber} elementStack={elementStack} editElementStack={editElementStack} userId={userId} createPreset={createPreset} presets={presets} setImageModal={setImageModal} setFormHeader={setFormHeader} title={title} setTitle={setTitle} description={description} setDescription={setDescription} formatActionsSelect={formatActionsSelect} formatActions={formatActions} actionStack={actionStack} editActionStack={editActionStack} currentAction={currentAction} setCurrentAction={setCurrentAction} currentActionNumber={currentActionNumber} actions={actions} commandId={commandId} incrementId={incrementId} handleSubmit={handleSubmit} buttonText="Create" images={images} editImages={editImages} spaces={spaces} />
                </Modal>
                </Portal>       
        )}  
    </div> 
    )
}