import React, { useState } from 'react';
import {ReactComponent as EditIcon} from '../EditObject.svg';

import {Modal} from '../utils/Modal'
import Portal from '../utils/Portal'
import {CreateObjectModalSelector} from './CreateObjectModalSelector'

/**
 * 
 * @param {[{"command":"Command","id":1,"commandAction":"time"}]} param0 
 */
export const UpdateObjectForm = ({userId, object, objectHandler}) => {
    const [showModal, toggleShowModal] = useState(false)

    const hideModal = () => {
        toggleShowModal(false)
    }

    return(
        <span>
            <span><EditIcon onClick={() => toggleShowModal(true)}/></span>
            {showModal && (
                <Portal id="objectModal">
                    <Modal handleClose={hideModal} show={showModal}>
                        <CreateObjectModalSelector object={object} hideModal={hideModal} userId={userId} objectHandler={objectHandler} />
                    </Modal>
                </Portal>       
            )}  
        </span> 
        )
}