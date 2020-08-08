import React from './react'
import {setFormHeader, toggleIsVis, handleInputChange} from '../utils/formUtils'

class unsplash extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            vis: false,
            search: "", 
            page: 1,
            perpage: 10,
            results: []
        }
    }

    componentDidMount() {

    }

    formatResults = () => {

    }
    loadResults = () => {
        const postUrl = "http://localhost:3001/unsplash/loadPlaces"
        const postData = { keyword: this.state.search, page: this.state.page, perpage: this.state.perpage}
        //const place = this.props.inPlace
        fetch(postUrl, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
        }).then(response => response.json())
        .then (response => {
          //remove current place
          /*response = response.filter(function( obj ) {
            return obj.placeId !== place.placeId;
          });*/  
          this.setState({
            places: response
          })
        })
      }

    handleChange = (e) => {
        this.setState(handleInputChange(e))
    }

    handleHeaderClick = (e) => {
        this.setState(toggleIsVis(this.state))
    }

    render() {
        return (
            <div>
                <div>{setFormHeader("Choose an Image",this.handleHeaderClick)}</div>
                <div>{this.formatResults()}</div>
                <div><input name="search" id="search" value={this.state.search} onChange={this.handleChange} /></div>
            </div>
        )
    }
}

export default unsplash