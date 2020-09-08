import React, {useState} from 'react'
import {CustomObjectModal} from './CustomObjectModal'
import {PresetObjectModal} from './PresetObjectModal'
import {NPCEditor} from './NPCEditor'

export const CreateObjectModalSelector = ({ userId, objectHandler, hideModal }) => {
    const [tab, setTab] = useState(0)
    
    return (
        <div>
            <div className="tabMenu">
                <span onClick={() => setTab(0)} className={`tab ${tab === 0 ? "selected" : ""}`}>Custom Object</span>
                <span onClick={() => setTab(1)} className={`tab ${tab === 1 ? "selected" : ""}`}>Object Preset</span>
                <span onClick={() => setTab(2)} className={`tab ${tab === 2 ? "selected" : ""}`}>NPC Editor</span>
            </div>
        { (tab === 0) && <div><CustomObjectModal hideModal={hideModal} userId={userId} objectHandler={objectHandler} buttonText="Create" /></div>
        }
        { (tab === 1) && <div><PresetObjectModal userId={userId} objectHandler={objectHandler} /></div>
        }
        { (tab === 2) && <div><NPCEditor userId={userId} objectHandler={objectHandler} /></div>
        }
         </div>
    )
}