import React from 'react'
import ReactDOM from 'react-dom'
import RoutesContainer from '../components/RoutesContainer'
import { mount, shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

const routes = [
  { id: `1`, content: `test content 1` },
  { id: `2`, content: `test content 2` }
]

describe('<RoutesContainer />', () =>{
  it('renders 1 RoutesContainer component', () => {
    const component = shallow(<RoutesContainer />)
    expect(component).toHaveLength(1)
  })

  test('RoutesContainer can add new routes', () => {
    const container = shallow(<RoutesContainer payload={routes} />)
    expect(container.state().items.length).toEqual(2)
  })

  test('RoutesContainer can delete routes', () => {
    const container = mount(<RoutesContainer onChange={function(){return}} payload={routes} />)
    container.find('button').at(0).simulate('click')
    expect(container.state().items.length).toEqual(1)
  })
})
