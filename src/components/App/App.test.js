import React from 'react';
import { render } from '@testing-library/react';

import App from './App';

it('renders without crashing', () => {
  const div = window.document.createElement('div');
  render(<App />, div);
});

it('renders title', () => {
  const { getByText } = render(<App />);

  expect(getByText('Ancient Greek Verb Conjugator (powered by Wiktionary)')).toBeInTheDocument();
});
