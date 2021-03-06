import React, {useState, useRef} from 'react'
import {setFormHeader} from './formUtils'
import {fetchMediaData} from './fetchData'

export const S3Uploader = ({modalClose}) => {
    const [altText, setAltText] = useState("")
    const fileRef = useRef()

    const handleUpload = (e) => {
        e.preventDefault()
        const file = fileRef.current.files[0]
        const fileName = file.name
        const fileType = file.type
        const postData = {fileName: fileName, fileType: fileType}

        fetchMediaData('aws/upload', postData).then(response => {
            const returnData = response.data;
            const signedRequest = returnData.signedRequest;
            const inUrl = returnData.url;

            fetch(signedRequest, {
                headers: {
                    'Content-Type': file.type,
                    'Access-Control-Expose-Headers': 'etag'
                },
                method: 'PUT',
                body: file
              })
              .then((result) => {
                const ETag = result.headers.get('etag')
                const retObj = {
                    src: inUrl,
                    id: ETag.replace(/['"]+/g, ''),
                    apilink: inUrl,
                    alt: altText
                }
                //console.log(retObj)
                //const tmpImages = images||[]
                //tmpImages.push(retObj)
                //if (typeof editImages === 'function') editImages(tmpImages)
                modalClose(retObj)
              })
              .catch((error) => {
                console.error('Error:', error);
              })
          })
        }

    return (
        <form>
            <section>
            {setFormHeader('File Upload')}
            <input ref={fileRef} accept="image/*" name="fileName" type="file" />
            <label>Description</label>
            <input type="text" name="altText" required={true} value={altText} onChange={(e) => setAltText(e.target.value)}></input>
            </section>
            <button onClick={handleUpload}>Upload</button>
        </form>
    )
}