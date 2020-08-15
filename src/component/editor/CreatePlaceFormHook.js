import React, { useState } from 'react';
import { setFormHeader, createHandler } from '../utils/formUtils';
import { Place } from '../utils/defaultObjects';

export const CreatePlaceFormHook = ({inUser, inPlace, spaceId, placeHandler}) => {
    const [isVis, toggleIsVis] = useState(true)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isRoot, toggleIsRoot] = useState(false)
    const [isExit, toggleIsExit] = useState(false)
    const [cmd, setCmd] = useState("")

    const handleSubmit = (e) => {
        const place = Object.assign(Place)
        e.preventDefault();

        const prevPlace = inPlace
        place.title = title
        place.description = description
        place.isRoot = isRoot
        place.spaceId = spaceId
        let exits = []
        const finalcmd = cmd.length > 0 ? cmd.split(" ")[0] : prevPlace.title.split(" ")[0]
        if (isExit) {
            exits.push({[finalcmd]:{placeId:prevPlace.placeId,title:prevPlace.title}})
        }
        place.exits = exits
        console.log(place)
        createHandler("place", place, placeHandler)

        setTitle("")
        setDescription("")
        toggleIsRoot(false)
        toggleIsExit(true)
        setCmd("")
    }

    if (inUser.userId)
            return (
                <div>
                <div>{setFormHeader("Create Place", () => toggleIsVis(!isVis))}</div>
                
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
                <label>Add as Exit?</label>
                <input name="isExit" type="checkbox" value={isExit} checked={isExit} onChange={(e) => toggleIsExit(!isExit)} />  
                <label>Exit Command</label><input name="cmd"  type="text" value={cmd} onChange={(e) => setCmd(e.target.value)}  /> 
                <input type="submit" value="Submit" />
                </form>
                </div>
            )
    else
        return(<div></div>)
}