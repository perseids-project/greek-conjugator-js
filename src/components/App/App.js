import React from 'react';
import { PerseidsFooter } from 'perseids-react-components';

import 'perseids-react-components/build/css/index.css';

import AsyncRouter from './AsyncRouter';

const App = () => (
  <React.Fragment>
    <AsyncRouter basename={process.env.PUBLIC_URL} />
    <PerseidsFooter
      github="https://github.com/perseids-project/woodhouse-js"
      report="https://github.com/perseids-project/woodhouse-js/issues"
    />
  </React.Fragment>
);

export default App;
