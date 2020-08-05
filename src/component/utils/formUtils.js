import React from 'react';
import {capitalizeFirstLetter} from './stringUtils';
import {downArrowWhite} from './svgDefaults'

export const setFormHeader = (title, handler)  => {
    handler = handler || null
    if (handler === null)
        return <div><h3>{title}</h3></div>
    else
        return <div className="clickable" onClick={handler}><h3>{title}{downArrowWhite}</h3></div>
}

export const loadObject = (inObj, outObj) => {
    return Object.assign(outObj, inObj)
}

export const handleInputChange = (e) => {
    const {checked, name, value, type} = e.target
    const valueToUpdate = type === 'checkbox' ? checked : value
    return {
        [name]: valueToUpdate
    }
}

export const updateHandler = (type, obj, handler) => {
    
    let postUrl = "http://localhost:7555/update"+capitalizeFirstLetter(type)
    
    fetch(postUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(response => {
        obj.failed = false
        handler(obj)
    })
    .catch(err => {
        console.log(err);
        obj.failed = true
        handler(obj)
    }); 
  }

export const createHandler = (type, obj, handler) => {
  // creates entity
  let postUrl = "http://localhost:7555/add"+capitalizeFirstLetter(type)
  
  fetch(postUrl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  })
  .then(response => response.json())
  .then(response => {
    const idName = type+"Id"
    obj[idName] = response[0]
    handler(obj)
  })
  .catch(err => {
    console.log(err);
    obj.failed = true
    handler(obj)
  }); 
}

export const toggleIsVis = state => {
    return {
        vis: !state.vis
    }
}