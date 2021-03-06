import React, { Component } from 'react';
import {
  array,
  func,
  object,
  shape,
  string,
} from 'prop-types';
import queryString from 'query-string';

import styles from './Lookup.module.css';

import Parser from '../../lib/Parser';

const dictionaryPropType = shape({
  diacriticLookup: object.isRequired,
  headwords: array.isRequired,
  lookup: object.isRequired,
  notes: array.isRequired,
  macronLookup: object.isRequired,
  roots: array.isRequired,
});

const historyPropType = shape({
  push: func.isRequired,
});

const matchPropType = shape({
  params: shape({
    word: string,
  }).isRequired,
});

const locationPropType = shape({
  search: string.isRequired,
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
          {headword}
          {' '}
          (
          <a href={`https://en.wiktionary.org/wiki/${headword}`} rel="noopener noreferrer" target="_blank">link</a>
          )
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

renderBundle.propTypes = {
  headword: string.isRequired,
  root: string.isRequired,
  notes: string.isRequired,
  tense: string.isRequired,
  mood: string.isRequired,
  number: string.isRequired,
  person: string.isRequired,
  voice: string.isRequired,
  form: string.isRequired,
  gender: string.isRequired,
};

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

  setIgnoreAccents(ignoreAccents) {
    const { history, location: { pathname } } = this.props;

    history.push({
      pathname,
      search: queryString.stringify({ ignoreAccents }),
    });
  }

  ignoreAccents() {
    const { location } = this.props;

    const { ignoreAccents } = queryString.parse(location.search);

    return ignoreAccents !== 'false';
  }

  handleIgnoreAccents(event) {
    const { target: { checked } } = event;

    this.setIgnoreAccents(checked);
  }

  handleChange(event) {
    const { value } = event.target;
    const { history, location: { search } } = this.props;

    history.push({
      pathname: `/${value}`,
      search,
    });
  }

  renderEntries(word) {
    const ignoreAccents = this.ignoreAccents();
    const entries = this.parser.lookup(word, !ignoreAccents);

    return entries.map(({ key, fullWord, bundle }) => (
      <div className="mb-5" key={key}>
        <h3 className="h4">{fullWord}</h3>
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
            <label htmlFor="ignore-accent" className="form-check-label">
              <input type="checkbox" id="ignore-accent" className="form-check-input" checked={ignoreAccents} onChange={this.handleIgnoreAccents} name="ignoreAccents" />
              Ignore accents
            </label>
          </div>
        </div>
        {this.renderEntries(word)}
      </div>
    );
  }
}

Lookup.propTypes = {
  dictionary: dictionaryPropType.isRequired,
  history: historyPropType.isRequired,
  match: matchPropType.isRequired,
  location: locationPropType.isRequired,
};

export default Lookup;
