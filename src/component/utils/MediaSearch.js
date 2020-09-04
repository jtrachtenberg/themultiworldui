import React,{useState, useEffect} from 'react';
import {ReactComponent as ImageSearchIcon} from '../imagesearch.svg';
import {ReactComponent as DeleteIcon} from '../delete.svg';
import {Modal} from '../utils/Modal'
import Portal from '../utils/Portal'
import Unsplash from '../editor/Unsplash'
import {Freesound} from '../editor/Freesound'
import ReactPlayer from 'react-player'
import {ReactComponent as AddIcon} from '../soundsearch.svg';

export const MediaSearch = ({ forceOpen, audioOnly, images, handleImages, editImages, audio, handleAudio, editAudio, modalReturn }) => {
    const [showModal, toggleShowModal] = useState(false)
    const [tab, setTab] = useState(0)
  
    const hideModal = (e) => {
        e = e||{}
        toggleShowModal(false)
        const handler = audioOnly ? modalReturn : tab === 0 ? handleImages ? handleImages : handleAudio : handleAudio
        if (typeof handler === 'function') handler(e)
    };

    const formatAudio = () => {
        if (Array.isArray(audio) && audio.length > 0)
        return audio.map((value,i) => <span key={i} className="audioContainer"><ReactPlayer width="200px" height="20px" controls={true} url={value.src} /><span className="iconInset"><DeleteIcon onClick={(e) => editAudio(() => {
            const audioCopy = [...audio]
            audioCopy.splice(i,1)
            editAudio(audioCopy)
            })} /></span></span>)
        else return <div>No Audio</div>
    }

    const formatImages = () => {
        if (Array.isArray(images) && images.length > 0)
        return images.map((value,i) => <span key={i} className="imageContainer"><img loading="lazy" alt={value.alt} src={value.src} width="75"/><span className="iconInset"><DeleteIcon onClick={(e) => editImages(() => {
            const imagesCopy = [...images]
            imagesCopy.splice(i,1)
            editImages(imagesCopy)
            })} /></span></span>)
        else return <div>No Images</div>
    }

    useEffect(() => {
        toggleShowModal(forceOpen)
    },[forceOpen])

    return (
        <div>
        <div>
            {audioOnly && 
            <button><AddIcon onClick={(e) => {
                e.preventDefault()
                toggleShowModal(true)}}/></button>

            } 
    {!audioOnly &&    

        <span>
        <section>
            <div className="display-block">
            {formatImages()}
            </div>
            <div className="display-block">
            {formatAudio()}
            </div>
            <span>Add Media <ImageSearchIcon onClick={() => toggleShowModal(true)}/></span>
            {modalReturn && modalReturn.apilink && <div><img alt={modalReturn.alt} src={modalReturn.src} width="75"/></div>}
            {modalReturn && modalReturn.externalUrl && <div><ReactPlayer width="240px" height="30px" controls={true} url={modalReturn.src} /></div>}
        </section>
        </span>
    }
        {showModal && audioOnly && (
            <Portal id='audioModal'>
                <Modal handleClose={hideModal} show={showModal}>
                    <span>
                        <Freesound modalClose={hideModal} />
                    </span>
                </Modal>
            </Portal>
        )}
        {showModal && !audioOnly && (
            <Portal id={tab === 0 ? 'imageModal' : tab === 1 ? 'audioModal' : 'videoModal'}>
                <Modal handleClose={hideModal} show={showModal}
                >
                <div className="tabMenu">
                <span onClick={() => setTab(0)} className={`tab ${tab === 0 ? "selected" : ""}`}>Image</span>
                <span onClick={() => setTab(1)} className={`tab ${tab === 1 ? "selected" : ""}`}>Audio</span>
                <span onClick={() => setTab(2)} className={`tab ${tab === 2 ? "selected" : ""}`}>Video</span>
                </div>
                { (tab === 0) && 
                <span>
                <Unsplash modalClose={hideModal} />
                </span>
                }
                { (tab === 1) && 
                <span>
                <Freesound modalClose={hideModal} />
                </span>
                }
                { (tab === 2) && 
                <span>
                </span>
                }
                </Modal>
            </Portal>      
        )}  
        </div>
    </div>
    );
  };