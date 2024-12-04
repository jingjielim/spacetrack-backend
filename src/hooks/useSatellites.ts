import { Satellite } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

async function fetchSatellites(): Promise<Array<Satellite>>{
  const response = await fetch(`/api/satellites`);
  const data = await response.json();
  console.log("received data: ", data);
  return data.data;
}

function useSatellites() {
  return useQuery({
    queryKey: ["satellites"],
    queryFn: () => fetchSatellites(),
    staleTime: 1000 * 60 * 60,
  });
}

export { useSatellites, fetchSatellites };
