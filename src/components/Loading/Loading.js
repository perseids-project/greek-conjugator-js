import React from 'react';
import { string } from 'prop-types';

import styles from './Loading.module.css';

const Loading = ({ text }) => (
  <div className="mt-2">
    <div className={`${styles.loadingSpinner} mb-2`} />
    {text}
  </div>
);

Loading.propTypes = {
  text: string.isRequired,
};

export default Loading;
