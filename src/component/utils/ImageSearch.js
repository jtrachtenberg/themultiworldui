import React,{useState} from 'react';
import {ReactComponent as ImageSearchIcon} from '../imagesearch.svg';
import {ReactComponent as DeleteIcon} from '../delete.svg';
import {Modal} from '../utils/Modal'
import Portal from '../utils/Portal'
import Unsplash from '../editor/Unsplash'

export const ImageSearch = ({ images, handleImages, editImages, modalReturn }) => {
    const [showModal, toggleShowModal] = useState(false)
  
    const hideModal = (e) => {
        e = e||{}
        toggleShowModal(false)
        handleImages(e)
    };

    const formatImages = () => {
        if (Array.isArray(images) && images.length > 0)
        return images.map((value,i) => <span key={i} className="imageContainer"><img loading="lazy" alt={value.alt} src={value.src} width="75"/><span className="iconInset"><DeleteIcon onClick={(e) => editImages(() => {
            const imagesCopy = [...images]
            imagesCopy.splice(i,1)
            editImages(imagesCopy)
            })} /></span></span>)
        else return <div>No Images</div>
    }

    return (
        <div>
        <section>
            <div className="display-block">
            {formatImages()}
            </div>
            <span>Add Image <ImageSearchIcon onClick={() => toggleShowModal(true)}/></span>
            {modalReturn && <div><img alt={modalReturn.alt} src={modalReturn.src} width="75"/></div>}
        </section>
        {showModal && (
            <Portal id="imageModal">
                <Modal handleClose={hideModal} show={showModal}
                >
                <Unsplash modalClose={hideModal} />
                
                </Modal>
            </Portal>      
        )}  
        </div>
    );
  };