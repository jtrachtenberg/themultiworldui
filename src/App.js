import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Title from './Title.js'
import CreateUserForm from './CreateUserForm.js'
import UpdateUserForm from './UpdateUserForm.js'
import LoginUserForm from './LoginUserForm.js'

class App extends React.Component {

constructor(props) {
    super(props)
    this.state = {user: {userName:'',email:'',userId:0,desc:'',isRoot:0}}
}  

passName = (passUser) => {
  console.log('passName')
  console.log(passUser)
// creates entity
var formData = new FormData()
let postUrl
if (passUser.userId === -1)
  postUrl = "http://localhost:7555/loginUser"
else if (passUser.userId === 0)
  postUrl = "http://localhost:7555/addUser"
else
  postUrl = "http://localhost:7555/updateUser"

formData.append('userName', passUser.userName.toString())
formData.append('email',passUser.email.toString())

fetch(postUrl, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(passUser)
})
.then(response => response.json())
.then(response => {
  console.log(response[0])
  if (passUser.userId === -1) {
    passUser = response[0]
  }
  else if (passUser.userId === 0)
    passUser.userId = response[0]
  this.setState({user: passUser})
  console.log(passUser)
})
.catch(err => {
  console.log(err);
}); 
}

render() {
  return (
    <div className="App">
      <header className="App-header">
        <Title inUser={this.state.user} />
        <CreateUserForm inUser={this.state.user} nameHandler={this.passName}/>
        <LoginUserForm inUser={this.state.user} nameHandler={this.passName}/>
        <UpdateUserForm inUser={this.state.user} nameHandler={this.passName}/>
      </header>
    </div>
  );
}
}

export default App;
