import React, { useState, useEffect } from 'react';

export const Command = ({userId, placeHandler}) => {
    const [commandAction , setCommand] = useState("")
    const [result, setResult] = useState("")
    const addActionHandler = () => {
        return (
        <section>
            <label>Command to activate?</label>
                <input name="commandAction" value={commandAction} type="text" onChange={(e) => setCommand(e.target.value)} />
            <label>Command Result?</label>
                <input name="result" value={result} type="text" onChange={(e) => setResult(e.target.value)} />
        </section>
        )
    }

    return (
        <div>{addActionHandler()}</div>
    )

}