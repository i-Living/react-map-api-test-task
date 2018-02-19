import React from 'react'
import ReactDOM from 'react-dom'
import CustomMap from '../components/CustomMap'
import { YMaps } from 'react-yandex-maps'
import { mount, shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

const routes = [
  { id: `1`, content: `test content 1` },
  { id: `2`, content: `test content 2` }
]

describe('<CustomMap />', () =>{
  it('renders 1 CustomMap component', () => {
    const wrapper = shallow(<CustomMap />)
    expect(wrapper).toHaveLength(1)
  })

  // TODO: Find out solution to use yandex map object in wrapper to test all methods
  it('can add placemark', () => {
    // const wrapper = mount(<CustomMap payload={routes}/>)
    // wrapper.instance().addPlacemark(routes)
    // experct(wrapper.state().placemarks.length).toEqual(1)
  })
  it('can add polyline')
  it('can delete placemark')
  it('can sort placemarks')

  it('can update map')
  it('can update placemarks')
  it('can update polyline')
  it('can update indexes')
})
