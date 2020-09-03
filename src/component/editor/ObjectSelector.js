import React, {useState, useEffect} from 'react';

export const ObjectSelector = ({ userId, updateTrigger, updateParent }) => {
    const [userObjects, editUserObjects] = useState([])
    const [currentObjectId, setCurrentObjectId] = useState(0)

    useEffect(() => {
        async function doFetch() {
            const postData = {userId: userId}

            return await fetchData('loadUserObjects', postData)
        }
        
        doFetch()
        .then(response => {
            editUserObjects(response)
            setCurrentObjectId(response[0].objectId)
        })
    },[userId, updateTrigger])

    const formatObjects = () => {
        if (Array.isArray(userObjects))
        return userObjects.map((value,i) => <option key={i} value={value.objectId}>{value.title}</option>)
    }

    return (
        <div>
        <section>
            <div className="display-block">
            <select name="objectId" value={currentObjectId} onChange={(e) => {
                setCurrentObjectId(e.target.value)
                updateParent(e.target.value)
                }}>
                     <option value="-1" disabled>Select an object</option>
                     {formatObjects()}
            </select>
            </div>
        </section>
        </div>
    );
  };