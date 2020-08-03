import React from 'react';
import './App.css';
import Title from './Title.js'
import * as userForms from './user/userForms'
import Alert from './Alert.js'
import Editor from './Editor.js'
import Main from './main'
import Cli from './Cli'

import {User} from './utils/defaultObjects'

class App extends React.Component {

constructor(props) {
    super(props)

    //check if user exists in local storage, else use default state
    var user = JSON.parse(localStorage.getItem('user'))
    if (user === null || typeof(user) === "undefined" ) user = User
    this.state = {user: user, alertMessage: "", alertVis: false, alertSuccess: true, alertId: 1}
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
  })
}

//TODO: Split our create/update functions into abstracted methods
passName = (passUser) => {
  console.log(passUser)
// creates entity
let postUrl
if (passUser.userId === -1)
  postUrl = "http://localhost:7555/loginUser"
else if (passUser.userId === 0)
  postUrl = "http://localhost:7555/addUser"
else
  postUrl = "http://localhost:7555/updateUser"

if (passUser.userId === 0 && passUser.userName === "") {
  //logout
  if (typeof(passUser.password) !== 'undefined') delete passUser.password 
  localStorage.setItem('user', JSON.stringify(passUser));
  this.setState({
    user: passUser,
    alertMessage: "User Logged Out",
    alertVis: true,
    alertSuccess: false,
    alertId: Math.random().toString()
  })
} else
fetch(postUrl, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(passUser)
})
.then(response => response.json())
.then(response => {
  let message
  if (passUser.userId === -1) {
    passUser = response
    message = `User ${passUser.userName} Logged in`
  }
  else if (passUser.userId === 0) {
    passUser.userId = response[0]
    message = `User ${passUser.userName} Created`
  } else {
    message = `User ${passUser.userName} Updated`
  }
  if (passUser.description === null) passUser.description = ''
  if (typeof(passUser.password) !== 'undefined') delete passUser.password 
  if (passUser.stateData === null) {
    const stateData = {
      currentRoom: 0,
      currentSpace: 0
    }
    passUser.stateData = stateData
  }
  localStorage.setItem('user', JSON.stringify(passUser));
  this.setState({
    user: passUser,
    alertMessage: message,
    alertVis: true,
    alertSuccess: false,
    alertId: Math.random().toString()
  })
})
.catch(err => {
  console.log(err);
  passUser = {userName:'',email:'',userId:0,description:'',isRoot:0}
  localStorage.setItem('user', JSON.stringify(passUser));
  this.setState({
    user: passUser,
    alertMessage: "Login Failed",
    alertVis: true,
    alertSuccess: false,
    alertId: Math.random().toString()
  })
  console.log(passUser)
}); 
}

render() {
  return (
    <div className="App">
        <div className="alertArea"><Alert message={this.state.alertMessage} isVis={this.state.alertVis} success={this.state.alertSuccess} alertId={this.state.alertId}/></div>
      <div className="Header">
      <Title inUser={this.state.user} />
      </div>
      <div className="leftNav">
        <ul>
        <li><userForms.LoginUserForm inUser={this.state.user} nameHandler={this.passName} loginHandler={this.loginHandler}/></li>
        <li><userForms.CreateUserForm inUser={this.state.user} nameHandler={this.passName}/></li>
        <li><userForms.UpdateUserForm inUser={this.state.user} nameHandler={this.passName}/></li>
        <li><Editor inUser={this.state.user} /></li>
        </ul>
      </div>
      <div className="main">
        <div className="viewPort" ><Main inUser={this.state.user} /></div>
        <div className="CliInput"><Cli inUser={this.state.user} /></div>
      </div>
    </div>
  );
}
}

export default App;
