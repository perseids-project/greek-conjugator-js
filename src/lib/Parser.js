const convertTense = {
  p: 'present',
  i: 'imperfect',
  f: 'future',
  a: 'aorist',
  r: 'perfect',
  l: 'pluperfect',
  t: 'future perfect',
};

const convertMood = {
  i: 'indicative',
  s: 'subjunctive',
  o: 'optative',
  m: 'imperative',
};

const convertNumber = {
  s: 'singular',
  d: 'dual',
  p: 'plural',
};

const convertPerson = {
  1: 'first',
  2: 'second',
  3: 'third',
};

const convertVoice = {
  a: 'active',
  m: 'middle',
  p: 'passive',
  e: 'middle/passive',
};

const convertForm = {
  i: 'infinitive',
  p: 'participle',
};

const convertGender = {
  m: 'masculine',
  f: 'feminine',
  n: 'neuter',
};

const stripAccents = word => word.normalize('NFD').split('').filter(ch => /[αβγδεζηθικλμνξοπρσςτυφχψω ]/.test(ch)).join('')
  .normalize('NFC');

class Parser {
  constructor(dictionary) {
    this.dictionary = dictionary;
    // this.matchers = [dictionary.exact, dictionary.greek, dictionary.latin];
    // this.dictionary = dictionary.dictionary;
  }

  parseKey(key) {
    const { headwords, notes, roots } = this.dictionary;

    const [headwordIndex, rootIndex, notesIndex, string] = key.split('~');
    const [tense, mood, number, person, voice, form, gender] = string.split('');

    const bundle = {};

    if (headwordIndex !== '') {
      bundle.headword = headwords[Number(headwordIndex)];
    } else {
      bundle.headword = '-';
    }

    if (rootIndex !== '') {
      bundle.root = roots[Number(rootIndex)];
    } else {
      bundle.root = '-';
    }

    if (notesIndex !== '') {
      bundle.notes = notes[Number(notesIndex)];
    } else {
      bundle.notes = '-';
    }

    bundle.tense = convertTense[tense] || '-';
    bundle.mood = convertMood[mood] || '-';
    bundle.number = convertNumber[number] || '-';
    bundle.person = convertPerson[person] || '-';
    bundle.voice = convertVoice[voice] || '-';
    bundle.form = convertForm[form] || 'finite';
    bundle.gender = convertGender[gender] || '-';

    return bundle;
  }

  lookup(word, accents) {
    const { macronLookup, diacriticLookup, lookup } = this.dictionary;

    let matchingLookups = [];

    if (accents) {
      matchingLookups = macronLookup[word];
    } else {
      matchingLookups = diacriticLookup[stripAccents(word)];
    }

    if (!matchingLookups) {
      return [];
    }

    const matchingStrings = [];

    matchingLookups.forEach((fullWord) => {
      lookup[fullWord].forEach((key) => {
        matchingStrings.push({
          fullWord,
          key,
          bundle: this.parseKey(key),
        });
      });
    });

    return matchingStrings;
  }
}

export default Parser;
