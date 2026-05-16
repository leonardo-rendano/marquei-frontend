export interface Availability {
  id: string;
  professionalId: string;
  weekDay: number;
  startTime: string;
  endTime: string;
  professional?: {
    id: string;
    user?: {
      name: string;
    };
  };
}