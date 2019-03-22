const findClosest = (inOrder, string, min = 0, max = inOrder.length - 1) => {
  const middle = Math.round((min + max) / 2);
  const value = inOrder[middle];

  if (min >= max) {
    return max;
  } if (max === min + 1) {
    if (string > inOrder[min]) {
      return max;
    }
    return min;
  } if (string < value) {
    return findClosest(inOrder, string, min, middle);
  }
  return findClosest(inOrder, string, middle, max);
};

class Parser {
  constructor(dictionary) {
    this.matchers = [dictionary.exact, dictionary.greek, dictionary.latin];
    this.inOrder = dictionary.inOrder;
    this.dictionary = dictionary.dictionary;
  }

  lookup(string) {
    const key = string.toLowerCase().normalize();
    const results = [];
    const headwords = {};
    const { dictionary } = this;

    this.matchers.forEach((matcher) => {
      if (matcher[key]) {
        matcher[key].forEach((headword) => {
          if (!headwords[headword]) {
            headwords[headword] = true;

            results.push({ headword, definition: dictionary[headword] });
          }
        });
      }
    });

    return results;
  }

  wordsAt(string, count = 26) {
    const key = string.toLowerCase().normalize();
    const { inOrder } = this;
    const closest = findClosest(inOrder, key);
    const entries = [];

    for (let ii = closest; ii < Math.min(closest + count, inOrder.length); ii += 1) {
      entries.push({ index: ii, entry: inOrder[ii] });
    }

    return {
      entries,
      previous: inOrder[Math.max(0, closest - 1)],
      next: inOrder[Math.min(inOrder.length - 1, closest + 1)],
    };
  }
}

export default Parser;
