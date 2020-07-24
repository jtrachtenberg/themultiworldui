import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Title from './Title.js'
import CreateUserForm from './CreateUserForm.js'
import UpdateUserForm from './UpdateUserForm.js'
import LoginUserForm from './LoginUserForm.js'
import Alert from './Alert.js'
import Spaces from './Spaces.js'

class App extends React.Component {

constructor(props) {
    super(props)
    var user = JSON.parse(localStorage.getItem('user'))
    if (user === null || typeof(user) == "undefined" ) user = {userName:'',email:'',userId:0,description:'',isRoot:0}
    this.state = {user: user, alertMessage: "", alertVis: false, alertSuccess: true}
}  

passName = (passUser) => {
// creates entity
let postUrl
if (passUser.userId === -1)
  postUrl = "http://localhost:7555/loginUser"
else if (passUser.userId === 0)
  postUrl = "http://localhost:7555/addUser"
else
  postUrl = "http://localhost:7555/updateUser"

if (passUser.userId === 0 && passUser.userName === '') {
  //logout
  if (typeof(passUser.password) !== 'undefined') delete passUser.password 
  localStorage.setItem('user', JSON.stringify(passUser));
  this.setState({
    user: passUser,
    alertMessage: "User Logged Out",
    alertVis: true,
    alertSuccess: false
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
  localStorage.setItem('user', JSON.stringify(passUser));
  this.setState({
    user: passUser,
    alertMessage: message,
    alertVis: true,
    alertSuccess: false
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
    alertSuccess: false
  })
  console.log(passUser)
}); 
}

render() {
  return (
    <div className="App">
      <header className="App-header">
        <Alert message={this.state.alertMessage} isVis={this.state.alertVis} success={this.state.alertSuccess} />
        <Title inUser={this.state.user} />
        <CreateUserForm inUser={this.state.user} nameHandler={this.passName}/>
        <LoginUserForm inUser={this.state.user} nameHandler={this.passName}/>
        <UpdateUserForm inUser={this.state.user} nameHandler={this.passName}/>
        <Spaces inUser={this.state.user} />
      </header>
    </div>
  );
}
}

export default App;
