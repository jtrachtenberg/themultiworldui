import React, {useState} from 'react'

import {S3Uploader} from '../utils/S3Uploader'
import Unsplash from './Unsplash'

export const ImageSelector = ({ userId, imagesHandler, modalClose }) => {
    const [tab, setTab] = useState(0)

    return (
        <div>
            <div className="tabMenu">
                <span onClick={() => setTab(0)} className={`tab ${tab === 0 ? "selected" : ""}`}>Image Search</span>
                <span onClick={() => setTab(1)} className={`tab ${tab === 1 ? "selected" : ""}`}>Image Upload</span>
            </div>
            
        { (tab === 0) && <div><Unsplash modalClose={modalClose} /></div>
        }
        { (tab === 1) && <div><S3Uploader modalClose={modalClose} /></div>
        }
         </div>
    )
}