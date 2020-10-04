import React, {useState, useEffect} from 'react'
import { createHandler, updateHandler } from '../utils/formUtils';
import {MediaSearch} from '../utils/MediaSearch'
import * as Presets from './presetObjects'
import * as Elements from './objectElements'

function rehydrateActionStack (inActionStack) {
    const hydrate = inActionStack.map( (action,i) => {
        const key = action.key
        const value = Presets[key]
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

export const PresetObjectModal = ({ object, userId, objectHandler, buttonText, hideModal}) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [modalReturn, setModalReturn] = useState({})
    const [actionStack, editActionStack] = useState([])
    const [currentAction, setCurrentAction] = useState(-1)
    const [images, editImages] = useState([])

    useEffect(() => {       
        rehydrateActionStack(object.actionStack).then(response => editActionStack(response))
        editImages(object.images)
        setTitle(object.title)
        setDescription(object.description)
    },[object])

    const formatPresets = () => {
        if (actionStack.length === 0)
            return <span></span>
        return actionStack.map((command,i) => {
            console.log(command)
            const NewAction = command.value
            return <div key={i}><NewAction userId={userId} actionStack={actionStack} editActionStack={editActionStack} actionStackIndex={i} /></div>
        })
    }

    const formatPresetsSelect = () => {
        return Object.keys(Presets).map((item,i) => {   
            return <option key={i} value={i}>{item}</option>
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        let finalImages = Array.isArray(images) ? [...images] : []
        if (modalReturn !== {}) finalImages.push(modalReturn)
        const finalActionStack = actionStack
        finalActionStack.type='Preset'
        const postData = {
            userId: userId,
            isRoot: true,
            title: title,
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
        setTitle("")
        setDescription("")
        setCurrentAction(0)
        editImages([])
        setModalReturn({})
        hideModal()
    }
    return (
        <div>
            <form id="PresetCreatorForm">
                <section>
                    <label>Select a Preset</label>
                    <select name="addPreset" value={currentAction} onChange={(e) => {
                                const newActionNum = e.nativeEvent.target.value
                                setCurrentAction(newActionNum)
                                const Action = Object.entries(Presets)[newActionNum]
                                const newAction = {key:Action[0],value:Action[1],elementList:[{commandResult:""}],commandAction:""}
                
                                editActionStack([newAction])
                            }
                        }>
                        <option value="-1" disabled>Select a Preset</option>
                        {formatPresetsSelect()}
                    </select>
                </section>
                <section>
                <label>Title
                    <input name="title" id="title" value={title} onChange={(e) => {
                        setTitle(e.target.value)}} />
                </label>
                <label>Description:
                    <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                </section>
                <MediaSearch modalReturn={modalReturn} images={images} handleImages={setModalReturn} editImages={editImages} />
                <section>
                {formatPresets()}
                </section>
                <button name="submit" onClick={handleSubmit}>{buttonText}</button>
            </form>
        </div>
    )
}