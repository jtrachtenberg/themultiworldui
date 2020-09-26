import React from 'react';
import {capitalizeFirstLetter} from './stringUtils';
import {downArrowWhite} from './svgDefaults'
import {downArrowBlack} from './svgDefaults'
import {fetchData} from './fetchData'

export const setFormHeader = (title, handler, isBlack)  => {
    isBlack = isBlack||false
    handler = handler || null
    if (handler === null)
        return <div><h3>{title}</h3></div>
    else
        return <div className="clickable" onClick={handler}><h3>{title}{isBlack ? downArrowBlack : downArrowWhite}</h3></div>
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
        if (ruleSet.type === 'trigger') {
          let found = false
          if (ruleSet.searchType === 'exact')
            found = valueToUpdate === ruleSet.search
          else
            found = valueToUpdate.search(ruleSet.search) !== -1
          if (found) {
            ruleReturns[ruleSet.setState]=ruleSet.stateValue
          }

        }
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

export const updateHandler = async (type, obj, handler, isSilent) => {
    isSilent=isSilent||false
    
    let postUrl = `update`+capitalizeFirstLetter(type)
    let retVal = await fetchData(postUrl, obj)
    .then(response => {
        if (!isSilent) obj.failed = false
        else obj.update = true
        if (typeof handler === 'function') handler(obj)
        return new Promise(resolve => resolve(obj))
    })
    .catch(err => {
        console.log('error',err);
        if (!isSilent) obj.failed = true
        else obj.update = true
        if (typeof handler === 'function') handler(obj)
        return new Promise(resolve => resolve(obj))
    }); 

    return retVal
  }

export const createHandler = async (type, obj, handler) => {
  // creates entity
  let postUrl = `add`+capitalizeFirstLetter(type)

  let retVal = await fetchData(postUrl, obj)
  .then(response => {
    const idName = type+"Id"
    obj[idName] = response[0]
    obj.failed = false
    obj.create = true
    if (typeof handler === 'function') handler(obj)

    return new Promise(resolve => resolve(obj))
  })
  .catch(err => {
    console.log(err);
    obj.failed = true
    if (typeof handler === 'function') handler(obj)
  });

  return retVal

}

export const toggleIsVis = state => {
    return {
        vis: !state.vis
    }
}