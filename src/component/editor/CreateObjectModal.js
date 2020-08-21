import React from 'react';
import {ReactComponent as AddIcon} from '../create.svg';

export const CreateObjectModal = ({setFormHeader, title, setTitle, description, setDescription, formatActionsSelect, formatActions, commands, editCommands, currentAction, setCurrentAction, actions, commandId, incrementId}) => {

    return (
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
        <section>
            <div>{setFormHeader("Actions")}</div>
            <div>
                <label>Add Action <AddIcon onClick = {() => {
                        const newAction = actions[currentAction]
                        newAction.id=commandId
                        incrementId(commandId+1)
                        let commandsCopy = []
                        if (Array.isArray(commands) && commands.length > 0)
                            commandsCopy = [...commands]
                        commandsCopy.push(actions[currentAction])
                        editCommands(commandsCopy)
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
        </section>
        </form>
    )
}