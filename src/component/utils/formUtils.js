import React from 'react';
import {capitalizeFirstLetter} from './stringUtils';

export const setFormHeader = (title)  => {
    return <div><h3>{title}</h3></div>
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
    console.log(obj)
    handler(obj)
  })
  .catch(err => {
    console.log(err);
  }); 
}