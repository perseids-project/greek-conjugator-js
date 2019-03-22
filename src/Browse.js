import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Octicon, { ArrowUp, ArrowDown } from '@githubprimer/octicons-react';

import Parser from './lib/Parser';

import './Browse.css';

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

const ucfirst = word => word.charAt(0).toUpperCase() + word.slice(1);

const renderEntries = (entries) => {
  const first = entries.slice(0, Math.floor(entries.length / 2));
  const second = entries.slice(Math.floor(entries.length / 2), entries.length);

  return (
    <div className="row">
      <div className="col-xs-12 col-sm-6">
        {first.map(({ index, entry }) => {
          const background = `background-${index % 2}`;

          return <p className={`text-center entry-paragraph ${background}`} key={entry}><Link to={`/l/${entry}`}>{ucfirst(entry)}</Link></p>;
        })}
      </div>
      <div className="col-6 d-none d-sm-block">
        {second.map(({ index, entry }) => {
          const background = `background-${index % 2}`;

          return <p className={`text-center entry-paragraph ${background}`} key={entry}><Link to={`/l/${entry}`}>{ucfirst(entry)}</Link></p>;
        })}
      </div>
    </div>
  );
};

const renderAlphabet = (divisions, key) => {
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const rows = [];
  const size = Math.ceil(alphabet.length / divisions);
  for (let ii = 0; ii < divisions; ii += 1) {
    const row = [];
    for (let jj = 0; jj < size; jj += 1) {
      const letter = alphabet[ii * size + jj];

      if (letter) {
        row.push(letter);
      } else {
        row.push('');
      }
    }
    rows.push({ ii, row });
  }

  return (
    <div className="alphabet-container">
      {rows.map(({ ii, row }) => (
        <div className="alphabet-btn-group btn-group pb-1" role="group" aria-label="alphabet" key={`${key}-row-${ii}`}>
          {row.map(letter => (
            <Link to={`/b/${letter}`} className="btn btn-secondary alphabet-letter" key={`${key}-${letter}`}>{letter}</Link>
          ))}
        </div>
      ))}
    </div>
  );
};

const renderAlphabetLarge = () => renderAlphabet(1, 'large');

const renderAlphabetMedium = () => renderAlphabet(2, 'medium');

const renderAlphabetSmall = () => renderAlphabet(3, 'small');

class Browse extends Component {
  static propTypes = {
    dictionary: dictionaryPropType.isRequired,
    history: historyPropType.isRequired,
    match: matchPropType.isRequired,
  }

  constructor(props) {
    super(props);

    const { dictionary } = this.props;

    this.parser = new Parser(dictionary);

    this.handleChange = this.handleChange.bind(this);
    this.getWordInfo = this.getWordInfo.bind(this);
  }

  getWordInfo() {
    const { match } = this.props;
    const word = match.params.word || '';
    const { previous, next, entries } = this.parser.wordsAt(word);

    return {
      word,
      previous,
      next,
      entries,
    };
  }

  handleChange(event) {
    const { value } = event.target;
    const { history } = this.props;

    history.push(`/b/${value}`);
  }

  render() {
    const {
      word, entries, previous, next,
    } = this.getWordInfo();

    return (
      <div className="mt-4">
        <div className="row mb-2 mt-2">
          <div className="col-8 pr-0">
            <input className="form-control" type="text" value={word} onChange={this.handleChange} placeholder="Enter word..." aria-label="lookup" />
          </div>
          <div className="col-2 pr-1">
            <Link to={`/b/${previous}`} className="btn btn-primary btn-block">
              <Octicon icon={ArrowUp} />
            </Link>
          </div>
          <div className="col-2 pl-1">
            <Link to={`/b/${next}`} className="btn btn-primary btn-block">
              <Octicon icon={ArrowDown} />
            </Link>
          </div>
        </div>
        <div className="mb-1 d-none d-lg-block">
          {renderAlphabetLarge()}
        </div>

        <div className="mb-1 d-none d-sm-block d-lg-none">
          {renderAlphabetMedium()}
        </div>

        <div className="mb-1 d-block d-sm-none">
          {renderAlphabetSmall()}
        </div>
        <div>
          {renderEntries(entries)}
        </div>
      </div>
    );
  }
}

export default Browse;
