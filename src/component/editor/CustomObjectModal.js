import React, {useState, useEffect} from 'react'
import { setFormHeader, createHandler, updateHandler } from '../utils/formUtils';
import {ReactComponent as AddIcon} from '../create.svg'
import {MediaSearch} from '../utils/MediaSearch'
import * as Actions from './objectActions'
import * as Elements from './objectElements'

export const CustomObjectModal = ({ object, userId, objectHandler, buttonText, hideModal}) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [images, editImages] = useState([])
    const [modalReturn, setModalReturn] = useState({})
    const [actionStack, editActionStack] = useState([])
    const [currentAction, setCurrentAction] = useState(0)
    const [selectedElementRow, setSelectedElementRow] = useState(0)

    useEffect(() => {
        if (typeof object !== 'undefined') {
            setTitle(object.title)
            setDescription(object.description)
            editImages(object.images)
            const inActionStack = object.actionStack
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
    const formatElements = () => {
        return Object.keys(Elements).map((item,i) => {
            return <span key={i}><button value={i} onClick = {(e) => {
                e.preventDefault()
                const currentActionStack = [...actionStack]
                const newAction = currentActionStack[currentAction]
                const currentElementList = newAction.elementList
                currentElementList[selectedElementRow].selectedElement=Object.entries(Elements)[i]
                currentElementList[selectedElementRow].commandResult=`<${item}>`
                currentActionStack[currentAction] = newAction
                editActionStack(currentActionStack)
            }}>{item}</button></span>
        })
    }

    const formatActions = () => {
        if (actionStack.length === 0)
            return <span></span>
        return actionStack.map((command,i) => {
            const NewAction = command.value
            return <div key={i}><NewAction setSelectedElementRow={setSelectedElementRow} userId={userId} actionStack={actionStack} editActionStack={editActionStack} actionStackIndex={i} /></div>
        })
    }

    const formatActionsSelect = () => {
        return Object.keys(Actions).map((item,i) => {
            return <option key={i} value={i}>{item}</option>
        })
    }

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
        setCurrentAction(0)
        editImages([])
        setModalReturn({})
        setSelectedElementRow(0)
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
                <section>
                    <div>{setFormHeader("Actions")}</div>
                    <div className="row">
                        <label>Add Action <AddIcon onClick = {() => {
                                const currentActionStack = [...actionStack]
                                const Action = Object.entries(Actions)[currentAction]
                                const newAction = {key:Action[0],value:Action[1],elementList:[{commandResult:""}],commandAction:""}
                                currentActionStack.push(newAction)
                                editActionStack(currentActionStack)
                            }
                        }/>
                        </label>
                        <select name="addAction" value={currentAction} onChange={(e) => setCurrentAction(e.nativeEvent.target.value)} >
                            <option value="-1" disabled>Select an Action</option>
                            {formatActionsSelect()}
                        </select>
                    </div>
                </section>
                <section>
                    <div className="row">
                        {formatActions()}
                    </div>
                    <div className="row">
                        <label>Available Elements</label>
                            {formatElements()}
                    </div>
                </section>
                <div className="row">
                    <button name="submit" onClick={handleSubmit}>{buttonText}</button>
                </div>
            </form>
        </div>
    )
}