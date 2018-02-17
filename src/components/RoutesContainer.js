import React, {Component} from 'react'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import _ from 'lodash'


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
};

const grid = 4

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 1.5,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging
    ? 'lightgreen'
    : '#a7a7a7',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver
    ? 'lightblue'
    : 'lightgrey',
  padding: grid
});

class RoutesContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: this.props.payload
    }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const items = reorder(this.state.items, result.source.index, result.destination.index)

    this.setState({items})
    this.props.onChange(this.state.items)
  }

  onDeleteItem(id) {
    let items = this.state.items
    _.remove(items, item => item.id === id.id)
    this.setState({items})
    this.props.onChange(this.state.items)
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {
            (provided, snapshot) => (<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {
                this.state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {
                      (provided, snapshot) => (<div>
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>{index + 1}</div>
                            <div className="route-item"><p>{item.content}</p></div>
                            <button type="button" className="btn btn-sm" onClick={this.onDeleteItem.bind(this, item)}>
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        {provided.placeholder}
                      </div>)
                    }
                  </Draggable>))
              }
              {provided.placeholder}
            </div>)
          }
        </Droppable>
    </DragDropContext>)
  }
}

export default RoutesContainer;
