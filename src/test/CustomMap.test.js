import React from 'react';
import ReactDOM from 'react-dom';
import CustomMap from '../components/CustomMap';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CustomMap />, div);
  ReactDOM.unmountComponentAtNode(div);
});
