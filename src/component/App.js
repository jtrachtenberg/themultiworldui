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
import {Inventory} from './Inventory'
import {User} from './utils/defaultObjects'
import {Space,Place} from './utils/defaultObjects'
import * as Constants from './constants'
import {userStateData} from './utils/defaultObjects'
import {Modal} from './utils/Modal'
import Portal from './utils/Portal'
import {fetchData} from './utils/fetchData'

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
      showModal: false,
      modalReturn: {},
      menuToggle: "",
      isEdit: false,
      socket: socketIOClient(`${Constants.HOST_URL}:${Constants.EXPRESS_PORT}`)
    }
}

componentDidMount() {
  console.log("componentDidMount")
  var user = JSON.parse(localStorage.getItem('user'))
  let needLogin = false

  if (user === null || typeof(user) === "undefined" || user.userId === 0) {
    user = User
    needLogin = true

  }
  console.log(user)
  this.setState({user: user},() => {
    console.log()
    if (typeof(this.state.user.stateData) === 'object' && this.state.user.stateData.currentRoom !== this.state.place.placeId) {
      const authData = {placeId: Number(this.state.user.stateData.currentRoom)}
      this.state.socket.emit('incoming data',{type: 'auth',userId: user.userId, auth: authData})
    }
    //Very simply connect to the socket
    const socket = this.state.socket
    //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
    socket.on("outgoing data", data => this.processResponse(data))
    socket.on(`place:${this.state.place.placeId}`, data => this.processResponse(data))
    socket.on(`auth:${this.state.user.userId}`, data => this.processResponse(data))
    if (needLogin) this.setState({showModal: true})
  })

}

componentDidUpdate(prevState) {
  if (prevState.user && prevState.user.userId !== this.state.user.userId) {
    this.state.socket.off(`auth:${prevState.user.userId}`)
    this.state.socket.on(`auth:${this.state.user.userId}`, data => this.processResponse(data))
  }
}

menuToggle = () => {
  let newState = "menuOut"

  if (this.state.menuToggle === "menuOut") newState="menuIn"
  this.setState({ menuToggle: newState})
}

processResponse = (data) => {

  if (data.type && data.type === 'auth') {
    console.log(data)
    let msg = ""
    const isAuth = data.isAuth[0]
    console.log(isAuth)
    if (isAuth.isAuth) {
      if (isAuth.placeId)
        this.loadPlace(isAuth.placeId)
      if (isAuth.isEdit) {
        this.setState({isEdit: true})
      } else {
        this.setState({isEdit: false})
      }
    } else {
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
    let prepend
    if (name !== "")
      prepend = data.msg.enter ? `${name}` : data.msg.exit ? `${name}` : `${name} says:`
    else
      prepend = ""
    this.setState({
      inMsg: `${prepend} ${msg}`
    })
  }
}



hideModal = () => {
  this.setState({showModal: false})
}

noOp = () => {

}
loadPlace = (inPlaceId) => {

  inPlaceId = inPlaceId||(this.state.user.userId > 0 ? this.state.user.stateData.currentRoom : Constants.DEFAULT_PLACE)
  //const currentRoom = (this.state.user.userId > 0 ? this.state.user.stateData.currentRoom : Constants.DEFAULT_PLACE)
  const tmpPlace = {placeId: inPlaceId}
  
  fetchData('loadPlace',tmpPlace).then(response => {
      this.childHookUpdateHandler(response[0],'place')
  })
}

messageResetHander = () => {
  this.setState({inMsg: ""})
}

childHookUpdateHandler  = (inObj, type) => {
  console.log(type)
  console.log(inObj)
  let stateData = {}
  const message = typeof(inObj.failed) === 'undefined' ? null : inObj.failed ? `Update to ${inObj.title} failed.` : `${inObj.title} updated`
  delete inObj.failed

  if (Object.keys(inObj).length === 0 && inObj.constructor === Object) return
  if (type === 'place') {

    const images = Array.isArray(inObj.images) ? inObj.images : []
    
    inObj.images = images
    inObj.updated = true

    const user = this.state.user
    if (inObj.placeId) {
      user.stateData.currentRoom = inObj.placeId
      user.stateData.currentSpace = inObj.spaceId
      delete user.stateData.newRoom
      this.updateUserHandler(user)
    }

    this.state.socket.off(`place:${this.state.place.placeId}`)
    this.state.socket.on(`place:${inObj.placeId}`, data => this.processResponse(data))
    this.state.socket.emit('incoming data', {msg: `left.`, exit:true, msgPlaceId: this.state.place.placeId, userName: this.state.user.userName})
    this.state.socket.emit('incoming data', {msg: `arrived.`, enter:true, msgPlaceId: inObj.placeId, userName: this.state.user.userName})
  }
  stateData[type] = inObj
  console.log(stateData)
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
    showModal: !success
  },() => {
    localStorage.setItem('user', JSON.stringify(this.state.user));
  })
}

