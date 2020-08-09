import React from 'react';
import './App.css';
import Title from './Title.js'
import * as userForms from './user/userForms'
import Alert from './Alert.js'
import Editor from './Editor.js'
import Main from './main'
import Cli from './Cli'
import Exits from './Exits'
import {User} from './utils/defaultObjects'
import {Space,Place} from './utils/defaultObjects'
import {Modal} from './utils/Modal'
import Unsplash from './editor/Unsplash'
import * as Constants from './constants'

class App extends React.Component {

constructor(props) {
    super(props)
    //check if user exists in local storage, else use default state
    var user = JSON.parse(localStorage.getItem('user'))
    if (user === null || typeof(user) === "undefined" ) user = User
    this.state = {
      user: user, 
      alertMessage: "", 
      alertVis: false, 
      alertSuccess: true, 
      alertId: 1, 
      space: Space, 
      place: Place,
      showModal: false,
      modalType: null,
      modalReturn: null
    }
}

showModal = () => {
  this.setState({ showModal: true });
};

hideModal = (e) => {
  e = e||{}
  this.setState({ showModal: false, modalReturn: e });
};

formatModal = () => {
  if (this.state.modalType === 'Unsplash') {
    return <Unsplash modalClose={this.hideModal} />
  }
}
childUpdateHandler = (inObj, type, message) => {
  message = message||null
  console.log(inObj)
  if (message)
  this.setState({
    [type]: inObj,
    alertMessage: message,
    alertVis: true,
    alertSuccess: true,
    alertId: Math.random().toString()
  })
  else
  this.setState({
    [type]: inObj
  })
}

loginHandler = (user) => {
  let message = user.userId > 0 ? `User ${user.userName} Logged in` : `Login failed`
  let success = user.userId > 0 ? true: false
  this.setState({
    user: user,
    alertMessage: message,
    alertVis: true,
    alertSuccess: success,
    alertId: Math.random().toString()
  },() => {
    localStorage.setItem('user', JSON.stringify(this.state.user));
  })
}

updateUserHandler = (user) => {
  var message
  var success
  var alertVis
  if (typeof(user.failed) === 'undefined') {
    message = ""
    success = true
    alertVis = false
  } else {
    message = user.failed ? `Update failed` : `User ${user.userName} Updated`
    success = user.failed ? false : true
    if (typeof(user.failed) !== 'undefined') delete user.failed
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
  })
  else
  this.setState({
    alertMessage: message,
    alertVis: true,
    alertSuccess: success,
    alertId: Math.random().toString()
  })
}

addUserHandler = (user) => {
  let postUrl = `${Constants.HOST_URL}:${Constants.HOST_URL_PORT}/addUser`
  fetch(postUrl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
  })
  .then(response => response.json())
  .then(response => {
    const message = `User ${user.userName} Created`
    if (user.description === null) user.description = ''
    if (typeof(user.password) !== 'undefined') delete user.password 
    if (user.stateData === null || typeof(user.stateData) === 'undefined') {
      const stateData = {
        currentRoom: 0,
        currentSpace: 0
      }
      user.stateData = stateData
    }
    localStorage.setItem('user', JSON.stringify(user));
    this.setState({
      user: user,
      alertMessage: message,
      alertVis: true,
      alertSuccess: true,
      alertId: Math.random().toString()
    })
  })
  .catch(err => {
    console.log(err);
    const passUser = {userName:'',email:'',userId:0,description:'',isRoot:0}
    localStorage.setItem('user', JSON.stringify(passUser));
    this.setState({
      user: passUser,
      alertMessage: "Login Failed",
      alertVis: true,
      alertSuccess: false,
      alertId: Math.random().toString()
    })
  }); 
}

render() {
  return (
    <div className="App">
        <Modal handleClose={this.hideModal} show={this.state.showModal} >
          {this.formatModal()}
        </Modal>
        <div className="alertArea"><Alert message={this.state.alertMessage} isVis={this.state.alertVis} success={this.state.alertSuccess} alertId={this.state.alertId}/></div>
      <div className="Header">
      <Title inUser={this.state.user} />
      </div>
      <div className="flex-grid">
      <div className="leftNav edgeCol">
        <ul>
        <li><userForms.LoginUserForm inUser={this.state.user} loginHandler={this.loginHandler}/></li>
        <li><userForms.CreateUserForm inUser={this.state.user} nameHandler={this.addUserHandler}/></li>
        <li><userForms.UpdateUserForm inUser={this.state.user} updateUserHandler={this.updateUserHandler}/></li>
        <li><Editor inUser={this.state.user} userHandler={this.updateUserHandler} childUpdateHandler={this.childUpdateHandler} inSpace={this.state.space} inPlace={this.state.place} modalReturn={this.state.modalReturn} modalClose={this.modalClose} /></li>
        </ul>
      </div>
      <div className="main midCol">
        <div className="viewPort" ><Main inUser={this.state.user} inSpace={this.state.space} inPlace={this.state.place} childUpdateHandler={this.childUpdateHandler} /></div>
        <div className="CliInput"><Cli inUser={this.state.user} inPlace={this.state.place} updateUserHandler={this.updateUserHandler} /></div>
      </div>
      <div className="rightNav edgeCol">
        <div className="exits"><Exits inPlace={this.state.place}/></div>
      </div>
      </div>
    </div>
  );
}
}

export default App;
