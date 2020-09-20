import React, {useState, useEffect} from 'react'
import { createHandler, updateHandler } from '../utils/formUtils';
import { AddActionHandler } from './AddActionHandler'
import {MediaSearch} from '../utils/MediaSearch'
import * as Actions from './objectActions'
import * as Elements from './objectElements'

export const CustomObjectModal = ({ object, userId, objectHandler, buttonText, hideModal}) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [images, editImages] = useState([])
    const [modalReturn, setModalReturn] = useState({})
    const [actionStack, editActionStack] = useState([])

    useEffect(() => {
        if (typeof object !== 'undefined') {
            setTitle(object.title)
            setDescription(object.description)
            editImages(object.images)
            const inActionStack = [...object.actionStack]
            inActionStack.forEach( (action,i) => {
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
            })
            editActionStack(object.actionStack)
        }
    },[object])

    const handleSubmit = (e) => {
        e.preventDefault()

        let finalImages = Array.isArray(images) ? [...images] : []
        if (modalReturn !== {}) finalImages.push(modalReturn)

        const submitData = {
            userId: userId,
            title: title,
            description: description,
            isRoot: true,
            actionStack: actionStack,
            images: finalImages
        }
        if (typeof object === 'undefined')
            createHandler("object", submitData, objectHandler)
        else {
            submitData.objectId = object.objectId
            updateHandler("object", submitData, objectHandler)
        }
        editActionStack([])
        setTitle("")
        setDescription("")
        
        editImages([])
        setModalReturn({})
        hideModal()
    }

    return (
        <div>
            <form id="ObjectCreatorForm">
                <section>
                    <div className="row">
                        <label>Title
                            <input name="title" id="title" value={title} onChange={(e) => {
                                setTitle(e.target.value)}} />
                        </label>
                    </div>
                    <div className="row">
                        <div className="doubleColumn">
                            <label>Description:
                                <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </label>
                        </div>          
                        <div className="column">
                            <MediaSearch modalReturn={modalReturn} images={images} handleImages={setModalReturn} editImages={editImages} />
                        </div>
                    </div>
                </section>
                <AddActionHandler userId={userId} actionStack={actionStack} editActionStack={editActionStack} />
                <div className="row">
                    <button name="submit" onClick={handleSubmit}>{buttonText}</button>
                </div>
            </form>
        </div>
    )
}