updateUserHandler = (user) => {
  console.log('updateUserHandler')
  console.log(user)
  var message
  var success
  var alertVis
  var update = {}

  if (typeof(user.failed) === 'undefined') {
    message = ""
    success = true
    alertVis = false
  } else {
    message = user.failed ? `Update failed` : `User ${user.userName} Updated`
    success = user.failed ? false : true
    if (typeof(user.failed) !== 'undefined') delete user.failed
  }

  if (user.stateData.newRoom) {
    const authData = {placeId: Number(user.stateData.newRoom)}
    console.log(authData)
    this.state.socket.emit('incoming data',{type: 'auth',userId: user.userId, auth: authData})
  }

  if (user.auth) {
    update.auth = user.auth
    delete user.auth
  }

  if (success)
  this.setState({
    user: user,
    alertMessage: message,
    alertVis: alertVis,
    alertSuccess: success,
    alertId: Math.random().toString()
  },() => {
    localStorage.setItem('user', JSON.stringify(this.state.user));
    update.stateData=this.state.user.stateData
    update.userId=this.state.user.userId
    this.state.socket.emit('incoming data', update)
  })
  else
  this.setState({
    alertMessage: message,
    alertVis: true,
    alertSuccess: success,
    alertId: Math.random().toString()
  })
}

addUserHandler = (user,doLogin) => {
  doLogin = doLogin||false
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

render() {
  let doModal = this.state.showModal
  return (
    <div className="App">
        <div className="alertArea"><Alert message={this.state.alertMessage} isVis={this.state.alertVis} success={this.state.alertSuccess} alertId={this.state.alertId}/></div>
      <div className="Header">
      <Title inUser={this.state.user} />
      </div>
      <div className="flex-grid">
      <div className={`leftNav edgeCol ${this.state.menuToggle}`}>
        <ul>
        <li><userForms.LoginUserForm inUser={this.state.user} loginHandler={this.loginHandler} menuToggle={this.menuToggle} /></li>
        <li><userForms.CreateUserForm inUser={this.state.user} updateUserHandler={this.updateUserHandler}/></li>
        <li><userForms.UpdateUserForm inUser={this.state.user} updateUserHandler={this.updateUserHandler}/></li>
        <li><EditorHook isEdit={this.state.isEdit} inUser={this.state.user} inSpace={this.state.space} inPlace={this.state.place} updateHandler={this.childHookUpdateHandler}/></li>
        </ul>
      </div>
      <div className="main midCol">
        <div className={`viewPort ${this.state.menuToggle}`}><Main inUser={this.state.user} inSpace={this.state.space} inPlace={this.state.place} childUpdateHandler={this.childHookUpdateHandler} /></div>
        <div className={`CliInput ${this.state.menuToggle}`}><Cli messageResetHander={this.messageResetHander} inMsg={this.state.inMsg} inUser={this.state.user} inPlace={this.state.place} updateUserHandler={this.updateUserHandler} childUpdateHandler={this.childHookUpdateHandler} socket={this.state.socket}/></div>
      </div>
      <div className="rightNav edgeCol">
        <div className="exits"><Exits updateUserHandler={this.updateUserHandler} inUser={this.state.user} inPlace={this.state.place}/></div>
        <div className="inventory"><Inventory inUser={this.state.user} /></div>
      </div>
      </div>

      <div id="portal-root"></div>
      {( doModal && 
                    <Portal id="imageModal">
                        <Modal handleClose={this.hideModal} show={this.state.showModal}
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
