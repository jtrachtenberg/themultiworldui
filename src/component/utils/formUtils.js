import React from 'react';

export const setFormHeader = (title)  => {
    return <div><h3>{title}</h3></div>
}

export const loadObject = (inObj, outObj) => {
    return Object.assign(outObj, inObj)
}