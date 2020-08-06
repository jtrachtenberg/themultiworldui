const look = (inObj) => {
    inObj = inObj || null

    if (inObj === null)
        return "You see nothing."
    else
        return inObj.description
}

export default look