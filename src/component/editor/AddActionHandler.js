import React, {useState} from 'react'
import {setFormHeader} from '../utils/formUtils'
import * as Actions from './objectActions'
import * as Elements from './objectElements'

export const AddActionHandler = ({ userId, actionStack, editActionStack }) => {
    const [currentAction, setCurrentAction] = useState(0)
    const [selectedElementRow, setSelectedElementRow] = useState(0)
    const [selectedAction, setSelectedAction] = useState(0)
    const formatActions = () => {
        if (actionStack.length === 0)
            return <span></span>
        return actionStack.map((command,i) => {
            const NewAction = command.value
            return <div key={i}><NewAction setSelectedElementRow={setSelectedElementRow} userId={userId} actionStack={actionStack} editActionStack={editActionStack} actionStackIndex={i} setSelectedAction={setSelectedAction} /></div>
        })
    }

    const formatElements = () => {
        return Object.keys(Elements).map((item,i) => {
            return <span key={i}><button value={i} onClick = {(e) => {
                e.preventDefault()
                const currentActionStack = [...actionStack]
                const newAction = Object.assign(currentActionStack[selectedAction])//{...currentActionStack[selectedAction]}
                const currentElementList = [...newAction.elementList]
                currentElementList[selectedElementRow].selectedElement=[...Object.entries(Elements)[i]]
                currentElementList[selectedElementRow].commandResult=`<${item.toLowerCase()}>`
                currentActionStack[selectedAction] = newAction
                editActionStack(currentActionStack)
            }}>{item}</button></span>
        })
    }

    const formatActionsSelect = () => {
        return Object.keys(Actions).map((item,i) => {
            return <option key={i} value={i}>{item}</option>
        })
    }

    return (
        <div>
            <section>
                    <div>{setFormHeader("Actions")}</div>
                    <div className="row">
                        <label>Add Action <img alt="add action" src="https://img.icons8.com/metro/26/000000/add-property.png" onClick = {() => {
                                const currentActionStack = [...actionStack]
                                const Action = Object.entries(Actions)[currentAction]
                                const newAction = {key:Action[0],value:Action[1],elementList:[{commandResult:""}],commandAction:""}
                                currentActionStack.push(newAction)
                                editActionStack(currentActionStack)
                            }
                        }/>
                        </label>
                        <select name="addAction" value={currentAction} onChange={(e) => setCurrentAction(e.nativeEvent.target.value)} >
                            <option value="-1" disabled>Select an Action</option>
                            {formatActionsSelect()}
                        </select>
                    </div>
                </section>
                <section>
                    <div className="row">
                        {formatActions()}
                    </div>
                    <div className="row">
                        <label>Available Elements</label>
                            {formatElements()}
                    </div>
                </section>
        </div>
    )
}