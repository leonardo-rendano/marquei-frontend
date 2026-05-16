export interface Professional {
  id: string;

  specialty: string;

  user: {
    id: string;
    name: string;
    email: string;
  };

  services: {
    service: {
      id: string;
      name: string;
    };
  }[];
}
