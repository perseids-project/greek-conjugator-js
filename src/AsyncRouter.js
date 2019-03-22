import React from 'react';
import Loadable from 'react-loadable';
import localForage from 'localforage';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Loading from './Loading';
import Lookup from './Lookup';
import Browse from './Browse';
import Preface from './Preface';
import Navbar from './Navbar';
import DummyNavbar from './DummyNavbar';

const DICTIONARY_VERSION = 'woodhouse-0.0.2';

const Router = ({ basename, dictionary }) => (
  <BrowserRouter basename={basename}>
    <React.Fragment>
      <Switch>
        <Route path="/(l|b)/:word?" component={Navbar} />
        <Route path="*" component={Navbar} />
      </Switch>
      <div className="container text-center">
        <header>
          <h1 className="h3 pt-4 mb-1 font-weight-normal">
            English-Greek Dictionary
          </h1>
          <h4 className="h5 mb-2 font-weight-normal">
            <em>
              A Vocabulary of the Attic Language
            </em>
          </h4>
          <h5 className="h5 mb-3 font-weight-normal">
            S.C. Woodhouse
          </h5>
        </header>
        <main>
          <div className="mb-4">
            <Switch>
              <Route exact path="/" render={props => <Lookup {...props} dictionary={dictionary} />} />
              <Route exact path="/l/:word?" render={props => <Lookup {...props} dictionary={dictionary} />} />
              <Route exact path="/b/:word?" render={props => <Browse {...props} dictionary={dictionary} />} />
              <Route exact path="/p/preface" component={Preface} />
              <Route exact path="/:word?" render={props => <Lookup {...props} dictionary={dictionary} />} />
            </Switch>
          </div>
        </main>
      </div>
    </React.Fragment>
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
  loader: () => import('./lib/Dictionary').then(cacheDictionary),
  loading: () => (
    <React.Fragment>
      <DummyNavbar />
      <div className="container text-center">
        <header>
          <h1 className="h3 pt-4 mb-1 font-weight-normal">
            English-Greek Dictionary
          </h1>
          <h4 className="h5 mb-2 font-weight-normal">
            <em>
              A Vocabulary of the Attic Language
            </em>
          </h4>
          <h5 className="h5 mb-3 font-weight-normal">
            S.C. Woodhouse
          </h5>
        </header>
        <main>
          <Loading text="Downloading dictionary..." />
        </main>
      </div>
    </React.Fragment>
  ),

  render(dictionary, props) {
    return <Router {...props} dictionary={dictionary} />;
  },
});

const AsyncRouter = Loadable({
  loader: lookupDictionary,
  loading: () => (
    <React.Fragment>
      <DummyNavbar />
      <div className="container text-center">
        <header>
          <h1 className="h3 pt-4 mb-1 font-weight-normal">
            English-Greek Dictionary
          </h1>
          <h4 className="h5 mb-2 font-weight-normal">
            <em>
              A Vocabulary of the Attic Language
            </em>
          </h4>
          <h5 className="h5 mb-3 font-weight-normal">
            S.C. Woodhouse
          </h5>
        </header>
        <main>
          <Loading text="Loading dictionary from cache..." />
        </main>
      </div>
    </React.Fragment>
  ),
  render(loaded, props) {
    if (loaded.success) {
      return <Router {...props} dictionary={loaded.dictionary} />;
    }

    return <WaitForDownload {...props} />;
  },
});

export default AsyncRouter;
