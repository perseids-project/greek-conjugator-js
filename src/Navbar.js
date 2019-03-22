import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PerseidsHeader } from 'perseids-react-components';
import { NavbarToggler, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';

const matchPropType = PropTypes.shape({
  params: PropTypes.shape({
    word: PropTypes.string,
  }).isRequired,
});

const renderCollapse = (collapsed, word) => (
  <Collapse isOpen={!collapsed} navbar>
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <NavLink className="nav-link" to={`/l/${word}`}>
          Search
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/b/${word}`}>
          Browse
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/p/preface">
          Preface
        </NavLink>
      </li>
    </ul>
  </Collapse>
);

class Navbar extends Component {
  static propTypes = {
    match: matchPropType.isRequired,
  }

  state = {
    collapsed: true,
  }

  toggleNavbar = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  }

  render() {
    const { collapsed } = this.state;
    const { match: { params } } = this.props;
    const word = params.word || '';

    return (
      <PerseidsHeader>
        <NavbarToggler onClick={this.toggleNavbar} aria-label="navigation menu" />

        {renderCollapse(collapsed, word)}
      </PerseidsHeader>
    );
  }
}

export default Navbar;
