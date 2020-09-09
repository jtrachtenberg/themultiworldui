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
            getPeople()
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
        if (people.length === 0) return <div>You are alone.</div>
        if (!Array.isArray(people)) return <div></div>
        const allButUser = people.filter(person => person.userId !== userId)
        if (allButUser.length === 0) return <div>You are alone.</div>

        return allButUser.map((item,i) => <li key={item.userId}>{item.userName}</li>)
    }

    return (
            <div>
            <div>{setFormHeader("People nearby")}</div>
            <div><ul>{formatPeople()}</ul></div>
            </div>
    )
}