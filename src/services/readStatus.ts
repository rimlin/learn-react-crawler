import { ReadStatus } from 'types/ReadStatus';
import { getJson, setJson } from 'utils/localStorage';

const READ_STATUS_KEY = 'read_status';

export const toggleRead = (href: string) => {
  const currentState = getJson(READ_STATUS_KEY) || {};

  currentState[href] = currentState[href] ? false : true;

  setJson(READ_STATUS_KEY, currentState);

  return currentState[href];
};

export const markAsReaded = (hrefs: string[]) => {
  const currentState = getJson(READ_STATUS_KEY) || {};

  const markedAsReaded: ReadStatus = {};

  for (const item of hrefs) {
    markedAsReaded[item] = true;
  }

  setJson(READ_STATUS_KEY, { ...currentState, ...markedAsReaded });

  return markedAsReaded;
};

export const getInitialReadStatus = (): ReadStatus => {
  return getJson(READ_STATUS_KEY) || {};
};
