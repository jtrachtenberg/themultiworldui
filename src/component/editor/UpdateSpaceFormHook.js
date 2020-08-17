import React, { useState, useEffect } from 'react';
import { setFormHeader, updateHandler } from '../utils/formUtils';
import {SpaceSelect} from './SpaceSelect'

export const UpdateSpaceFormHook = ({userId, spaces, spaceHandler}) => {
    const [isVis, toggleIsVis] = useState(true)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isRoot, toggleIsRoot] = useState(true)
    const [currentSpace, setCurrentSpace] = useState({})

    useEffect(() => {
        if (Array.isArray(spaces) && spaces.length > 0)
            setCurrentSpace(spaces[0])
    },[spaces])

    useEffect(() => {
        console.log(currentSpace)
        if (typeof(currentSpace.title) !== 'undefined') setTitle(currentSpace.title)
        if (typeof(currentSpace.description) !== 'undefined')setDescription(currentSpace.description)
        typeof(currentSpace.isRoot) === 'number' ? toggleIsRoot(currentSpace.isRoot) : toggleIsRoot(false)
    },[currentSpace])

    const handleSubmit = (e) => {
        var subSpace = Object.assign(currentSpace)
        
        subSpace.title = title
        subSpace.description = description
        subSpace.isRoot = isRoot

        updateHandler("space", subSpace, spaceHandler)
        e.preventDefault();
    }

    if (userId && currentSpace && currentSpace.spaceId)
        return (
            <div>
            <div>{setFormHeader("Update Space", () => toggleIsVis(!isVis))}</div>
            <form className={isVis ? "n" : "invis"} onSubmit={handleSubmit}>
            <SpaceSelect userId={userId} inSpaceId={currentSpace.spaceId} spaces={spaces} defaultSpaceId={currentSpace.spaceId} setCurrentSpace={inSpaceId => setCurrentSpace(() => {
                    return spaces.find( ({ spaceId }) => spaceId === inSpaceId )
            })}/>  
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