import React, { useState } from 'react';
import { setFormHeader, createHandler } from '../utils/formUtils';
import { Space } from '../utils/defaultObjects';

export const CreateSpaceFormHook = ({userId, spaceHandler}) => {
    const [isVis, toggleIsVis] = useState(true)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isRoot, toggleIsRoot] = useState(false)

    const handleSubmit = (e) => {
        const space = Object.assign(Space)
        e.preventDefault();

        space.title = title
        space.description = description
        space.isRoot = isRoot
        space.userId = userId
        
        createHandler("space", space, spaceHandler)

        setTitle("")
        setDescription("")
        toggleIsRoot(false)
    }

    if (userId)
            return (
                <div>
                    <div>{setFormHeader("Create Space", () => toggleIsVis(!isVis))}</div>
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
                <input type="submit" value="Submit" />
                </form>
                </div>
            )
    else return (<div></div>)
}