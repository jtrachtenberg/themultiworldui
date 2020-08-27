import React, { useState, useEffect } from 'react';
import { setFormHeader, updateHandler } from '../utils/formUtils';
import {ReactComponent as EditIcon} from '../EditObject.svg';

import {Modal} from '../utils/Modal'
import Portal from '../utils/Portal'
import * as Actions from './objectActions'
import {CreateObjectModal} from './CreateObjectModal'

export const ObjectUpdateFormHook = ({userId, inObject, objectHandler}) => {
    const [actionStack, editActionStack] = useState([])
    const [showModal, toggleShowModal] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    //const [triggers, editTriggers] = useState([])
    const [actions, editActions] = useState([])
    const [currentAction, setCurrentAction] = useState(0)
    const [commandId, incrementId] = useState(1)
    const [currentActionNumber, setCurrentActionNumber] = useState(-1)
    const [imageModal, setImageModal] = useState({})
    const [images, editImages] = useState([])

    useEffect(() => {
        const initVars = () => {
            setDescription(inObject.description)
            setTitle(inObject.title)
            editActionStack(JSON.parse(inObject.actionStack.replace(/\\/g, "")))
        }
        if (inObject.objectId) initVars()
    },[inObject])

    useEffect(() => {
        let inCommands = []
        for (const [key, value] of Object.entries(Actions)) {
            inCommands.push({command: key, value: value})
        }
        editActions(inCommands)
    },[userId])

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
    };

    const formatActions = () => {
        if (!Array.isArray(actionStack) || actionStack.length === 0)
            return <div></div>
        
        return actionStack.map((command,i) => {

            const NewActionCmd = actions.find((value) => value.command === command.command)
            let NewAction = null
            if (NewActionCmd) NewAction = NewActionCmd.value ? NewActionCmd.value : null
            if (NewAction)
                return <div key={i}><NewAction userId={userId} handleActionChange={handleActionChange} actionNumber={i} setCurrentActionNumber={setCurrentActionNumber} actionStack={actionStack} /></div>
            else
                return <div key={i}></div>
        })
    }
    const formatActionsSelect = () => {
        if (Array.isArray(actions))
        return actions.map((value,i) => <option key={i} value={i}>{value.command}</option>)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let finalImages = Array.isArray(images) ? [...images] : []
        if (Object.keys(imageModal).length === 0 && imageModal.constructor === Object) {} else finalImages.push(imageModal)

        const submitData = {
            objectId: inObject.objectId,
            title: title,
            placeId: typeof(inObject.placeId) !== 'undefined' ? inObject.placeId : 0,
            description: description,
            isRoot: true,
            actionStack: actionStack,
            images: finalImages
        }
        toggleShowModal(false)
        updateHandler("object", submitData, objectHandler)
        editActionStack([])
        setTitle("")
        setDescription("")
        //editTriggers([])
        setCurrentAction(0)
        incrementId(1)
        setCurrentActionNumber(-1)
        setImageModal({})
    }

    return(
    <span>
        <span><EditIcon onClick={() => toggleShowModal(true)}/></span>
        {showModal && (
            <Portal id="objectModal">
                <Modal handleClose={hideModal} show={showModal}>
                    <CreateObjectModal inObject={inObject} setImageModal={setImageModal} setFormHeader={setFormHeader} title={title} setTitle={setTitle} description={description} setDescription={setDescription} formatActionsSelect={formatActionsSelect} formatActions={formatActions} actionStack={actionStack} editActionStack={editActionStack} currentAction={currentAction} setCurrentAction={setCurrentAction} currentActionNumber={currentActionNumber} actions={actions} commandId={commandId} incrementId={incrementId} handleSubmit={handleSubmit} buttonText="Update" images={images} editImages={editImages} />
                </Modal>
                </Portal>       
        )}  
    </span> 
    )
}