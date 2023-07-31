
const initialState = {
  baseline: null,
  comparison: null,
  persistedBaseline: null,
  persistedBaselineGraphs: null,
  persistedComparison: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_BASELINE":
      return {
        ...state,
        baseline: action.payload,
      };
    case "SET_COMPARISON":
      return {
        ...state,
        comparison: action.payload,
      };
    case "FETCH_PERSISTED_DATA":
      return {
        ...state,
        persistedBaseline: action.payload.persistedBaseline,
        persistedComparison: action.payload.persistedComparison,
      };
    case "FETCH_PERSISTED_DATA_GRAPHS":
      return {
        ...state,
        persistedBaselineGraphs: action.payload.persistedBaselineGraphs,
      };
    case "PERSIST_BASELINE":
      return {
        ...state,
        persistedBaseline: state.baseline,
      };
    case "PERSIST_BASELINE_GRAPHS_DATA":
      return {
        ...state,
        persistedBaselineGraphs: action.payload,
      };

    case "PERSIST_COMPARISON":
      return {
        ...state,
        persistedComparison: state.comparison,
      };
    default:
      return state;
  }
}
