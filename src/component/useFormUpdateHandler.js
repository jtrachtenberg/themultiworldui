import { useState, useEffect} from 'react'

function useFormUpdateHandler(e) {
    const [formValue, setValue] = useState(null)

    useEffect( () => {
        function handleFormChage(e) {
            const {checked, value, type} = e.target
            const valueToUpdate = type === 'checkbox' ? checked : value
            setValue(valueToUpdate)
        }

        handleFormChage(e)

        return formValue
    })

    return formValue
}
export default useFormUpdateHandler