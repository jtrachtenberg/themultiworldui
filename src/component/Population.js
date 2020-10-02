import React, {useState, useEffect} from 'react'
import {setFormHeader} from './utils/formUtils'
import {fetchData} from './utils/fetchData'

export const Population = ({placeId, userId, forceUpdate, toggleUpdate}) => {
    const [people, editPeople] = useState([])

    useEffect(() => {
        const getPeople = () => {
            const postData = {placeId: placeId}
            fetchData('getPopulation',postData).then(people => editPeople(people))
        }

        if (forceUpdate) {
            toggleUpdate()
            let timer = setTimeout(() => {
                getPeople()
                clearTimeout(timer);
              },2500)
        }
    },[forceUpdate, toggleUpdate, placeId])

    useEffect(() => {
        const getPeople = () => {
            const postData = {placeId: placeId}
            fetchData('getPopulation',postData).then(people => editPeople(people))
        }

        getPeople()
    },[placeId])

    const formatPeople = () => {
        if (people.length === 0) return <div className="alone">You are alone.</div>
        if (!Array.isArray(people)) return <div></div>
        const allButUser = people.filter(person => person.userId !== userId)
        if (allButUser.length === 0) return <div className="alone">You are alone.</div>
        if (allButUser[0].userName === null && allButUser.length === 1) return <div className="alone">You are alone.</div>

        return allButUser.map((item,i) => <li key={item.userId}>{(typeof item.src !== 'undefined' && item.src !== null) ? <span className="imageContainer"><img alt={item.alt} src={item.src} /></span> : <span className="imageContainer"><img src="https://img.icons8.com/color/100/000000/human-head.png" alt="person" /></span>}<span className="imageContainer">{item.userName}</span></li>)
    }

    return (
            <div>
            <div>{setFormHeader("People nearby")}</div>
            <div><ul>{formatPeople()}</ul></div>
            </div>
    )
}