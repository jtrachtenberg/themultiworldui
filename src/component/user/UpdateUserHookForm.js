import React, {useState, useEffect} from 'react';
import {setFormHeader, updateHandler} from '../utils/formUtils'
import {MediaSearch} from '../utils/MediaSearch'

export const UpdateUserHookForm = ({ inUser, isAdmin, updateUserHandler }) => {
    const [images, editImages] = useState([])
    const [vis, toggleVis] = useState(false)
    const [modalReturn, setModalReturn] = useState({})
    const [userName, setUserName] = useState(inUser.userName||"")
    const [email, setEmail] = useState(inUser.email||"")
    const [description, setDescription] = useState(inUser.description||"")
    const [isRoot, setIsRoot] = useState(inUser.isRoot||false)

    useEffect(() => {
        if (Object.keys(modalReturn).length === 0 && modalReturn.constructor === Object) return
        const tmpImages = images
        tmpImages.push(modalReturn)
        editImages(tmpImages)
      // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[modalReturn])

    useEffect(() => {
        setUserName(inUser.userName)
        setEmail(inUser.email)
        setDescription(inUser.description)
        setIsRoot(isAdmin)
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[inUser])

    const handleSubmit = (e) => {
        var subUser = inUser
        subUser.userName = userName
        subUser.email = email
        subUser.description = description
        subUser.isRoot = isRoot
        subUser.images = images
        updateHandler("user", subUser, updateUserHandler)
        e.preventDefault();
        setModalReturn({})
    }

    return (
            <div>
            <div>{setFormHeader("Edit User", toggleVis)}</div>
            {vis && inUser.userId && 
            <form onSubmit={handleSubmit}>
            <label>User Name:
                <input name="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
            </label>
            <label>email
                <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>Description:
                <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>              
            <MediaSearch modalReturn={modalReturn} images={images} handleImages={setModalReturn} editImages={editImages} />
                { isAdmin && 
                <div>    
                    <label>Is Root?:
                    <input
                        name="isRoot"
                        type="checkbox"
                        checked={isRoot}
                        onChange={(e) => setIsRoot(e.target.checked)} />
                    </label>
                </div>   
                }
   
            <input type="submit" value="Submit" />
            </form>}
            </div> 
    )
}
