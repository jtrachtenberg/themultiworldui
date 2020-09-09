import React, {useState,useEffect} from 'react'
import { setFormHeader, createHandler } from '../utils/formUtils';
import {ReactComponent as AddIcon} from '../create.svg'
import {MediaSearch} from '../utils/MediaSearch'
import * as Actions from './objectActions'
import * as Presets from './presetObjects'
import * as Elements from './objectElements'



export const NPCEditor = ({ userId, objectHandler}) => {

    const [modalReturn, setModalReturn] = useState({})
    const [actionStack, setActionStack] = useState([])

    return (
        <div>
            
        </div>
    )
}