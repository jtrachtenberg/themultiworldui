const look = (inObj, inCmd) => {
    inObj = inObj || null
    inCmd = inCmd || null

    if (inObj === null)
        return "You see nothing."

    if (typeof(inObj['placeId']) !== 'undefined') {
        const exits = inObj.exits
        if (inCmd === null || inCmd.length === 1)
            return inObj.description

        //Check for valid look targets in the place
        const target = inCmd[1]
        for (const [key, value] of Object.entries(exits)) {
            if (key === target) return value.title
        }
    }
    return inObj.title
}

export default look