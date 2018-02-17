import React, { Component } from 'react'
import './App.css'
import _ from 'lodash'

import CustomMap from './components/CustomMap'
import RoutesContainer from './components/RoutesContainer'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      routes: []
    }
    this.handleRouteChange = this.handleRouteChange.bind(this)
  }

  /**
   * Handle route change event by clicking enter. Push route to array
   * @param  {[object]} event Input event
 */
  handleRouteChange(event) {
   if (event.key === 'Enter') {
     let text = this.textInput.value
     let routes = this.state.routes
     routes.push({
       id: `${_.uniqueId()}`, content: `${text}`
     })
     this.setState({'routes': routes})
    }
  }

  /**
   * Handle RoutesContainer change
   * @param  {[object]} newRoutes Array of routes
   */
  handleRoutesChange(newRoutes) {
    this.setState({routes: newRoutes})
  }

  /**
   * React render method
   * @return {[React.Component]} App
   */
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
                <input type="text" className="form-control" ref={(input) => { this.textInput = input }} onKeyPress={this.handleRouteChange}/>
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
