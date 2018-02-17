import React from 'react';
import { YMaps, Map } from 'react-yandex-maps';
import _ from 'lodash';

const mapState = { center: [55.72, 37.44], zoom: 10 };

class CustomMap extends React.Component {
  /**
   * Create component state
   * @param  {[props]} props props
   */
  constructor(props) {
    super(props)
    this.state = {
      map: {},
      yMap: {},
      polyline: null,
      placemarks: [],
      placemarksCollection: []
    }
  }

  /**
   * Updates the component, depending on the properties received.
   * @param  {[props]} nextProps Array of routes objects
   */
  componentWillReceiveProps(nextProps) {
    if (this.state.placemarks.length === nextProps.payload.length) {
      this.sortPoints(nextProps.payload)
    }
    if (this.state.placemarks.length < nextProps.payload.length) {
     this.addPoint(nextProps.payload)
    }
    if (this.state.placemarks.length > nextProps.payload.length) {
     this.deletePoint(nextProps.payload)
    }
  }

  /**
   * Saves map to state
   * @param {[Map]} map Map object
   */
  setMap(map) {
    this.setState({map: map})
  }

  /**
   * Saves yandex map object to state
   * @param  {[ymaps]} ymaps yandex map object
   */
  onApiAvaliable(ymaps) {
    this.setState({yMap: ymaps})
  }

  /**
   * Add placemark to map
   * @param {[object]} payload Array of routes with id and content
   */
  addPoint(payload) {
    // Gets last added point
    let point = payload[this.props.payload.length - 1]
    // Gets index of adding point
    let index = this.state.placemarks.length + 1
    let placemarks = this.state.placemarks

    /**
     * Creates Placemark GeoObject with custom properties
     * @type {geoObject}
     */
    let placemark = new this.state.yMap.GeoObject({
      "geometry": {
        "type": "Point",
        "coordinates": this.state.map.getCenter()
      },
      "properties": {
        "iconContent": index,
        "balloonContent": point.content,
        "hintContent": point.content
      }
    },
    {
      "draggable": true,
      "preset": "islands#blueIcon"
    })
    // Add uniqueId
    placemark.id = point.id
    placemarks.push(placemark)

    // Update or add polyline if placemarks more then 2
    if (placemarks.length > 1) {
      if (this.state.polyline) {
        this.updatePolyline(placemarks)
      } else {
        this.addPolyline(placemarks)
      }
    }
    this.setState({placemarks: placemarks}, function () {
      // Add placemark in colletion if it exist, create new if not
      if (this.state.placemarksCollection.length > 0) {
        let placemarksCollection = this.state.placemarksCollection
        placemarksCollection.add(placemark)
      } else {
        this.updateMap()
      }
    });
  }

  /**
   * Add polyline to map
   * @param {[geoObjects[]]} placemarks Array of geoObjects
   */
  addPolyline(placemarks) {
    let lineCoordinates = placemarks.map(item => item.geometry._coordinates)
    lineCoordinates.push(this.state.map.getCenter())

    /**
     * Creates Polyline GeoObject with custom properties
     * @type {geoObject}
     */
    let polyline = new this.state.yMap.GeoObject({
      "geometry": {
        "type": "LineString",
        "coordinates": lineCoordinates
      }
    },
    {
      strokeColor: '#000000',
      strokeWidth: 4,
      strokeOpacity: 0.5
    })
    this.setState({polyline: polyline})
  }

  /**
   * Remove existing geoObjects and creates new colletion based on placemarks array
   */
  updateMap() {
    let map = this.state.map
    let placemarksCollection = new this.state.yMap.GeoObjectCollection()
    map.geoObjects.removeAll()
    // Add drag end event on placemarks for handling point coordinates
    placemarksCollection.events.add('dragend', item => this.updatePlacemarks(item.get('target')) );
    this.state.placemarks.forEach(item => placemarksCollection.add(item))
    map.geoObjects.add(placemarksCollection)
    // If polyline exist add it to map
    if (this.state.polyline !== null) {
      map.geoObjects.add(this.state.polyline)
    }
    this.setState({map: map, placemarksCollection: placemarksCollection})
  }

  /**
   * Delete Placemark from map and updates polyline
   * @param  {[object]} payload  Array of routes with id and content
   */
  deletePoint(payload) {
    // New placemarks array without deleted point
    let placemarks = _.intersectionBy(this.state.placemarks, payload, 'id')
    this.updateIndexes(placemarks)
    this.setState({placemarks: placemarks}, function () {
      this.updatePolyline(placemarks)
      this.updateMap()
      // TODO: Update only placemarks not full map. Find out why simple deleting goes wrong.
    });
  }

  /**
   * Sort points by index based on input array
   * @param  {[object]} arr sorted array
   */
  sortPoints(arr) {
    let placemarks = this.state.placemarks
    placemarks.sort((a, b) =>
      arr.findIndex(({ id }) => a.id === id) -
      arr.findIndex(({ id }) => b.id === id)
    )
    this.updateIndexes(placemarks)
    this.setState({placemarks: placemarks}, function () {
      this.updatePolyline(placemarks)
      this.updateMap()
      // TODO: Update only placemarks not map
    });
  }

  /**
   * Update indexes of placemarks colletion
   * @param  {[geoObject[]]} placemarks Colletion of map placemarks
   */
  updateIndexes(placemarks) {
    let index = 1
    _.each(placemarks, item => {
      item.properties._data.iconContent = index
      index++
    })
  }

  /**
   * Update Placemarks coordinates
   * @param  {[geoObject]} geoObject new placemark properties
   */
  updatePlacemarks(geoObject) {
    let placemarks = this.state.placemarks
    placemarks.find(item => item.id === geoObject.id).geometry.setCoordinates(geoObject.geometry.getCoordinates())
    this.setState({placemarks: placemarks})
    this.updatePolyline(placemarks)
  }

  /**
   * Update Polyline coordinates
   * @param  {[geoObjects[]]} placemarks  Colletion of map placemarks
   */
  updatePolyline(placemarks) {
    if (this.state.polyline) {
      let lineCoordinates = placemarks.map(item => item.geometry._coordinates)
      let polyline = this.state.polyline
      polyline.geometry.setCoordinates(lineCoordinates)
      this.setState({polyline: polyline})
    }
  }

  /**
   * React render method
   * @return {[React.Component]} Custom map
   */
  render() {
    return (
      <YMaps onApiAvaliable={(ymaps) => this.onApiAvaliable(ymaps)}>
        <Map state={mapState} width={'100%'} height={'100%'}
          instanceRef={ref => { this.setMap(ref) }}>
        </Map>
      </YMaps>
    )
  }
}
export default CustomMap;
