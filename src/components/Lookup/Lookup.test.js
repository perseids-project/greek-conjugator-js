import React from 'react';
import { render } from 'react-testing-library';

import Lookup from './Lookup';

it('renders without crashing', () => {
  const dictionary = {
    diacriticLookup: {},
    headwords: [],
    lookup: {},
    notes: [],
    macronLookup: {},
    roots: [],
  };

  const history = { push() { } };
  const match = { params: { word: 'hello' } };
  const location = { search: 'here' };
  const div = window.document.createElement('div');
  render(
    <Lookup
      dictionary={dictionary}
      history={history}
      match={match}
      location={location}
    />,
    div,
  );
});
