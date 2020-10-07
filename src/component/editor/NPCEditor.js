import React, {useState, useEffect} from 'react'
import { setFormHeader, createHandler, updateHandler } from '../utils/formUtils';
import { fetchData } from '../utils/fetchData'
import {MediaSearch} from '../utils/MediaSearch'
import { AddActionHandler } from './AddActionHandler'
import { AddReactionHandler } from './AddReactionHandler'
import * as Actions from './objectActions'
import * as Elements from './objectElements'

//import * as Actions from './objectActions'
//import * as Presets from './presetObjects'
//import * as Elements from './objectElements'

function rehydrateActionStack (inActionStack) {
    const hydrate = inActionStack.map( (action,i) => {
        const key = action.key
        const value = Actions[key]
        action.value=value

        const elementList = action.elementList
        
        elementList.forEach( (element, j) => {
            
            if (Array.isArray(element.selectedElement)) {
                const key = element.selectedElement[0]
                const eleFunc = Elements[key]
                elementList[j].selectedElement[1]=eleFunc
            }
        })
        action.elementList=elementList
        inActionStack[i]=action
        return new Promise(resolve => resolve(inActionStack[i]))
    })

    return Promise.all(hydrate).then(response => {
        return new Promise(resolve => resolve(inActionStack))
    })
}

