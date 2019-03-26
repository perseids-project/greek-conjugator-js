import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string'

import styles from './Lookup.module.css';

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
  <table className={`table table-bordered table-striped ${styles.table}`}>
    <tbody>
      <tr>
        <th width="33%">Headword</th>
        <td>
          {headword} (<a href={`https://en.wiktionary.org/wiki/${headword}`} target="_blank">link</a>)
        </td>
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
  constructor(props) {
    super(props);

    const { dictionary } = this.props;

    this.parser = new Parser(dictionary);
    this.handleChange = this.handleChange.bind(this);
    this.handleIgnoreAccents = this.handleIgnoreAccents.bind(this);
    this.renderEntries = this.renderEntries.bind(this);
    this.ignoreAccents = this.ignoreAccents.bind(this);
    this.setIgnoreAccents = this.setIgnoreAccents.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    const { history, location: { search } } = this.props;

    history.push({
      pathname: `/${value}`,
      search,
    });
  }

  handleIgnoreAccents(event) {
    const { target: { checked } } = event;

    this.setIgnoreAccents(checked);
  }

  ignoreAccents() {
    const { search } = this.props.location;

    const { ignoreAccents } = queryString.parse(search)

    return ignoreAccents !== 'false';
  }

  setIgnoreAccents(ignoreAccents) {
    const { history, location: { pathname } } = this.props;

    history.push({
      pathname,
      search: queryString.stringify({ ignoreAccents }),
    });
  }

  renderEntries(word) {
    const ignoreAccents = this.ignoreAccents();
    const entries = this.parser.lookup(word, !ignoreAccents);

    return entries.map(({ key, fullWord, bundle }) => (
      <div className="mb-5" key={key}>
        <h4>{fullWord}</h4>
        {renderBundle(bundle)}
      </div>
    ));
  }

  render() {
    const { match } = this.props;
    const word = match.params.word || '';
    const ignoreAccents = this.ignoreAccents();

    return (
      <div className="mt-4">
        <div>
          <input className="form-control" type="text" value={word} onChange={this.handleChange} placeholder="Enter verb ..." aria-label="lookup" />
        </div>
        <div className="text-right mb-4">
          <div className="form-check form-check-inline">
            <input type="checkbox" className="form-check-input" checked={ignoreAccents} onChange={this.handleIgnoreAccents} name="ignoreAccents" />
            <label className="form-check-label">Ignore accents</label>
          </div>
        </div>
        {this.renderEntries(word)}
      </div>
    );
  }
}

export default Lookup;
