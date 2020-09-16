import {useState, useEffect} from 'react';


export const KeyHandler = ({ inKey, inKeyHandler }) => {
    // eslint-disable-next-line
    const [keyPressed, setKeyPressed] = useState(false)

    const keyDownHandler = ({key}) => {
        if (key === inKey) {
            setKeyPressed(true)
            if (typeof inKeyHandler === 'function') inKeyHandler(true)
        }
    }

    const keyUpHandler = ({key}) => {
        if (key === inKey) {
            setKeyPressed(false)
            if (typeof inKeyHandler === 'function') inKeyHandler(false)
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler)
        window.addEventListener('keyup', keyUpHandler)
        return () => {
            console.log('there')
            window.removeEventListener('keydown', keyDownHandler)
            window.addEventListener('keyup', keyUpHandler)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps  
    },[])

    return null
}