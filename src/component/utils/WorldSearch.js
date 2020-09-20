import React,{useState, useEffect} from 'react';
import {setFormHeader} from './formUtils'

export const WorldSearch = ({socket, inUser, updateUserHandler}) => {
    const [search, setSearch] = useState("")
    const [vis, toggleIsVis] = useState(false)
    const [results, setResults] = useState(<span></span>)

    const resultRef = React.createRef()
    useEffect(() => {
        const channel = `search:${inUser.userId}`
        socket.on(channel, data => processSearchResponse(data))

        return () => {
            socket.off(channel)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps   
    },[inUser.userId])

    useEffect(() => {
        socket.emit('incoming data', {type: 'search', search: 'world', term: search, userId: inUser.userId })
   // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[search])
    
    const processSearchResponse = (data) => {
        console.log(data)
        const processedResult = data.response.map( (item,i) => <div key={i} className="clickable searchResult" onClick={ (e) => {
            inUser.stateData.newRoom = item.placeId
            toggleIsVis(false)
            updateUserHandler(inUser)
        }}>{item.title}</div>)
        setResults(processedResult)
    }

    return (
        <div>
            {setFormHeader('World Search',() => toggleIsVis(!vis),true)}
            {vis && <div> 
            <form>
                <input type="text" name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </form>
            <div ref={resultRef} id="searchResult" className="searchResult" >{results}</div>
            </div>
            }
        </div>
    )
}
