export type AvailableRooms = {
  roomId: number;
  roomUsers: {
    name: string;
    index: number;
  }[];
}[];