export const NPCEditor = ({ userId, objectHandler, buttonText, hideModal, object}) => {
    const [modalReturn, setModalReturn] = useState({})
    const [actionStack, editActionStack] = useState([])
    const [reactionStack, editReactionStack] = useState([])
    const [images, editImages] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isHostile, toggleIsHostile] = useState(false)
    const [useAIBehaviors, toggleUAIBehaviors] = useState(true)
    const [hap, setHap] = useState(10)
    const [friend, setFriend] = useState(10)
    const [intel, setIntel] = useState(10)
    const [advent, setAdvent] = useState(10)
    const [strength, setStrength] = useState(10)
    const [userObjects, editUserObjects] = useState([])
    const [selectedObject, setSelectedObject] = useState(-1)
    const [inventory, editInventory] = useState([])
    const [factions, editFactions] = useState([])
    const [selectedFaction, setSelectedFaction] = useState(-1)
    const [addingFaction, toggleAddingFaction] = useState(false)
    const [newFaction, setNewFaction] = useState("")
    const [scripts, editScripts] = useState([])
    const [selectedScript, setSelectedScript] = useState(-1)

    useEffect(() => {      
        if (typeof object !== 'undefined') { 
            rehydrateActionStack(object.actionStack.actionStack).then(response => editActionStack(response))
            rehydrateActionStack(object.actionStack.reactionStack).then(response => editReactionStack(response))
            editImages(object.images)
            setName(object.title)
            setDescription(object.description)
            toggleIsHostile(object.actionStack.isHostile)
            toggleUAIBehaviors(object.actionStack.useAIBehaviors)
            setHap(object.actionStack.behaviors.hap)
            setFriend(object.actionStack.behaviors.friend)
            setIntel(object.actionStack.behaviors.intel)
            setAdvent(object.actionStack.behaviors.advent)
            setStrength(object.actionStack.behaviors.strength)
            editInventory(object.actionStack.inventory)
            setSelectedFaction(object.actionStack.faction)
            setSelectedScript(object.actionStack.scripts)
        }
    },[object])

    useEffect(() => {
        async function loadScripts() {
            const postData = {userId: userId}

            return await fetchData('getScripts', postData)
        }
        async function loadFactions() {
            const postData = {userId: userId}

            return await fetchData('getFactions', postData)
        }
        async function doFetch() {
            const postData = {userId: userId }

            return await fetchData('loadUserObjects', postData)
        }
        
        doFetch()
        .then(response => {
            response.forEach( (item,i) => {
                if (typeof item.actionStack === 'string') {
                    item.actionStack = JSON.parse(item.actionStack)
                    response[i] = item
                }
            })
            editUserObjects(response)
           
        })
        loadFactions()
        .then(response => editFactions(response))

        loadScripts()
        .then(response => editScripts(response))
    },[userId])

    const addFaction = (e) => {
        e.preventDefault()
        const postData = {name: newFaction}
                                                        //editInventory(currentInventory => currentInventory = Number(selectedObject) > 0 ? [...currentInventory,userObjects.find(object => Number(object.objectId) === Number(selectedObject))] : currentInventory)
        createHandler('faction',postData).then(faction => editFactions(currentFactions => currentFactions = [...currentFactions,faction]))

    }

    const formatScriptsSelect = () => {
        return scripts.map(script => <option key={script.scriptId} value={script.scriptId}>{script.name}</option>)
    }

    const formatFactionSelect = () => {
        return factions.map(faction => <option key={faction.factionId} value={faction.factionId}>{faction.name}</option>)
    }

    const formatInventory = () => {
        if (!Array.isArray(inventory) || inventory.length === 0) return <span></span>
        else return inventory.map(object => <div key={object.objectId} className="inventoryListItem"><img src="https://img.icons8.com/material-outlined/24/000000/delete-forever.png" alt="delete" className="clickable" onClick={e => editInventory(currentInventory => currentInventory.filter(item => item.objectId !== object.objectId))} />{object.title}</div>)
    }

    const formatObjectSelect = () => {
        return userObjects.map(object => <option key={object.objectId} value={object.objectId}>{object.title}</option>)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        let finalImages = Array.isArray(images) ? [...images] : []
        if (modalReturn !== {}) finalImages.push(modalReturn)

        const finalActionStack = {
            type:"NPC",
            actionStack: actionStack,
            reactionStack: reactionStack,
            isHostile: isHostile,
            useAIBehaviors: useAIBehaviors,
            behaviors: useAIBehaviors ? {
                hap: hap,
                friend: friend,
                intel: intel,
                advent: advent,
                strength: strength
             } : {},
             inventory: inventory,
             faction: selectedFaction,
             scripts: scripts
        }

        const postData = {
            userId: userId,
            isRoot: true,
            title: name,
            description: description,
            images: finalImages,
            actionStack: finalActionStack
        }

        if (typeof object === 'undefined')
            createHandler("object", postData, objectHandler)
        else {
            postData.objectId = object.objectId
            updateHandler("object", postData, objectHandler)
        }

        editActionStack([])
        setName("")
        setDescription("")
        //setCurrentAction(0)
        editImages([])
        setModalReturn({})
        hideModal()
    }

    return (
        <div>{setFormHeader('NPC Editor')}
        <form id="npcForm">
            <div className="row">
            <section className="vitals column">
                <label htmlFor="name">Name</label>
                <input id="name" form="" name="name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
                <label htmlFor="faction">Faction</label>
                <select name="faction" id="faction" value={selectedFaction} onChange={e => setSelectedFaction(e.target.value)} >
                    <option disabled={true} value={-1}>Select a Faction</option>
                    {formatFactionSelect()}
                </select>
                <span>{addingFaction && <input type="text" value={newFaction} onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        addFaction(e)
                        toggleAddingFaction(false)
                        
                    }
                }} onChange={e => setNewFaction(e.target.value)} />} <span className="clickable" onClick={e => {
                    if (addingFaction) addFaction(e)
                    toggleAddingFaction(!addingFaction)
                }}> +Add Faction</span></span>
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} ></textarea>
                <span className="checkBox">
                    <input type="checkbox" name="hostile" checked={isHostile} value={isHostile} onChange={(e) => toggleIsHostile(e.target.checked)} />
                    <label className="checkboxLabel" htmlFor="hostile">Hostile to players</label>
                </span>
                <span className="checkBox">
                    <input type="checkbox" name="defaultBehavior" checked={useAIBehaviors} value={useAIBehaviors} onChange={(e) => toggleUAIBehaviors(e.target.checked)}/>
                    <label className="checkboxLabel" htmlFor="defaultBehavior">AI Behavior Sets</label>
                </span>
                <div className="sliders">
                    <span className="slideItem row"><label className="left columnThird">Melancholy</label><input disabled={!useAIBehaviors} className="columnThird" type="range" min="1" max="20" value={hap} onChange={(e) => setHap(e.target.value)} /><label className="right columnThird">Joyful</label></span>
                    <span className="slideItem row"><label className="left columnThird">Ornery</label><input disabled={!useAIBehaviors} className="columnThird" type="range" min="1" max="20" value={friend} onChange={(e) => setFriend(e.target.value)}/><label className="right columnThird">Friendly</label></span>
                    <span className="slideItem row"> <label className="left columnThird">Street-smart</label><input disabled={!useAIBehaviors} className="columnThird" type="range" min="1" max="20" value={intel} onChange={(e) => setIntel(e.target.value)}/><label className="right columnThird">Scholarly</label></span>
                    <span className="slideItem row"> <label className="left columnThird">Timid</label><input disabled={!useAIBehaviors} className="columnThird" type="range" min="1" max="20" value={advent} onChange={(e) => setAdvent(e.target.value)}/><label className="right columnThird">Adventurous</label></span>
                    <span className="slideItem row"> <label className="left columnThird">Sedentary</label><input disabled={!useAIBehaviors} className="columnThird" type="range" min="1" max="20" value={strength} onChange={(e) => setStrength(e.target.value)}/><label className="right columnThird">Active</label></span>
                </div>
            </section>
            <section className="column">
                <figure>
                     <MediaSearch modalReturn={modalReturn} images={images} handleImages={setModalReturn} editImages={editImages} />
                    <figcaption>Portrait</figcaption>
                </figure>
                <div className="row">
                    <span className="column">
                        <label>Inventory</label><span onClick={(e) => {
                                e.preventDefault()
                                editInventory(currentInventory => currentInventory = Number(selectedObject) > 0 ? [...currentInventory,userObjects.find(object => Number(object.objectId) === Number(selectedObject))] : currentInventory)
                                    }} className="clickable">  +Add Item</span>
                        <select name="userObjects" value={selectedObject} onChange={e => setSelectedObject(e.target.value)}>
                            <option disabled={true} value={-1}>Select an object to add</option>
                            {formatObjectSelect()}
                        </select>
                        <div id="inventoryList" className="searchResult" >{formatInventory()}</div>
                    </span>
                    <span className="column">
                        <label>Scipts</label><span className="clickable"> +Add Script</span>
                        <select name="scriptSelect" id="scriptSelect" vale={selectedScript} onChange={e => setSelectedScript(e.target.value)} >
                            <option disabled={true} value={-1}>Select an available script</option>
                            {formatScriptsSelect()}
                        </select>
                    </span>
                </div>
            </section>
            </div>
            <div className="formBottom">
            <AddActionHandler userId={userId} actionStack={actionStack} editActionStack={editActionStack} />
            <AddReactionHandler userId={userId} reactionStack={reactionStack} editReactionStack={editReactionStack} />

            </div>
        </form>
        <button name="submit" onClick={handleSubmit}>{buttonText}</button>
        </div>

    )
}