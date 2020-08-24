// inObj = props, inCmd = array of input words
// This will take the current place and react to poi and exits

const inventory = async (inObj, inCmd) => {
    inObj = inObj || null
    inCmd = inCmd || null

    let retVal   
    if (inObj === null)
        retVal = await new Promise((resolve, reject) => () => resolve("Nothing here."))

    const inventory = Array.isArray(inObj.inUser.stateData.inventory) ? inObj.inUser.stateData.inventory : []

    if (inventory.length === 0) return await new Promise((resolve, reject) => resolve("You have nothing."))
    const vowelRegex = '^[aieouAIEOU].*'
    let returnStr = "You have "

    if (inventory.length === 1) {
        returnStr += inventory[0].title.split(" ")[0] === "A" ? "" : inventory[0].title.split(" ")[0] === "An" ? "" : inventory[0].title.match(vowelRegex) ? 'an'  : 'a ' 
        returnStr += `${inventory[0].title}`
    }
    else inventory.forEach((object,i) => {
      let tmpString = (i > 0 && inventory.length > 2) ? ", " : ""
      tmpString += (i === inventory.length-1) ? " and " : ""

      tmpString += object.title.split(" ")[0] === "A" ? "" : object.title.split(" ")[0] === "An" ? "" : object.title.match(vowelRegex) ? 'an' : 'a'
      tmpString += ` ${object.title}`
      
      returnStr += tmpString
    })

    retVal = await new Promise((resolve, reject) => resolve(returnStr))
    
    return retVal
}

export default inventory