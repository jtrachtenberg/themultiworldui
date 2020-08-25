import React from 'react';

export const Command = ({userId, handleActionChange, actionNumber, setCurrentActionNumber, actionStack}) => {


    const updateParent = (e) => {
        const {name, value} = e.target
        handleActionChange(name,value,actionNumber)
    }

    const addActionHandler = () => {
        return (
        <section>
            <label>Command to activate?</label>
                <input name="commandAction" value={actionStack[actionNumber].commandAction||""} type="text" onChange={(e) => {
                    updateParent(e)
                    }} />
            <label>Command Result?</label>
                <input name="commandResult" value={actionStack[actionNumber].commandResult||""} type="text" onChange={(e) => {
                    updateParent(e)
                    }} onClick={(e) => setCurrentActionNumber(actionNumber)}
                    onFocus={(e) => setCurrentActionNumber(actionNumber)}/>
        </section>
        )
    }

    return (
        <div>{addActionHandler()}</div>
    )

}