import React from 'react';
import {setFormHeader,updateHandler} from './utils/formUtils'
import {ReactComponent as DropIcon} from './dropobject.svg';
export const Inventory = ({inUser, updateUserHandler, inPlace, childUpdateHandler}) => {

    const formatInventory = () => {
        if (!inUser || inUser.userId < 1 || typeof(inUser.stateData) === 'undefined') return <div></div>
        const inventory = Array.isArray(inUser.stateData.inventory) ? inUser.stateData.inventory : []

        if (inventory.length === 0) return <div>You have nothing.</div>
        return inventory.map((item,i) => <li key={item.objectId}>{(Array.isArray(item.images) && item.images.length > 0 && typeof item.images[0].src !== 'undefined' && item.images[0].src !== null) ? <span className="imageContainer"><img alt={item.images[0].alt} src={item.images[0].src} /></span> : <span className="imageContainer"><img alt="object" src="https://img.icons8.com/color/48/000000/picture.png"/></span>}<span id={item.objectId} className="dropObject" onClick={dropObjectClick}><DropIcon className="hoverMe"/></span><span className="imageContainer">{item.title}</span></li>)
    }

    const dropObjectClick = (e) => {
        const objectId = e.currentTarget.id
        const place = inPlace
        const objects = place.objects
        const inventory = Array.isArray(inUser.stateData.inventory) ? inUser.stateData.inventory : []
        const object = inventory.find(obj => Number(obj.objectId) === Number(objectId))
        objects.push(object)
        const newInventory = inventory.filter(obj => Number(obj.objectId) !== Number(objectId))
        place.objects = objects
        const user = inUser
        user.stateData.inventory = newInventory
        updateHandler('place',place,childUpdateHandler, true)
        updateUserHandler(user)
      }

    return (
            <div>
            <div>{setFormHeader("Inventory")}</div>
            <div><ul>{formatInventory()}</ul></div>
            </div>
    )
}