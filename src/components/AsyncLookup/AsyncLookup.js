import React from 'react';
import Loadable from 'react-loadable';
import localForage from 'localforage';

import Loading from './Loading';
import Lookup from './Lookup';
import Browse from './Browse';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const DICTIONARY_VERSION = 'woodhouse-0.0.1';

const Router = ({ basename, dictionary }) => (
  <BrowserRouter basename={basename}>
    <Switch>
      <Route exact path="/" render={(props) => <Lookup {...props} dictionary={dictionary} />} />
      <Route exact path="/l/:word?" render={(props) => <Lookup {...props} dictionary={dictionary} />} />
      <Route exact path="/b/:word?" render={(props) => <Browse {...props} dictionary={dictionary} />} />
      <Route exact path="/:word?" render={(props) => <Lookup {...props} dictionary={dictionary} />} />
    </Switch>
  </BrowserRouter>
);

const cacheDictionary = (loaded) => {
  const dictionary = loaded.default;

  localForage.clear().then(() => localForage.setItem(DICTIONARY_VERSION, dictionary));

  return dictionary;
};

const lookupDictionary = () => (
  localForage.getItem(DICTIONARY_VERSION).then(d => (
    { success: !!d, dictionary: d }
  )).catch(() => (
    { success: false }
  ))
);

const WaitForDownload = Loadable({
  loader: () => import('../../lib/Dictionary').then(cacheDictionary),
  loading: () => <Loading text="Downloading dictionary..." />,
  render(dictionary, props) {
    return <Router {...props} dictionary={dictionary} />;
  },
});

const AsyncRouter = Loadable({
  loader: lookupDictionary,
  loading: () => <Loading text="Loading dictionary from cache..." />,
  render(loaded, props) {
    if (loaded.success) {
      return <Router {...props} dictionary={loaded.dictionary} />;
    }

    return <WaitForDownload {...props} />;
  },
});

export default AsyncRouter;

