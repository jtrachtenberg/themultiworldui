import React, {useState} from 'react';
import {ReactComponent as AddLockIcon} from '../../addConstraint.svg'
import {ReactComponent as AddActionIcon} from '../../addAction.svg'
//import * as Elements from '../objectElements'

export const Command = ({ userId,actionStack,editActionStack,actionStackIndex, setSelectedElementRow}) => {
    //({currentElementNumber, setCurrentElementNumber, handleActionChange, actionNumber, setCurrentActionNumber, actionStack, elementStack, editActionStack, editElementStack, elementList, editElementList,handleElementChange}) => {
    const [elementRow, setElementRow] = useState(0)

    const formatElementRow = () => {
        let inRow = Number(elementRow)

        let retRows = []

        for (let i = 0;i<inRow+1;i++) {
            retRows.push(<span key={i}><label className="inputLabel">Result:</label>
            <input id={i} name="commandResult" onClick={(e) => {e.preventDefault();setElementRow(i);setSelectedElementRow(i)}} onFocus={(e) => {e.preventDefault();setElementRow(i);setSelectedElementRow(i)}} value={actionStack[actionStackIndex].elementList[i].commandResult||""} type="text" onChange={handleElementInputChange} />
                <AddActionIcon className="clickable" onClick={(e) => setElementRow(elementRow+1)}/></span>)
        }
        return retRows
    }

    const formatSelectedElement = () => {
        if (Array.isArray(actionStack[actionStackIndex].elementList[elementRow].selectedElement)) {
            const NewElement = actionStack[actionStackIndex].elementList[elementRow].selectedElement[1]
            return <span><NewElement actionStack={actionStack} editActionStack={editActionStack} actionStackIndex={actionStackIndex} elementIndex={elementRow}/></span>
        }
        return <span></span>
    }

    const handleElementInputChange = (e) => {
        const {checked, name, value, type, id} = e.target
        const finalValue = type === 'checkbox' ? checked : value
        const currentActionStack = [...actionStack]
        currentActionStack[actionStackIndex].elementList[id][name]=finalValue
        editActionStack(currentActionStack)
    }
    const handleInputChange = (e) => {
        const {checked, name, value, type} = e.target
        const finalValue = type === 'checkbox' ? checked : value
        const currentActionStack = [...actionStack]
        currentActionStack[actionStackIndex][name]=finalValue
        editActionStack(currentActionStack)
    }

    const addActionHandler = () => {
        return (
        <section>
        <div className="column">
            <div className="columnContent">
            <label className="inputLabel">Command to Activate:</label>
                <div>
                    <AddLockIcon />
                    <input name="commandAction" value={actionStack[actionStackIndex].commandAction||""} type="text" onChange={handleInputChange} />
                </div>
            </div>
        </div>
        <div className="column">
            <div className="columnContent">
                {formatElementRow()}
            </div>
        </div>
        <div className="column">
            <div className="columnContent">
                {formatSelectedElement()}
            </div>
        </div>
        </section>
        )
    }

    return (
        <div className="row">{addActionHandler()}</div>
    )

}