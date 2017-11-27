import React from 'react';
import { connect } from 'react-redux'
import { increaseCounter, decreaseCounter } from '../redux/actions';

const Counter = ({ counter, onIncClick, onDecClick }) => (
  <div>
    <h1>Counter: {counter}</h1>
    <button onClick={() => onIncClick()}>Inc</button>
    <button onClick={() => onIncClick(5)}>Inc+5</button>
    <button onClick={() => onDecClick()}>Dec</button>
    <button onClick={() => onDecClick(5)}>Dec-5</button>
  </div>
)

const mapStateToProps = state => {
  return {
    counter: state.counter
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIncClick: (inc = 1) => {
      dispatch(increaseCounter(inc));
    },
    onDecClick: (dec = 1) => {
      dispatch(decreaseCounter(dec));
    }
  }
}

const CounterDisplay = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)

export default CounterDisplay