import { api } from "./api";

export async function getAvailability() {
  const response = await api.get("/availability");
  return response.data;
}

export async function createAvailability(data: {
  professionalId: string;
  weekDay: number;
  startTime: string;
  endTime: string;
}) {
  const response = await api.post("/availability", data);
  return response.data;
}
