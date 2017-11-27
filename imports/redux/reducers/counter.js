export const COUNTER_INC = 'COUNTER_INC';
export const COUNTER_DEC = 'COUNTER_DEC';

const initialState = 0

const counter = (state = initialState, action) => {
  switch (action.type) {
    case COUNTER_INC:
      return state + action.inc;
    case COUNTER_DEC:
      return state - action.dec;
    default:
      return state
  }
}

export default counter