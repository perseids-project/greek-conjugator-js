import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import App from './App';

it('renders without crashing', () => {
  const div = window.document.createElement('div');
  render(<App />, div);
});

it('renders title', () => {
  const { getByText } = render(<App />);

  expect(getByText('English-Greek Dictionary')).toBeInTheDocument();
  expect(getByText('A Vocabulary of the Attic Language')).toBeInTheDocument();
});

it('looks up a word', () => {
  const { getByText, getByPlaceholderText } = render(<App />);
  const lookupNode = getByPlaceholderText('Enter word...');

  expect(window.location.pathname).toEqual('/');

  lookupNode.value = 'plinthos';
  fireEvent.change(lookupNode);

  expect(window.location.pathname).toEqual('/plinthos');
  expect(getByText('πλίνθος, ἡ, brick')).toBeInTheDocument();
});
