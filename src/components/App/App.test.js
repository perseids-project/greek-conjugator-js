import React from 'react';
import { render } from 'react-testing-library';

import App from './App';

it('renders without crashing', () => {
  const div = window.document.createElement('div');
  render(<App />, div);
});

it('renders title', () => {
  const { getByText } = render(<App />);

  expect(getByText('Conjugator')).toBeInTheDocument();
  expect(getByText('Ancient Greek Verb Conjugator')).toBeInTheDocument();

});
