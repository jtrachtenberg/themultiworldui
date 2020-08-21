import React, { useState, useEffect } from 'react';

export const Trigger = ({userId, placeHandler}) => {
    const [commandAction , setCommand] = useState("")
    const [result, setResult] = useState("")
    const addActionHandler = () => {
        return (
        <section>
            <label>Trigger to add?</label>
                <select>
                    <option>Time of day</option>
                    <option>Location</option>
                    <option>Object</option>
                </select>
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