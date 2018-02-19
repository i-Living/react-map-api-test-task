import React from 'react'
import ReactDOM from 'react-dom'
import App from '../App'
import { mount, shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('<App />', () =>{
  it('renders 1 App component', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).toHaveLength(1)
  })

  test('App can add new routes', () => {
    const wrapper = shallow(<App />)
    wrapper.find('button').simulate('click', 'test')
    expect(wrapper.state().routes.length).toEqual(1)
  })
})
