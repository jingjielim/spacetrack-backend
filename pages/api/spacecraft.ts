import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

const base_url = process.env.SPACETRACK_URL || "";
const login_request = process.env.SPACETRACK_LOGIN_REQUEST || "";
const tle_query = process.env.SPACETRACK_TLE_QUERY || "";
const username = process.env.SPACETRACK_USERNAME || "";
const password = process.env.SPACETRACK_PASSWORD || "";

const jar = new CookieJar();

const axiosInstance = wrapper(
  axios.create({
    baseURL: base_url,
    jar,
    withCredentials: true,
  })
);

async function getSpacecraftData() {
  return axiosInstance
    .post(`${base_url}${login_request}`, {
      identity: username,
      password: password,
    })
    .then((response) => {
      console.log("Login response", response.headers);
      console.log("Login data", response.data);
      if (response.status !== 200) {
        throw Error("Login failed");
      }

      return axiosInstance.get(`${base_url}${tle_query}`);
    })
    .then((dataResponse) => {
      console.log("Received SpacecraftData: ", dataResponse.data);
      return dataResponse.data;
    })
    .catch((error) => {
      console.error("Error fetching spacecraft data:", error);
      throw error;
    });
}

export default async function handler(req: any, res: any) {
  const spacecraftData = await getSpacecraftData();
  console.log("Spacecraft Data fetched successfully", spacecraftData);
  res.status(200).json({ data: spacecraftData });
}
