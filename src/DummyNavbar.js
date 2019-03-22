import React, { Component } from 'react';
import { PerseidsHeader } from 'perseids-react-components';
import { NavbarToggler, Collapse } from 'reactstrap';

const renderCollapse = collapsed => (
  <Collapse isOpen={!collapsed} navbar>
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <a className="nav-link" href="/l">
          Search
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/b">
          Browse
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/p/preface">
          Preface
        </a>
      </li>
    </ul>
  </Collapse>
);

class DummyNavbar extends Component {
  state = {
    collapsed: true,
  }

  toggleNavbar = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  }

  render() {
    const { collapsed } = this.state;

    return (
      <PerseidsHeader>
        <NavbarToggler onClick={this.toggleNavbar} aria-label="navigation menu" />

        {renderCollapse(collapsed)}
      </PerseidsHeader>
    );
  }
}

export default DummyNavbar;
