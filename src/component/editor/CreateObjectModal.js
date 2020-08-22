import React, {useState,useEffect} from 'react';
import {ReactComponent as AddIcon} from '../create.svg';
import * as Elements from './objectElements'

export const CreateObjectModal = ({setFormHeader, title, setTitle, description, setDescription, formatActionsSelect, formatActions, actionStack, editActionStack, currentAction, setCurrentAction, currentActionNumber, actions, commandId, incrementId}) => {
    const [inElements, editInElements] = useState([])
    const [elementList, editElementList] = useState([])
    const [showElements, editShowElements] = useState([])

    useEffect(() => {
        let elements = []
        let showElements = []
        for (const [key, value] of Object.entries(Elements)) {
            elements.push({name: key, value: value})
            showElements.push(false)
        }
        editInElements(elements)
        editShowElements(showElements)
    },[actions])

    const handleElementChange = (e) => {

    }

    const formatElements = () => {
        return inElements.map((element,i) => {
            const Name = element.name
            const NewElement = element.value
            let symbol
            if (elementList.length > 0)
                symbol = elementList[i].symbol
            return <span key={i}><button onClick={(e) => {
                e.preventDefault()
                const symbol = elementList[i]
                const newStack = [...actionStack]
                const actionItem = newStack[currentActionNumber]
                const commandResult = (typeof(actionItem.commandResult) !== 'undefined') ? actionItem.commandResult : ""

                actionItem.commandResult = commandResult.concat(symbol.symbol.toString())
                newStack[currentActionNumber] = actionItem

                const editShow = [...showElements]
                editShow[i] = true
                editShowElements(editShow)
                editActionStack(newStack)

            }}>{symbol}</button><NewElement show={showElements[i]} currentActionNumber={currentActionNumber} actionStack={actionStack} editActionStack={editActionStack} elementList={elementList} editElementList={editElementList} handleElementChange={handleElementChange} elementNumber={i}/>
            </span>
        })
    }
    return (
        <form id="ObjectCreatorForm">
        <section>
        <label>Title
            <input name="title" id="title" value={title} onChange={(e) => {
                setTitle(e.target.value)}} />
        </label>
        <label>Description:
            <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        </section>
        <section>
            <div>{setFormHeader("Actions")}</div>
            <div>
                <label>Add Action <AddIcon onClick = {() => {
                        const newAction = actions[currentAction]
                        newAction.id=commandId
                        incrementId(commandId+1)
                        let actionStackCopy = []
                        if (Array.isArray(actionStack) && actionStack.length > 0)
                            actionStackCopy = [...actionStack]
                        actionStackCopy.push(actions[currentAction])
                        editActionStack(actionStackCopy)
                    }
                }/></label>
                <select name="addAction" value={currentAction} onChange={(e) => setCurrentAction(e.nativeEvent.target.value)} >
                    <option value="-1" disabled>Select an Action</option>
                    {formatActionsSelect()}
                </select>
            </div>
        </section>
        <section>
            {formatActions()}
            <label>Available Elements</label>
            {formatElements()}
        </section>
        </form>
    )
}