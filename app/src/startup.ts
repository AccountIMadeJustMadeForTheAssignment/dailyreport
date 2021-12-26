import { connect } from './db';

export const startup = async () => {
  await connect();
};
