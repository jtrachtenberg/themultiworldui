import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Title from './Title.js'
import CreateUserForm from './CreateUserForm.js'
import UpdateUserForm from './UpdateUserForm.js'

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

formData.append('userName', passUser.userName.toString())
formData.append('email',passUser.email.toString())

fetch("http://localhost:7555/addUser", {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(passUser)
})
.then(response => response.json())
.then(response => {
  console.log(response[0])
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
      </header>
      <CreateUserForm inUser={this.state.user} nameHandler={this.passName}/>
      <UpdateUserForm inUser={this.state.user} nameHandler={this.passName}/>
    </div>
  );
}
}

export default App;
