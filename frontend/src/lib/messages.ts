import { BoardModel } from '../store/models';

export const boardCheckingMessage = (board: BoardModel) => {
  if (!board.checkUrl) {
    return 'Healthcheck not set';
  }
  if (board.isDown) {
    return 'DOWN';
  }
  return 'Healthy';
};
