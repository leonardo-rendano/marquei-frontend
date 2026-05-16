export interface Appointment {
  id: string;

  startAt: string;

  endAt: string;

  status: string;

  client: {
    id: string;
    name: string;
  };

  professional: {
    id: string;
    user: {
      name: string;
    };
  };

  service: {
    id: string;
    name: string;
    price: number;
  };
}
