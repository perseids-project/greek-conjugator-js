import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Parser from '../../lib/Parser';

const dictionaryPropType = PropTypes.shape({
  dictionary: PropTypes.object.isRequired,
  exact: PropTypes.object.isRequired,
  greek: PropTypes.object.isRequired,
  latin: PropTypes.object.isRequired,
});

const historyPropType = PropTypes.shape({
  push: PropTypes.func.isRequired,
});

const matchPropType = PropTypes.shape({
  params: PropTypes.shape({
    word: PropTypes.string,
  }).isRequired,
});

const renderBundle = ({
  headword,
  root,
  notes,
  tense,
  mood,
  number,
  person,
  voice,
  form,
  gender,
}) => (
  <table>
    <tbody>
      <tr>
        <th>Headword</th>
        <td>{headword}</td>
      </tr>
      <tr>
        <th>Root</th>
        <td>{root}</td>
      </tr>
      <tr>
        <th>Notes</th>
        <td>{notes}</td>
      </tr>
      <tr>
        <th>Tense</th>
        <td>{tense}</td>
      </tr>
      <tr>
        <th>Mood</th>
        <td>{mood}</td>
      </tr>
      <tr>
        <th>Number</th>
        <td>{number}</td>
      </tr>
      <tr>
        <th>Person</th>
        <td>{person}</td>
      </tr>
      <tr>
        <th>Voice</th>
        <td>{voice}</td>
      </tr>
      <tr>
        <th>Form</th>
        <td>{form}</td>
      </tr>
      <tr>
        <th>Gender</th>
        <td>{gender}</td>
      </tr>
    </tbody>
  </table>
);

class Lookup extends Component {
  // static propTypes = {
  //   dictionary: dictionaryPropType.isRequired,
  //   history: historyPropType.isRequired,
  //   match: matchPropType.isRequired,
  // }

  constructor(props) {
    super(props);

    const { dictionary } = this.props;

    this.parser = new Parser(dictionary);
    this.handleChange = this.handleChange.bind(this);
    this.renderEntries = this.renderEntries.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    const { history } = this.props;

    history.push(`/${value}`);
  }

  renderEntries(word) {
    const entries = this.parser.lookup(word);

    return entries.map(({ key, fullWord, bundle }) => (
      <div key={key}>
        <h4>{fullWord}</h4>
        {renderBundle(bundle)}
      </div>
    ));
  }

  render() {
    const { match } = this.props;
    const word = match.params.word || '';

    return (
      <div className="mt-4">
        <input className="form-control mb-4" type="text" value={word} onChange={this.handleChange} placeholder="Enter word..." aria-label="lookup" />
        {this.renderEntries(word)}
      </div>
    );
  }
}

export default Lookup;
