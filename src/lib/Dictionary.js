import diacriticLookup from '../dictionaries/diacritic-lookup.json';
import headwords from '../dictionaries/headwords.json';
import lookup from '../dictionaries/lookup.json';
import notes from '../dictionaries/notes.json';
import macronLookup from '../dictionaries/macron-lookup.json';
import roots from '../dictionaries/roots.json';

const Dictionary = {
  diacriticLookup,
  headwords,
  lookup,
  notes,
  macronLookup,
  roots,
};
window.dictionary=Dictionary;

export default Dictionary;
