import React, {useState, useEffect} from 'react';
import {ReactComponent as AddLockIcon} from '../../addConstraint.svg'
import {ReactComponent as AddActionIcon} from '../../addAction.svg'

export const Command = ({ userId,actionStack,editActionStack,actionStackIndex, setSelectedElementRow, setSelectedAction, actionName}) => {
    const [elementRow, setElementRow] = useState(0)

    useEffect(() => {
        if (actionStack[actionStackIndex].elementList.length > 0 && elementRow !== actionStack[actionStackIndex].elementList.length-1)
            setElementRow(actionStack[actionStackIndex].elementList.length-1)
    },[elementRow, actionStack, actionStackIndex])

    const formatElementRow = () => {
        let inRow = Number(elementRow)

        let retRows = []

        for (let i = 0;i<inRow+1;i++) {
            retRows.push(<span key={i}><label className="inputLabel">Result:</label>
            <input id={i} name="commandResult" onClick={(e) => {setSelectedAction(actionStackIndex);setSelectedElementRow(i)}} onFocus={(e) => {setSelectedAction(actionStackIndex);setSelectedElementRow(i)}} value={actionStack[actionStackIndex].elementList[i].commandResult||""} type="text" onChange={handleElementInputChange} />
                <AddActionIcon className="clickable" onClick={(e) => {
                    e.preventDefault();
                    const currentActionStack = [...actionStack]
                    const currentAction = currentActionStack[actionStackIndex]
                    const currentElementList = currentAction.elementList//[i].commandResult
                    currentElementList.push({commandResult:""})
                    currentAction.elementList = currentElementList
                    currentActionStack[actionStackIndex] = currentAction
                    
                    editActionStack(currentActionStack)
                    setElementRow(elementRow+1)
                    }
                }/></span>)
        }
        return retRows
    }

    const formatSelectedElement = () => {
        const retItem = [<span key={'a'}></span>]
        actionStack[actionStackIndex].elementList.forEach( (ele, i) => {
            if (Array.isArray(actionStack[actionStackIndex].elementList[i].selectedElement)) {
                const NewElement = actionStack[actionStackIndex].elementList[i].selectedElement[1]
                retItem.push(<span key={i}><NewElement actionStack={actionStack} editActionStack={editActionStack} actionStackIndex={actionStackIndex} elementIndex={i}/></span>)
            }
        })

        return retItem.map(item => item)
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
            <label className="inputLabel">{actionName||'Command'} to Activate:</label>
                <div>
                    <AddLockIcon />
                    <input name="commandAction" value={actionStack[actionStackIndex].commandAction||""} type="text" onClick={(e) => {setSelectedAction(actionStackIndex)}} onFocus={(e) => {setSelectedAction(actionStackIndex)}} onChange={handleInputChange} />
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