import React, { Component } from 'react'
import './App.css'
import _ from 'lodash'

import CustomMap from './components/CustomMap'
import RoutesContainer from './components/RoutesContainer'

let routes = []

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      routes: routes
    }
    this.handleRouteChange = this.handleRouteChange.bind(this)
  }

  handleRouteChange(event) {
   if (event.key === 'Enter') {
     let text = this.textInput.value
     routes.push({
       id: `${_.uniqueId()}`, content: `${text}`
     })
     this.setState({'routes': routes})
    }
  }

  handleRoutesChange(newRoutes) {
    routes = newRoutes
    this.setState({routes: newRoutes})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Yandex map markered route</h1>
        </header>
        <div className="container-fluid">
          <div className="row">
      			<div className="col-md-3 container my-2 fill-routes">
              <div className="input-group-sm">
                <input type="text" className="form-control" ref={(input) => { this.textInput = input; }} onKeyPress={this.handleRouteChange}/>
              </div>
              <RoutesContainer onChange={this.handleRoutesChange.bind(this)} payload={this.state.routes}/>
      			</div>
      			<div className="col-md-9 fill-map">
              <CustomMap payload={this.state.routes}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
