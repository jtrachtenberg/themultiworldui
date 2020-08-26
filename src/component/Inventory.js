import React from 'react';
import {setFormHeader} from './utils/formUtils'

export const Inventory = ({inUser}) => {

    const formatInventory = () => {
        if (!inUser || inUser.userId < 1 || typeof(inUser.stateData) === 'undefined') return <div></div>
        const inventory = Array.isArray(inUser.stateData.inventory) ? inUser.stateData.inventory : []

        if (inventory.length === 0) return <div>You have nothing.</div>

        return inventory.map((item,i) => <li key={i}>{item.title}</li>)
    }

    return (
            <div>
            <div>{setFormHeader("Inventory")}</div>
            <div><ul>{formatInventory()}</ul></div>
            </div>
    )
}