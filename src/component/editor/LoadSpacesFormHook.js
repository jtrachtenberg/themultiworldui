import React, { useState, useEffect } from 'react';
import { setFormHeader } from '../utils/formUtils';

export const LoadSpacesFormHook = ({userId, inSpaceId, spaces, setCurrentSpace}) => {
    const [isVis, toggleIsVis] = useState(true)
    const [spaceId, setSpaceId] = useState(inSpaceId)

    useEffect(() => {
        if (inSpaceId) setSpaceId(inSpaceId)
    },[inSpaceId])

    useEffect(() => {
        if (spaceId) setCurrentSpace(spaceId)
    }, [spaceId, setCurrentSpace]) // Only re-run the effect if spaceId changes

    const formatSpaces = () => {
        return spaces.map((value,i) => <option key={i} value={value.spaceId}>{value.title}</option>)
    }

    if (userId && Array.isArray(spaces))
        return (
            <div>
                <div>{setFormHeader("Select a space",() => toggleIsVis(!isVis))}</div>
                <form className={isVis ? "n" : "invis"}>
                    <select onChange={(e) => setSpaceId(Number(e.target.value))}>
                        <option value="" disabled>Select a World</option>
                        {formatSpaces()}
                    </select>
                </form>
            </div>
        )
    else if (userId)
        return (
            <div>
                <div>{setFormHeader("No spaces created.")}</div>
            </div>
        )
    else
        return (
            <div></div>
        )

}