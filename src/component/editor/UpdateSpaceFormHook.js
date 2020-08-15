import React, { useState, useEffect } from 'react';
import { setFormHeader, updateHandler } from '../utils/formUtils';

export const UpdateSpaceFormHook = ({userId, inSpace, spaceHandler}) => {
    const [isVis, toggleIsVis] = useState(true)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isRoot, toggleIsRoot] = useState(true)

    useEffect(() => {
        setTitle(inSpace.title)
        setDescription(inSpace.description)
        typeof(inSpace.isRoot) === 'number' ? toggleIsRoot(inSpace.isRoot) : toggleIsRoot(false)
    },[inSpace])

    const handleSubmit = (e) => {
        var subSpace = Object.assign(inSpace)
        
        subSpace.title = title
        subSpace.description = description
        subSpace.isRoot = isRoot

        updateHandler("space", subSpace, spaceHandler)
        e.preventDefault();
    }

    if (userId && inSpace && inSpace.spaceId)
        return (
            <div>
            <div>{setFormHeader("Update Space", () => toggleIsVis(!isVis))}</div>
            <form className={isVis ? "n" : "invis"} onSubmit={handleSubmit}>
            <label>Title
                <input name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>Description:
                <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>              
            <label>
            Is Root?:
            <input
                name="isRoot"
                type="checkbox" 
                value={isRoot} 
                checked={isRoot}
                onChange={(e) => toggleIsRoot(!isRoot)} />
            </label>
            <input type="submit" value="Update" />
            </form>
        </div>
        )
    else
            return (
                <div>?!?!?!</div>
            )
}