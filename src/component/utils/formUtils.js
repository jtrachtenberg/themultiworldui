import React from 'react';

export const setFormHeader = (title)  => {
    return <div><h3>{title}</h3></div>
}

export const loadObject = (inObj, outObj) => {
    return Object.assign(outObj, inObj)
}

//TODO: test if this causes issues
export const handleInputChange = (e, inObj) => {
    const {checked, name, value, type} = e.target
    const valueToUpdate = type === 'checkbox' ? checked : value
    inObj.setState({
        [name]: valueToUpdate
    })
}