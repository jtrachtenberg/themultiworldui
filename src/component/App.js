import React from 'react';
import socketIOClient from "socket.io-client";
import './App.css';
import Title from './Title.js'
import * as userForms from './user/userForms'
import Alert from './Alert.js'
import {EditorHook} from './EditorHook.js'
import Main from './main'
import Cli from './Cli'
import Exits from './Exits'
import {Population} from './Population'
import {Inventory} from './Inventory'
import {User} from './utils/defaultObjects'
import {Space,Place} from './utils/defaultObjects'
import * as Constants from './constants'
import {userStateData} from './utils/defaultObjects'
import {Modal} from './utils/Modal'
import Portal from './utils/Portal'
import {fetchData} from './utils/fetchData'
//import {audioContext} from './utils/audioContext'

class App extends React.Component {

constructor(props) {
    super(props)
    //check if user exists in local storage, else use default state

    this.state = {
      user: {}, 
      alertMessage: "", 
      alertVis: false, 
      alertSuccess: true, 
      alertId: 1, 
      space: Space, 
      place: Place,
      inMsg: "",
      inSnd: {},
      showModalLogin: false,
      modalReturn: {},
      menuToggle: "",
      isEdit: false,
      isAdmin: false,
      inCmd: {},
      popUpdate: false,
      socket: socketIOClient(`${Constants.HOST_URL}:${Constants.EXPRESS_PORT}`)
    }
}

componentDidMount() {
  var user = JSON.parse(localStorage.getItem('user'))
  let needLogin = false

  if (user === null || typeof(user) === "undefined" || user.userId === 0) {
    user = Object.assign(User)
    needLogin = true

  }
  this.setState({user: user, showModalLogin: needLogin},() => {
    if (this.state.user.userId === 0) return
    if (typeof(this.state.user.stateData) === 'object' && this.state.user.stateData.currentRoom !== this.state.place.placeId) {
      const authData = {placeId: Number(this.state.user.stateData.currentRoom)}
      this.state.socket.emit('incoming data',{type: 'auth',userId: this.state.user.userId, auth: authData})
    }
    //Very simply connect to the socket
    const socket = this.state.socket
    //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
    socket.on("outgoing data", data => this.processResponse(data))
    socket.on(`place:${this.state.place.placeId}`, data => this.processResponse(data))
    socket.on(`auth:${this.state.user.userId}`, data => this.processResponse(data))
    if (needLogin) this.setState({showModalLogin: true})
  })

}

menuToggle = () => {
  let newState = "menuOut"

  if (this.state.menuToggle === "menuOut") newState="menuIn"
  this.setState({ menuToggle: newState})
}

processResponse = (data) => {

  if (data.type && data.type === 'auth') {
    let msg = ""
    if (!Array.isArray(data.isAuth)) return
    const isAuth = data.isAuth[0]
    const perms = {}
    if (isAuth.isAuth) {
      if (isAuth.placeId)
        this.loadPlace(isAuth.placeId)
      if (isAuth.isEdit) {
        perms.isEdit=true
      } else {
        perms.isEdit=false
      }
      if (isAuth.isAdmin) {
        perms.isAdmin=true
      } else {
        perms.isAdmin=false
      }
      this.setState({...perms})
    } else {//Tried to go in a locked room

      const user = this.state.user
      delete user.stateData.newRoom
      this.updateUserHandler(user)

      if (this.state.user.stateData.currentRoom === isAuth.placeId) {
        msg = `${data.isAuth[0].title} is locked.  Please [travel] to a new location.`
        this.loadPlace(Constants.DEFAULT_PLACE)
      } else msg = `${data.isAuth[0].title} is locked.`
      
    }
    this.setState({
      inMsg: msg
    })
    
  }
  else if (data.place) {
    if (data.place.placeId === this.state.place.placeId)
      this.setState({
        place: data.place
      })
  } else if (data.msg) {
    const msg = data.msg.msg
    const name = data.msg.userName
    const cmd = data.msg.cmd
    const stateData = {}
    if (cmd) {
        const audio = new Audio(cmd.src)
        audio.addEventListener("canplaythrough", event => {
          /* the audio is now playable; play it if permissions allow */
          audio.play();
        });
        stateData.inSnd = cmd
    }
    let prepend
    if (data.msg.enter || data.msg.exit) stateData.popUpdate = true
    if (name !== "")
      prepend = data.msg.enter ? `${name}` : data.msg.exit ? `${name}` : data.msg.emote ? `${name}` : `${name} says:`
    else
      prepend = ""
    stateData.inMsg=`${prepend} ${msg}`
    this.setState({
      ...stateData
    })
  }
}



hideModal = () => {
  //TODO = set correct false
  this.setState({showModalLogin: false})
}

noOp = () => {

}
loadPlace = (inPlaceId) => {

  inPlaceId = inPlaceId||(this.state.user.userId > 0 ? this.state.user.stateData.currentRoom : Constants.DEFAULT_PLACE)
  //const currentRoom = (this.state.user.userId > 0 ? this.state.user.stateData.currentRoom : Constants.DEFAULT_PLACE)
  const tmpPlace = {placeId: inPlaceId}
  
  fetchData('loadPlace',tmpPlace).then(response => {
      if (response.error) throw(response.error)
      this.childHookUpdateHandler(response[0],'place')
  }).catch(e => {
    console.log('error')
    console.log(e)
      console.log(e)
        this.state.socket.off(`auth:${this.state.user.userId}`)
        const blankUser = Object.assign(User)
        blankUser.userId=0
        blankUser.description=""
        blankUser.email=""
        blankUser.stateData={}
        blankUser.userName=""
        this.loginHandler(blankUser)   
  })
}

messageResetHander = () => {
  this.setState({inMsg: ""})
}

audioResetHandler = () => {
  this.setState({inSnd: {}})
}

childHookUpdateHandler  = (inObj, type) => {
  if (typeof inObj === 'undefined') return
  let stateData = {}
  let message
  if (inObj.create) message = `${inObj.title} created.`
  else message = typeof(inObj.failed) === 'undefined' ? null : inObj.failed ? `Update to ${inObj.title} failed.` : `${inObj.title} updated`
  delete inObj.failed

  if (Object.keys(inObj).length === 0 && inObj.constructor === Object) return
  if (type === 'place') {

    const images = Array.isArray(inObj.images) ? inObj.images : []
    
    inObj.images = images
    inObj.updated = true

    const user = this.state.user
    if (inObj.placeId) {
      if (inObj.create) {
        user.stateData.newRoom = inObj.placeId
        delete inObj.created
        user.stateData.currentSpace = inObj.spaceId
        this.updateUserHandler(user)
      } else {
        user.stateData.currentRoom = inObj.placeId
        user.stateData.currentSpace = inObj.spaceId
        delete user.stateData.newRoom
        this.updateUserHandler(user)
      }
      
    }

    this.state.socket.off(`place:${this.state.place.placeId}`)
    this.state.socket.on(`place:${inObj.placeId}`, data => this.processResponse(data))
    this.state.socket.emit('incoming data', {msg: `left.`, exit:true, msgPlaceId: this.state.place.placeId, userName: this.state.user.userName})
    this.state.socket.emit('incoming data', {msg: `arrived.`, enter:true, msgPlaceId: inObj.placeId, userName: this.state.user.userName})
  }
  stateData[type] = inObj
  if (message) {
    stateData.alertMessage=message
    stateData.alertVis=true
    stateData.alertSuccess=true
    stateData.alertId=Math.random().toString()
  }

    this.setState({
    ...stateData
    }, message === null ? () => inObj.update ? this.state.socket.emit('incoming data', inObj) : {} : () => this.state.socket.emit('incoming data', inObj))
}

loginHandler = (user) => {
  let message = user.userId > 0 ? `User ${user.userName} Logged in` : `Login failed`
  let success = user.userId > 0 ? true: false

  this.setState({
    user: user,
    alertMessage: message,
    alertVis: true,
    alertSuccess: success,
    alertId: Math.random().toString(),
    showModalLogin: !success
  },() => {
    localStorage.setItem('user', JSON.stringify(this.state.user));
    this.state.socket.on("outgoing data", data => this.processResponse(data))
    this.state.socket.on(`auth:${this.state.user.userId}`, data => this.processResponse(data))

    const authData = {placeId: Number(this.state.user.stateData.currentRoom)}
    this.state.socket.emit('incoming data',{type: 'auth',userId: this.state.user.userId, auth: authData})

  })
}

updateUserHandler = (user) => {

  var update = {}
  const stateData = {alertId: Math.random().toString()}

  if (user.auth) {
    update.auth = user.auth
    delete user.auth
  }

  if (user.create) {
    stateData.message = `User ${user.userName} Created`
    stateData.success = true
    stateData.alertVis = true
  } else if (typeof(user.failed) === 'undefined') {
    stateData.message = ""
    stateData.success = true
    stateData.alertVis = false
    stateData.user = user
  } else {
    if (!user.failed) stateData.user=user
    stateData.message = user.failed ? `Update failed` : `User ${user.userName} Updated`
    stateData.success = user.failed ? false : true
    stateData.alertVis = true
    if (typeof(user.failed) !== 'undefined') delete user.failed
  }

  if (user.stateData.newRoom) {
    const authData = {placeId: Number(user.stateData.newRoom)}
    this.state.socket.emit('incoming data',{type: 'auth',userId: user.userId, auth: authData})
  }

  if (stateData.success)
  this.setState({
    ...stateData
  },() => {
    localStorage.setItem('user', JSON.stringify(this.state.user));
    update.stateData=this.state.user.stateData
    update.userId=this.state.user.userId
    let timer = setTimeout(() => {console.log('ggg');this.state.socket.emit('incoming data', update);clearTimeout(timer);},1000)
  })
  else
  this.setState({
    ...stateData
  })
}

addUserHandler = (user,doLogin) => {
  doLogin = doLogin||false
  if (!user.token) {
    user.token = this.state.user.token
    user.userId = this.state.user.userId
  }
  fetchData('addUser',user).then(response => {
    user.userId = response[0]
    const message = `User ${user.userName} Created`
    if (user.description === null) user.description = ''
    if (typeof(user.password) !== 'undefined') delete user.password 
    if (user.stateData === null || typeof(user.stateData) === 'undefined') {
      const stateData = userStateData
      user.stateData = stateData
    }
    const stateData = {
      alertMessage: message,
      alertVis: true,
      alertSuccess: true,
      alertId: Math.random().toString()
    }
    if (doLogin) {
      localStorage.setItem('user', JSON.stringify(user));
      stateData.user = user
    }

    this.setState({
      ...stateData
    })
  })
  .catch(err => {
    console.log(err);
    const stateData = {
      alertMessage: "Login Failed",
      alertVis: true,
      alertSuccess: false,
      alertId: Math.random().toString()
    }
    if (doLogin) {
      const passUser = Object.assign(User)
      localStorage.setItem('user', JSON.stringify(passUser));
      stateData.user = passUser
    }

    this.setState({
      ...stateData
    })
  }); 
}

formatCmd = () => {
  const cmd = this.state.inCmd
  if (Object.keys(cmd).length === 0 && cmd.constructor === Object) return <span></span>

  this.setState({inCmd: {}}, () => {
    if (cmd.type === 'audio') {
      //const src = cmd.src
     // audioContext(src)
      return <span></span>
    }
  })
}
togglePopUpdate = () => {
  this.setState({
    popUpdate: !this.state.popUpdate
  })
}
render() {
  return (
    <div className="App">
        <div className="alertArea"><Alert message={this.state.alertMessage} isVis={this.state.alertVis} success={this.state.alertSuccess} alertId={this.state.alertId}/></div>
      <div className="Header">
      <Title inUser={this.state.user} />
      </div>
      <div className="flex-grid">
      <div className={`leftNav edgeCol ${this.state.menuToggle}`}>
        <ul>
        <li><userForms.LoginUserForm socket={this.state.socket} inUser={this.state.user} loginHandler={this.loginHandler} menuToggle={this.menuToggle} /></li>
        <li><userForms.CreateUserForm isAdmin={this.state.isAdmin} inUser={this.state.user} updateUserHandler={this.updateUserHandler}/></li>
        <li><userForms.UpdateUserForm isAdmin={this.state.isAdmin} inUser={this.state.user} updateUserHandler={this.updateUserHandler}/></li>
        <li><EditorHook isAdmin={this.state.isAdmin} isEdit={this.state.isEdit} inUser={this.state.user} inSpace={this.state.space} inPlace={this.state.place} updateHandler={this.childHookUpdateHandler}/></li>
        </ul>
      </div>
      <div className="main midCol">
        <div className={`viewPort ${this.state.menuToggle}`}><Main inUser={this.state.user} inSpace={this.state.space} inPlace={this.state.place} childUpdateHandler={this.childHookUpdateHandler} /></div>
        <div className={`CliInput ${this.state.menuToggle}`}><Cli audioResetHandler={this.audioResetHandler} messageResetHander={this.messageResetHander} inMsg={this.state.inMsg} inSnd={this.state.inSnd} inUser={this.state.user} inPlace={this.state.place} updateUserHandler={this.updateUserHandler} childUpdateHandler={this.childHookUpdateHandler} socket={this.state.socket}/></div>
      </div>
      <div className="rightNav edgeCol">
        <div className="exits"><Exits updateUserHandler={this.updateUserHandler} inUser={this.state.user} inPlace={this.state.place}/></div>
        <div className="population"><Population forceUpdate={this.state.popUpdate} toggleUpdate={this.togglePopUpdate} userId={this.state.user.userId} placeId={this.state.place.placeId} /></div>
        <div className="inventory"><Inventory inUser={this.state.user} /></div>
      </div>
      </div>
      <div id="portal-root"></div>
      {( this.state.showModalLogin && 
                    <Portal id="imageModal">
                        <Modal handleClose={this.hideModal} show={this.state.showModalLogin}
                        >
                        <userForms.LoginUserForm inUser={this.state.user} loginHandler={this.loginHandler} close={this.hideModal}/>
                        </Modal>
                    </Portal>
                )}
    </div>
  );
}
}

export default App;
