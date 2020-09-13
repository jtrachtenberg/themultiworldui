import React from 'react'
import {setFormHeader, toggleIsVis, handleInputChange} from '../utils/formUtils'
import * as Constants from '../constants'
import {ReactComponent as LeftIcon} from '../circledarrowleft.svg';
import {ReactComponent as RightIcon} from '../circledarrowright.svg';

class Unsplash extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: "", 
            prevSearch: "",
            page: 1,
            perpage: 5,
            results: {},
            totalpages: 1,
            leftDisabled: true,
            rightDisabled: false
        }
    }

    componentDidMount() {
    }

    formatPlaces = () => {
        if (this.state.places)
        return this.state.places.map((value,i) => Number(value.placeId) === Number(this.props.inPlace.placeId) ? "" : <option key={i} value={value.placeId}>{value.title}</option>)
    }
    handleImageClick = (e) => {
        const target = e.target
        this.triggerEndpoint(target.id)
        const retObj = {
            src: e.target.src,
            id: e.target.id,
            apilink: e.target.alt,
            alt: e.target.title
        }
        this.props.modalClose(retObj)

    }
    formatResults = () => {
        const results = this.state.results.results||null
        if (Array.isArray(results)) {
        return results.map((value,i) => <div className="searchImage" key={value.id}><img id={value.id} alt={value.links.download_location} title={value.alt_description} src={value.urls.thumb} onClick={this.handleImageClick} /><span className="attribution">Photo by <a rel="noopener noreferrer" target="_blank" href={value.user.links.html+"?utm_source=themulti.world&utm_medium=referral"}>{value.user.name}</a> on <a rel="noopener noreferrer" target="_blank" href={"https://unsplash.com?utm_source=themulti.world&utm_medium=referral"}>Unsplash</a></span></div>)
        }
    }

    triggerEndpoint = (id) => {
        const postUrl = `${Constants.HOST_URL}:${Constants.UNSPLASH_PORT}/unsplash/endpointtrigger`
        const postData = { id: id}
        fetch(postUrl, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
        }).then(response => response.json())
        .then (response => {
          //console.log(response)
        })
    }
    loadResults = () => {
        const postUrl = `${Constants.HOST_URL}:${Constants.UNSPLASH_PORT}/unsplash/search`
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
       
          this.setState({
            results: response,
            totalpages: response.total_pages,
            prevSearch: this.state.search
          })
        })
      }

    handleChange = (e) => {
      
        this.setState(handleInputChange(e))
    }

    handleHeaderClick = (e) => {
     
        this.setState(toggleIsVis(this.state))
    }

    leftClickHandler = (e) => {
      const page = this.state.page-1
      let disabled = this.state.leftDisabled
      if (page === 1) disabled = true
      else disabled = false
      this.setState({
        page: page,
        leftDisabled: disabled
      },() => this.loadResults())
    }

    rightClickHandler = (e) => {
      const page = this.state.page+1
      let disabled = this.state.rightDisabled
      if (page === this.state.totalpages) disabled = true
      else disabled = false
      this.setState({
        page: page,
        leftDisabled: disabled
      },() => this.loadResults())
    }

    clickHandler = (e) => {
      e.preventDefault()
      if (this.state.search === this.state.prevSearch)
        this.loadResults()
      else {
        this.setState({
          page: 1,
          leftDisabled: true
        }, () => this.loadResults())
      }
    }

    render() {
        return (
            <div>
                <div>{setFormHeader("Choose an Image",this.handleHeaderClick)}</div>
                <div className="imageList">
                  {(Array.isArray(this.state.results.results) && (this.state.results.results.length > 0)) &&
                  <span className="iconLeft"><button disabled={this.state.leftDisabled} onClick={this.leftClickHandler}><LeftIcon /></button></span>
                  }
                  {this.formatResults()}
                  {(Array.isArray(this.state.results.results) && (this.state.results.results.length > 0)) &&
                  <span className="iconRight"><button disabled={this.state.rightDisabled} onClick={this.rightClickHandler}><RightIcon /></button></span>
                  }
                </div>
                <form id="unsplash">
                <div><input name="search" id="search" value={this.state.search} onChange={this.handleChange} /></div>
                <button name="search" id="search" value="search" onClick={this.clickHandler}>Search</button>
                </form>
            </div>
        )
    }
}

export default Unsplash
