import { ActionTypes } from "./action-types";

export const setFilter = (filterText, inputText) => {
  return {
    type: ActionTypes.SET_FILTER,
    payload: {
      filter: filterText,
      inputdata: inputText
    },
  };
};

export const setInputData = (data, prevStoreInfo) => {
  return {
    type: ActionTypes.SET_INPUTDATA,
    payload: {
      ...prevStoreInfo,
      inputdata: data,
    },
  };
};
