import React, { useState, useEffect } from 'react'
import { setFormHeader, createHandler } from '../utils/formUtils'
import { Place } from '../utils/defaultObjects';
import { SpaceSelect } from './SpaceSelect'
import { fetchData } from '../utils/fetchData'

export const CreatePlaceFormHook = ({userId, inPlace, spaces, placeHandler}) => {
    const [isVis, toggleIsVis] = useState(true)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [spaceId, setSpaceId] = useState(0)
    const [places, setPlaces] = useState([])
    const [isRoot, toggleIsRoot] = useState(false)
    const [isExit, toggleIsExit] = useState(false)
    const [canEdit, toggleCanEdit] = useState(false)
    const [cmd, setCmd] = useState("")
    
    useEffect(() => {
        const loadPlaces = async (inSpaceId) => {
            inSpaceId = inSpaceId||spaceId
            const postData = {spaceId: inSpaceId, userId: userId}
            await fetchData('loadPlaces', postData)
            .then(response => {
                setPlaces(response)
                if (response.length === 0) toggleIsRoot(true)
            })
            .catch(e => console.log(e))
            
        }
        if (!Array.isArray(spaces) || spaces.length === 0 || (Object.keys(spaces[0]).length === 0 && spaces[0].constructor === Object)) {
            toggleCanEdit(false)
        } else {
            toggleCanEdit(true)
            setSpaceId(spaces[0].spaceId)
            loadPlaces(spaces[0].spaceId)
        }
    },[spaces])

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
        createHandler("place", place, placeHandler)

        setTitle("")
        setDescription("")
        toggleIsRoot(false)
        toggleIsExit(true)
        setCmd("")
    }

    if (userId)
            return (
                <div>
                <div>{setFormHeader("Create Place", () => toggleIsVis(!isVis))}</div>
                { canEdit &&
                <form className={isVis ? "n" : "invis"} onSubmit={handleSubmit}>
                <label>Title
                    <input name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>Description:
                    <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <SpaceSelect userId={userId} inSpaceId={spaceId} spaces={spaces} defaultSpaceId={Array.isArray(spaces) && spaces.length > 0 ? spaces[0].spaceId : 0} setCurrentSpace={inSpaceId => setSpaceId(inSpaceId)}/>              
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
                }
                {!canEdit &&
                    <div>
                        Please create a space.
                    </div>
                }
                </div>
            )
    else
        return(<div></div>)
}