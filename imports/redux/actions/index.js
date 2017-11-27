import { COUNTER_INC, COUNTER_DEC } from '../reducers/counter';

export const increaseCounter = (inc = 1) => {
  return {
    type: COUNTER_INC,
    inc
  }
}

export const decreaseCounter = (dec = 1) => {
  return {
    type: COUNTER_DEC,
    dec
  }
}