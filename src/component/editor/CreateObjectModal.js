import React, {useState,useEffect} from 'react'
import {ReactComponent as AddIcon} from '../create.svg'
import {ImageSearch} from '../utils/ImageSearch'
import * as Elements from './objectElements'

export const CreateObjectModal = ({userId, createPreset, presets, inObject, setImageModal, setFormHeader, title, setTitle, description, setDescription, formatActionsSelect, formatActions, actionStack, editActionStack, currentAction, setCurrentAction, currentActionNumber, actions, commandId, incrementId, handleSubmit, buttonText, images, editImages, spaces}) => {
    const [inElements, editInElements] = useState([])
    const [elementList, editElementList] = useState([])
    const [showElements, editShowElements] = useState([])
    const [modalReturn, setModalReturn] = useState({})
    const [tab, setTab] = useState(0)

    useEffect(() => {
        setImageModal(modalReturn)
    },[modalReturn, setImageModal])

    useEffect(() => {
        if (typeof(inObject) === 'undefined') return
        const initVars = () => {
            editImages(inObject.images)
        }
        if (Array.isArray(inObject.images)) initVars()
    },[inObject, editImages])

    useEffect(() => {
        let elements = []
        let showElements = []
        for (const [key, value] of Object.entries(Elements)) {
            elements.push({name: key, value: value})
            showElements.push(false)
        }
        editInElements(elements)
        editShowElements(showElements)
    },[actions])

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
            const NewElement = element.value
            let symbol
            if (elementList.length > 0)
                symbol = elementList[i].elementSymbol
            return <span key={i}><button onClick={(e) => {
                e.preventDefault()
                if (currentActionNumber < 0) return
                //const elementListCopy = [...elementList]
                const symbol = Object.assign(elementList[i])
                const newStack = [...actionStack]
                const actionItem = newStack[currentActionNumber]
                const commandResult = (typeof(actionItem.commandResult) !== 'undefined') ? actionItem.commandResult : ""

                actionItem.commandResult = commandResult.concat(symbol.elementSymbol.toString())

                const tmpElementList = Array.isArray(actionItem.elementList) ? [...actionItem.elementList] : []
                tmpElementList[i]=symbol
                actionItem.elementList=tmpElementList
                //tmpAction.elementList=elementList
                newStack[currentActionNumber] = actionItem

                const editShow = [...showElements]
                editShow[i] = true
                editShowElements(editShow)
                editActionStack(newStack)

            }}>{symbol}</button><NewElement show={showElements[i]} currentActionNumber={currentActionNumber} actionStack={actionStack} editActionStack={editActionStack} elementList={elementList} editElementList={editElementList} handleElementChange={handleElementChange} elementNumber={i}/>
            </span>
        })
    }
    const formatPresets = () => {
        if (Array.isArray(presets) && presets.length === 0)
            return <div></div>
        
        return presets.map((preset,i) => {
            console.log(preset)
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
                        <ImageSearch modalReturn={modalReturn} images={images} handleImages={setModalReturn} editImages={editImages} />
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
        <label>Title
            <input name="title" id="title" value={title} onChange={(e) => {
                setTitle(e.target.value)}} />
        </label>
        <label>Description:
            <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        </section>
        <ImageSearch modalReturn={modalReturn} images={images} handleImages={setModalReturn} editImages={editImages} />
        <section>
            <div>{setFormHeader("Actions")}</div>
            <div>
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
            {formatActions()}
            <label>Available Elements</label>
            {formatElements()}
        </section>
        <button name="submit" onClick={handleSubmit}>{buttonText}</button>
        </form>
        </div>}
        </div>
    )
}