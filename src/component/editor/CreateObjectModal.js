import React, {useState,useEffect} from 'react'
import {ReactComponent as AddIcon} from '../create.svg'
import {MediaSearch} from '../utils/MediaSearch'
import * as Elements from './objectElements'

export const CreateObjectModal = ({ editElementStack, elementStack, userId, createPreset, presets, inObject, setImageModal, setFormHeader, title, setTitle, description, setDescription, formatActionsSelect, formatActions, actionStack, editActionStack, currentAction, setCurrentAction, currentActionNumber, actions, commandId, incrementId, handleSubmit, buttonText, images, editImages, spaces}) => {
    const [inElements, editInElements] = useState([])
    const [elementList, editElementList] = useState([])
    const [modalReturn, setModalReturn] = useState({})
    const [tab, setTab] = useState(0)

    useEffect(() => {
        setImageModal(modalReturn)
    },[modalReturn, setImageModal])

    useEffect(() => {
        const initVars = () => {
            const tmpElementStack = []
            if (inObject.actionStack) {
                const tmpActionStack = JSON.parse(inObject.actionStack)
                tmpActionStack.forEach(value => {
                    const elementList = [...value.elementList]
                    elementList.forEach (elementValue => {
                        const Element = {...inElements.find(element => element.name === elementValue.element)}
                        Element.elementFormat = elementValue.elementFormat
                        tmpElementStack.push(Element)
                    })
                })
            }

            editElementStack(tmpElementStack)
        }
        if (typeof(inObject) === 'undefined') return
        if (Array.isArray(inObject.images)) editImages(inObject.images)
        if (Array.isArray(inElements) && inElements.length > 0) initVars()
    },[inObject, editImages, editElementStack,inElements])

    useEffect(() => {
        
        let elements = []
        for (const [key, value] of Object.entries(Elements)) {
            elements.push({name: key, value: value})
        }
        editInElements(elements)

    },[actions,editElementStack])

    const handleElementChange = (name,value,elementNumber) => {
        const newActionStack = [...actionStack]
        const newCommand = newActionStack[currentActionNumber]

        newCommand.elementList[elementNumber][name] = value
        newActionStack[currentActionNumber]=newCommand
        editActionStack(newActionStack)
    }

    const formatElements = () => {
        return inElements.map((element,i) => {
            //const Name = element.name
            const NewElement = Object.assign(element.value)
            let elsymbol
            if (typeof elementList.find(listel => listel.element === element.name) !== 'undefined')
                elsymbol = elementList.find(listel => listel.element === element.name).elementSymbol
            return <span key={i}><button onClick={(e) => {
                e.preventDefault()  
                if (currentActionNumber < 0) return
                
                const symbol = {...elementList.find(listel => listel.element === element.name)}//Object.assign(elementList[i])
 
                const newStack = Array.from(actionStack)
                const actionItem = newStack[currentActionNumber]

                const commandResult = (typeof(actionItem.commandResult) !== 'undefined') ? actionItem.commandResult : ""

                actionItem.commandResult = commandResult.concat(symbol.elementSymbol.toString())

                const tmpElementList = Array.isArray(actionItem.elementList) ? Array.from(actionItem.elementList) : []
                tmpElementList[i]=symbol
                actionItem.elementList=tmpElementList
                newStack[currentActionNumber] = actionItem

                editActionStack(newStack)

                const tmpElements = Array.isArray(elementStack) ? Array.from(elementStack) : []
                tmpElements[currentActionNumber]=Object.assign(element)
                console.log(tmpElements)
                editElementStack(tmpElements)
            }}>{elsymbol}</button><NewElement show={false} currentActionNumber={currentActionNumber} actionStack={actionStack} editActionStack={editActionStack} elementList={elementList} editElementList={editElementList} handleElementChange={handleElementChange} elementNumber={i}/>
            </span>
        })
    }
    const formatPresets = () => {
        if (Array.isArray(presets) && presets.length === 0)
            return <div></div>
        
        return presets.map((preset,i) => {
            const NewAction = preset.value
            
            return <div key={i}><NewAction editActionStack={editActionStack} userId={userId} spaces={spaces} handleActionChange={createPreset} actionNumber={i} /></div>
        })    
    }
    const formatPresetsSelect = () => {
        if (Array.isArray(presets))
        return presets.map((value,i) => <option key={i} value={i}>{value.command}</option>)
    }

    return (
        <div>
            {
                (typeof(inObject) === 'undefined') && <div>
                    <div className="tabMenu">
                        <span onClick={() => setTab(0)} className={`tab ${tab === 0 ? "selected" : ""}`}>Custom Object</span>
                        <span onClick={() => setTab(1)} className={`tab ${tab === 1 ? "selected" : ""}`}>Object Preset</span>
                        <span onClick={() => setTab(2)} className={`tab ${tab === 2 ? "selected" : ""}`}>NPC Editor</span>
                    </div>
                </div>
            }
            {
                (tab === 1) && <div>
                    <form id="PresetCreatorForm">
                        <section>
                            <label>Select a Preset</label>
                            <select name="addPreset" value={currentAction} onChange={(e) => setCurrentAction(e.nativeEvent.target.value)} >
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
            }
            { (tab === 0) && <div>
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
                        const tmpActions = actions.map(action => ({...action}))
                        let newAction = Object.assign(tmpActions[currentAction])
                        newAction.id=commandId
                        incrementId(commandId+1)
                        let actionStackCopy = []
                        if (Array.isArray(actionStack) && actionStack.length > 0)
                            actionStackCopy = [...actionStack]
                        actionStackCopy.push(newAction)
  
                        editActionStack(actionStackCopy)
                    }
                }/></label>
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
        </div>}
        </div>
    )
}