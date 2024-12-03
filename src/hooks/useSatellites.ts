import { useQuery } from "@tanstack/react-query";

async function fetchSatellites(limit = 10) {
  const response = await fetch(`pages/api/satellites`);
  const data = await response.json();
  console.log("received data: ", data);
  return data;
}

function useSatellites() {
  return useQuery({
    queryKey: ["satellites"],
    queryFn: () => fetchSatellites(),
    staleTime: 1000 * 60 * 60,
  });
}

export { useSatellites, fetchSatellites };
