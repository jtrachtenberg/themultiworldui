import React, {useState,/*useEffect*/} from 'react'
import { setFormHeader, /*createHandler*/ } from '../utils/formUtils';
//import {ReactComponent as AddIcon} from '../create.svg'
import {MediaSearch} from '../utils/MediaSearch'
//import * as Actions from './objectActions'
//import * as Presets from './presetObjects'
//import * as Elements from './objectElements'



export const NPCEditor = ({ userId, objectHandler}) => {

    const [modalReturn, setModalReturn] = useState({})
    //const [actionStack, setActionStack] = useState([])
    const [images, editImages] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isHostile, toggleIsHostile] = useState(false)
    const [useDefaultBehaviors, toggleUseDefaultBehaviors] = useState(true)

    return (
        <div>{setFormHeader('NPC Editor')}
        <form id="npcForm" className="row">
            <section className="vitals column">
                <label htmlFor="name">Name</label>
                <input id="name" form="" name="name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
                <label htmlFor="faction">Faction</label>
                <select name="faction" id="faction">
                    <option value={1}>Hatfields</option>
                    <option value={2}>McCoys</option>
                </select>
                <span>  +Add Faction</span>
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} ></textarea>
                <span className="checkBox">
                    <input type="checkbox" name="hostile" checked={isHostile} value={isHostile} onChange={(e) => toggleIsHostile(e.target.checked)} />
                    <label className="checkboxLabel" htmlFor="hostile">Hostile to players</label>
                </span>
                <span className="checkBox">
                    <input type="checkbox" name="defaultBehavior" checked={useDefaultBehaviors} value={useDefaultBehaviors} onChange={(e) => toggleUseDefaultBehaviors(e.target.checked)}/>
                    <label className="checkboxLabel" htmlFor="defaultBehavior">Default Behavior Sets</label>
                </span>
            </section>
            <section className="column">
                <figure>
                     <MediaSearch modalReturn={modalReturn} images={images} handleImages={setModalReturn} editImages={editImages} />
                    <figcaption>Portrait</figcaption>
                </figure>
            </section>
        </form>
        </div>

    )
}