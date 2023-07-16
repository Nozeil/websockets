export const WS_PORT = 3000;

export const REQ_RES_TYPES = {
  REG: 'reg',
  CREATE_ROOM: 'create_room',
  UPDATE_ROOM: 'update_room',
  UPDATE_WINNERS: 'update_winners',
  ADD_USER_TO_ROOM: 'add_user_to_room',
  CREATE_GAME: 'create_game',
  ADD_SHIPS: 'add_ships',
  START_GAME: 'start_game',
  TURN: 'turn',
  ATTACK: 'attack',
  RANDOM_ATTACK: 'randomAttack',
  FINISH: 'finish',
} as const;
