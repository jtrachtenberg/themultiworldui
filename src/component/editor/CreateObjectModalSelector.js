import React, {useState, useEffect} from 'react'
import {CustomObjectModal} from './CustomObjectModal'
import {PresetObjectModal} from './PresetObjectModal'
import {NPCEditor} from './NPCEditor'

export const CreateObjectModalSelector = ({ object, userId, objectHandler, hideModal }) => {
    const [tab, setTab] = useState(typeof object !== 'undefined' && object.actionStack.type === 'NPC' ? 2 : typeof object !== 'undefined' && Array.isArray(object.actionStack) && object.actionStack.length > 0 && typeof object.actionStack[0].preset === 'string' ? 1 : 0)
    const [editMode, toggleEditMode] = useState(false)
    
    useEffect(() => {
        if (typeof object !== 'undefined') {
            toggleEditMode(true)
        }
    },[object])

    return (
        <div>
            {!editMode && 
            <div className="tabMenu">
                <span onClick={() => setTab(0)} className={`tab ${tab === 0 ? "selected" : ""}`}>Custom Object</span>
                <span onClick={() => setTab(1)} className={`tab ${tab === 1 ? "selected" : ""}`}>Object Preset</span>
                <span onClick={() => setTab(2)} className={`tab ${tab === 2 ? "selected" : ""}`}>NPC Editor</span>
            </div>
            }
        { (tab === 0) && <div><CustomObjectModal object={object} hideModal={hideModal} userId={userId} objectHandler={objectHandler} buttonText={editMode ? 'Update' : 'Create'} /></div>
        }
        { (tab === 1) && <div><PresetObjectModal object={object} hideModal={hideModal} buttonText={editMode ? 'Update' : 'Create'} userId={userId} objectHandler={objectHandler} /></div>
        }
        { (tab === 2) && <div><NPCEditor object={object} userId={userId} objectHandler={objectHandler} hideModal={hideModal} buttonText={editMode ? 'Update' : 'Create'} /></div>
        }
         </div>
    )
}