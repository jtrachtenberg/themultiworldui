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
    const [commands, editCommands] = useState([])
    const [showModal, toggleShowModal] = useState(false)
    const [title, setTitle] = useState("")
    const [modalReturn, setModalReturn] = useState({})
    const [description, setDescription] = useState("")
    const [triggers, editTriggers] = useState([])
    const [actions, editActions] = useState([])
    const [currentAction, setCurrentAction] = useState(0)
    const [isRoot, toggleIsRoot] = useState(true)
    const [commandId, incrementId] = useState(1)

    useEffect(() => {
        console.log('userId')
        let inCommands = []
        for (const [key, value] of Object.entries(Actions)) {
            inCommands.push({command: key, value: value})
        }
        editActions(inCommands)
    },[userId])

    useEffect(() => {
        console.log('commands')
        console.log(commands)
    }, [commands])

    const hideModal = (e) => {
        setModalReturn(e)
        toggleShowModal(false)
    };

    const formatActions = () => {
        if (Array.isArray(commands) && commands.length === 0)
            return <div></div>
        
        return commands.map((command,i) => {
            console.log(command)
            const NewAction = actions.find((value) => value.command === command.command).value
            
            return <div key={i}><NewAction /></div>
        })

        /*return Object.entries(commands).map((value,i) => {
            console.log(value)
            console.log(i)
            const cmd = value[0]
            console.log(currentAction.Command)
            return <div><commands.Command /></div>
        })*/
        /*return objectMap(commands, Command => {
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
                    <CreateObjectModal setFormHeader={setFormHeader} title={title} setTitle={setTitle} description={description} setDescription={setDescription} formatActionsSelect={formatActionsSelect} formatActions={formatActions} commands={commands} editCommands={editCommands} currentAction={currentAction} setCurrentAction={setCurrentAction} actions={actions} commandId={commandId} incrementId={incrementId}/>
                </Modal>
                </Portal>       
        )}  
    </div> 
    )
}