import React from 'react';
import { render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

test('renders learn react link', () => {
  const div = document.createElement('div');
  render(<App />, div);
  unmountComponentAtNode(div);
});
