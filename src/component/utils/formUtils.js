import React from 'react';
import {capitalizeFirstLetter} from './stringUtils';
import {downArrowWhite} from './svgDefaults'
import {fetchData} from './fetchData'

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

export const handleInputChange = (e,ruleSets) => {

    ruleSets = ruleSets||null
    const {checked, name, value, type} = e.target
    let valueToUpdate = type === 'checkbox' ? checked : value
    const ruleReturns = {}
    if (ruleSets) {
      ruleSets.forEach(ruleSet => {
        if (ruleSet.type === 'transform') {//alias
          if (typeof(ruleSet.pos) === 'number' && (Number(valueToUpdate.length) === Number(ruleSet.pos)+1)) {
            valueToUpdate=valueToUpdate.replace(ruleSet.search,ruleSet.replace)
          } else if (typeof(ruleSet.pos) !== 'number') {
            valueToUpdate=valueToUpdate.replace(ruleSet.search,ruleSet.replace)
          }
        } else if (ruleSet.type === 'validate') {//validate
          const currentVal = ruleSet.invert ? !ruleReturns[ruleSet.state]||true : ruleReturns[ruleSet.state]||true
          const ruleVal = ruleSet.invert ? !(ruleSet.regexp.test(valueToUpdate)&&currentVal) : (ruleSet.regexp.test(valueToUpdate)&&currentVal)
          ruleReturns[ruleSet.state]=ruleVal
        }
      })
    }

    return {
        [name]: valueToUpdate,
        ...ruleReturns
    }
}

export const updateHandler = (type, obj, handler) => {
    
    let postUrl = `update`+capitalizeFirstLetter(type)
    fetchData(postUrl, obj)
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
  let postUrl = `add`+capitalizeFirstLetter(type)
  console.log(postUrl)
  fetchData(postUrl, obj)
  .then(response => {
    const idName = type+"Id"
    obj[idName] = response[0]
    obj.failed = false
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