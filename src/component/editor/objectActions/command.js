import React, { useState } from 'react';

export const Command = ({userId, handleActionChange, actionNumber, setCurrentActionNumber, actionStack}) => {
    const [commandAction , setCommand] = useState("")
    //const [result, setResult] = useState("")

    const updateParent = (e) => {
        const {name, value} = e.target
        handleActionChange(name,value,actionNumber)
    }

    const addActionHandler = () => {
        return (
        <section>
            <label>Command to activate?</label>
                <input name="commandAction" value={commandAction} type="text" onChange={(e) => {
                    updateParent(e)
                    setCommand(e.target.value)}} />
            <label>Command Result?</label>
                <input name="commandResult" value={actionStack[actionNumber].commandResult||""} type="text" onChange={(e) => {
                    updateParent(e)
                    //setResult(e.target.value)
                    }} onClick={(e) => setCurrentActionNumber(actionNumber)}
                    onFocus={(e) => setCurrentActionNumber(actionNumber)}/>
        </section>
        )
    }

    return (
        <div>{addActionHandler()}</div>
    )

}