import React, {useState} from 'react'
import {setFormHeader} from '../utils/formUtils'
import * as Actions from './objectActions'
import * as Elements from './objectElements'

export const AddReactionHandler = ({ userId, reactionStack, editReactionStack }) => {
    const [currentReaction, setCurrentReaction] = useState(0)
    const [selectedElementRow, setSelectedElementRow] = useState(0)
    const [selectedReaction, setSelectedReaction] = useState(0)
    const formatActions = () => {
        if (reactionStack.length === 0)
            return <span></span>
        return reactionStack.map((command,i) => {
            const NewAction = command.value
            return <div key={i}><NewAction setSelectedElementRow={setSelectedElementRow} userId={userId} actionStack={reactionStack} editActionStack={editReactionStack} actionStackIndex={i} setSelectedAction={setSelectedReaction} actionName="Listen" /></div>
        })
    }

    const formatElements = () => {
        return Object.keys(Elements).map((item,i) => {
            return <span key={i}><button value={i} onClick = {(e) => {
                e.preventDefault()
                const currentRereactionStack = [...reactionStack]
                const newAction = Object.assign(currentRereactionStack[selectedReaction])//{...currentRereactionStack[selectedReaction]}
                const currentElementList = [...newAction.elementList]
                currentElementList[selectedElementRow].selectedElement=[...Object.entries(Elements)[i]]
                currentElementList[selectedElementRow].commandResult=`<${item.toLowerCase()}>`
                currentRereactionStack[selectedReaction] = newAction
                editReactionStack(currentRereactionStack)
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
                    <div>{setFormHeader("Reactions")}</div>
                    <div className="row">
                        <label>Add Reaction <img alt="add action" src="https://img.icons8.com/metro/26/000000/add-property.png" onClick = {() => {
                                const currentRereactionStack = [...reactionStack]
                                const Action = Object.entries(Actions)[currentReaction]
                                const newAction = {key:Action[0],value:Action[1],elementList:[{commandResult:""}],commandAction:""}
                                currentRereactionStack.push(newAction)
                                editReactionStack(currentRereactionStack)
                            }
                        }/>
                        </label>
                        <select name="addAction" value={currentReaction} onChange={(e) => setCurrentReaction(e.nativeEvent.target.value)} >
                            <option value="-1" disabled>Select a Reaction</option>
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