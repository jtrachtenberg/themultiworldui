import React, { useState } from 'react'
import {fetchMediaData} from '../utils/fetchData'
import {setFormHeader} from '../utils/formUtils'
import {ReactComponent as LeftIcon} from '../circledarrowleft.svg';
import {ReactComponent as RightIcon} from '../circledarrowright.svg';
import ReactPlayer from 'react-player'

export const Freesound = ({modalClose}) => {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [results, setResults] = useState({})
    // eslint-disable-next-line
    const [playResults, setPlayResults] = useState({})
    // eslint-disable-next-line
    const [count, setCount] = useState(1)
    const [leftDisabled, setLeftDisabled] = useState(true)
    const [rightDisabled, setRightDisabled] = useState(false)
    
    const handleAudioClick = (e, name, description, externalid, externalurl, src, username) => {
        const retObj = {
            name: name,
            description: description,
            src: src,
            externalId: externalid,
            externalUrl: externalurl,
            userName: username
        }
 
        modalClose(retObj)

    }
    const formatResults = () => {
        if (Array.isArray(results)) {
            //id,name,description,previews,url,username
        return results.map((value,i) => <li className="searchAudio" key={value.id}><ReactPlayer width="340px" height="50px" controls={true} url={value.previews['preview-lq-mp3']} /><span onClick={(e) => handleAudioClick(e, value.name, value.description, value.id, value.url, value.previews['preview-hq-mp3'], value.username)}>{value.name}</span><span className="attribution"> by <a rel="noopener noreferrer" target="_blank" href={value.url}>{value.username}</a></span></li>)
        }
    }

    // eslint-disable-next-line
    const getPlayData = (id) => {
        const postUrl = `freesound/play`
        const postData = {id: id}
        fetchMediaData(postUrl, postData)
        .then (response => {
          setPlayResults(response)
        })
    }

    const loadResults = (inPage) => {
        inPage = inPage||page
        const postUrl = `freesound/search`
        const postData = { keyword: search, page: inPage }
        //const place = this.props.inPlace
        fetchMediaData(postUrl, postData)
        .then (response => {
            setResults(response.results)
            setCount(response.count)
            if (response.next === null) setRightDisabled(true)
            else setRightDisabled(false)

            if (response.previous === null) setLeftDisabled(true)
            else setLeftDisabled(false)
        })
      }

    const leftClickHandler = (e) => {
        e.preventDefault()
        setPage(page-1)
        loadResults(page-1)
    }

    const rightClickHandler = (e) => {
        e.preventDefault()
        setPage(page+1)
        loadResults(page+1)
    }

    const clickHandler = (e) => {
      e.preventDefault()
        loadResults()
    }
    return (
        <div>
            <div>{setFormHeader("SearchAudio")}</div>
            <div className="audioList">
                {(Array.isArray(results) && (results.length > 0)) &&
                <span className="iconLeft"><button disabled={leftDisabled} onClick={leftClickHandler}><LeftIcon /></button></span>
                }<ul className="audioList">
                    {formatResults()}
                </ul>
                {(Array.isArray(results) && (results.length > 0)) &&
                <span className="iconRight"><button disabled={rightDisabled} onClick={rightClickHandler}><RightIcon /></button></span>
                }
            </div>
            <form id="freesound">
            <div><input name="search" id="search" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <button name="search" id="search" value="search" onClick={clickHandler}>Search</button>
            </form>
        </div>
    )
}
