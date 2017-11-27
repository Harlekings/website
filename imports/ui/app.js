import React, { PureComponent as Component } from 'react';
import Counter from './counter';
import { connect } from 'react-redux'

import { increaseCounter, decreaseCounter } from '../redux/actions';
class App extends Component {
  render() {
    return (
      <div>
        <p>Hello, world!</p>
        <Counter />
      </div>
    );
  }
}

export default connect()(App);