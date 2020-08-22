import React, { useState, useEffect } from 'react';
import { setFormHeader, createHandler } from '../utils/formUtils';
import {ReactComponent as CreateIcon} from '../createobject.svg';

import {Modal} from '../utils/Modal'
import Portal from '../utils/Portal'
import * as Actions from './objectActions'
import {CreateObjectModal} from './CreateObjectModal'

/*const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )
*/

export const ObjectCreatorFormHook = ({userId, placeHandler}) => {
    const [actionStack, editActionStack] = useState([])
    const [showModal, toggleShowModal] = useState(false)
    const [title, setTitle] = useState("")
    const [modalReturn, setModalReturn] = useState({})
    const [description, setDescription] = useState("")
    const [triggers, editTriggers] = useState([])
    const [actions, editActions] = useState([])
    const [currentAction, setCurrentAction] = useState(0)
    const [isRoot, toggleIsRoot] = useState(true)
    const [commandId, incrementId] = useState(1)
    const [currentActionNumber, setCurrentActionNumber] = useState(-1)

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
        setModalReturn(e)
        toggleShowModal(false)
    };

    const formatActions = () => {
        if (Array.isArray(actionStack) && actionStack.length === 0)
            return <div></div>
        
        return actionStack.map((command,i) => {
            console.log(command)
            const NewAction = actions.find((value) => value.command === command.command).value
            
            return <div key={i}><NewAction userId={userId} handleActionChange={handleActionChange} actionNumber={i} setCurrentActionNumber={setCurrentActionNumber} actionStack={actionStack} /></div>
        })

        /*return Object.entries(actionStack).map((value,i) => {
            console.log(value)
            console.log(i)
            const cmd = value[0]
            console.log(currentAction.Command)
            return <div><actionStack.Command /></div>
        })*/
        /*return objectMap(actionStack, Command => {
            console.log(Command)
            return <div><[Command] /></div>
        })*/
        
    }
    const formatActionsSelect = () => {
        if (Array.isArray(actions))
        return actions.map((value,i) => <option key={i} value={i}>{value.command}</option>)
    }

    return(
    <div>
        <div>{setFormHeader("Object Creator")}<span><CreateIcon onClick={() => toggleShowModal(true)}/></span></div>
        {showModal && (
            <Portal id="objectModal">
                <Modal handleClose={hideModal} show={showModal}>
                    <CreateObjectModal setFormHeader={setFormHeader} title={title} setTitle={setTitle} description={description} setDescription={setDescription} formatActionsSelect={formatActionsSelect} formatActions={formatActions} actionStack={actionStack} editActionStack={editActionStack} currentAction={currentAction} setCurrentAction={setCurrentAction} currentActionNumber={currentActionNumber} actions={actions} commandId={commandId} incrementId={incrementId}/>
                </Modal>
                </Portal>       
        )}  
    </div> 
    )
}