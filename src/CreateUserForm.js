import React from 'react';

class CreateUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {userName: '',email: ''}
        this.user = props.inUser
    }

    handleChange = (e) => {
        console.log(e.target.type)
        var newValue = e.target.value
        if (e.target.type === 'text') {
            this.setState(state => ({
                userName: newValue
            }))  
        } else {
            this.setState(state => ({
                email: newValue
            }))
        }

    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('handleSubmit')
        this.user.userName = this.state.userName
        this.user.email = this.state.email
        this.props.nameHandler(this.user)
        e.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>User Name:
                    <input type="text" value={this.state.userName} onChange={this.handleChange} />
                </label>
                <label>email
                    <input type="email" value={this.state.email} onChange={this.handleChange} />
                </label>                
                <input type="submit" value="Submit" />
            </form>
        )
    }
}
export default CreateUserForm