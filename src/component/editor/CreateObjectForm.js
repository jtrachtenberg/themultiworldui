import React, { useState } from 'react';
import { setFormHeader } from '../utils/formUtils';
import {ReactComponent as CreateIcon} from '../createobject.svg';

import {Modal} from '../utils/Modal'
import Portal from '../utils/Portal'
import {CreateObjectModalSelector} from './CreateObjectModalSelector'

/**
 * 
 * @param {[{"command":"Command","id":1,"commandAction":"time"}]} param0 
 */
export const CreateObjectForm = ({userId, objectHandler}) => {
    const [showModal, toggleShowModal] = useState(false)

    const hideModal = () => {
        toggleShowModal(false)
    }

    return(
        <div>
            <div>{setFormHeader("Object Creator")}<span><CreateIcon onClick={() => toggleShowModal(true)}/></span></div>
            {showModal && (
                <Portal id="objectModal">
                    <Modal handleClose={hideModal} show={showModal}>
                        <CreateObjectModalSelector hideModal={hideModal} userId={userId} objectHandler={objectHandler} />
                    </Modal>
                </Portal>       
            )}  
        </div> 
        )
}