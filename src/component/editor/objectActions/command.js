import React from 'react';
import {ReactComponent as AddLockIcon} from '../../addConstraint.svg'
import {ReactComponent as AddActionIcon} from '../../addAction.svg'
//import * as Elements from '../objectElements'

export const Command = ({handleActionChange, actionNumber, setCurrentActionNumber, actionStack, elementStack, editActionStack, editElementStack, elementList, editElementList,handleElementChange}) => {


    const updateParent = (e) => {
        const {name, value} = e.target
        handleActionChange(name,value,actionNumber)
    }

    const formatElement = () => {
        const currentelementList=Array.isArray(elementStack) ? Array.from(elementStack) : []
        if (Array.isArray(currentelementList) && currentelementList.length > 0) {
                const element = currentelementList[actionNumber]
                if (typeof element === 'undefined') return <div></div>
                if (typeof element.value === 'undefined') return <div></div>
                const NewElement = element.value
                return <span key={actionNumber}><NewElement show={true} currentActionNumber={actionNumber} actionStack={actionStack} editActionStack={editActionStack} elementList={elementList} editElementList={editElementList} handleElementChange={handleElementChange} elementNumber={actionNumber}/></span>
            
        } else return <div></div>
    }
    const addActionHandler = () => {
        return (
        <section>
        <div className="column">
            <div className="columnContent">
            <label className="inputLabel">Command to Activate:</label>
                <div>
                    <AddLockIcon />
                    <input name="commandAction" value={actionStack[actionNumber].commandAction||""} type="text" onChange={(e) => {
                        updateParent(e)
                        }} />
                </div>
            </div>
        </div>
        <div className="column">
            <div className="columnContent">
            <label className="inputLabel">Result:</label>
                <input name="commandResult" value={actionStack[actionNumber].commandResult||""} type="text" onChange={(e) => {
                    updateParent(e)
                    }} onClick={(e) => setCurrentActionNumber(actionNumber)}
                    onFocus={(e) => setCurrentActionNumber(actionNumber)}/>
                    <AddActionIcon />
            </div>
        </div>
        <div className="column">
            <div className="columnContent">
                {formatElement()}
            </div>
        </div>
        </section>
        )
    }

    return (
        <div className="row">{addActionHandler()}</div>
    )

}