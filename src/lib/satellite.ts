import {
  SPACETRACK_LOGIN_PATH,
  SPACETRACK_TLE_QUERY,
  SPACETRACK_URL,
  TELEOS_1_NORAD_ID,
  TELEOS_2_NORAD_ID,
} from "@/config";
import { RawGPData, Satellite } from "@/utils/types";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

const base_url = SPACETRACK_URL;
const login_path = SPACETRACK_LOGIN_PATH;
const tle_query = SPACETRACK_TLE_QUERY;
const username = process.env.SPACETRACK_USERNAME || "";
const password = process.env.SPACETRACK_PASSWORD || "";
const satellitesId = [TELEOS_1_NORAD_ID, TELEOS_2_NORAD_ID];

const jar = new CookieJar();

const axiosInstance = wrapper(
  axios.create({
    baseURL: base_url,
    jar,
    withCredentials: true,
  })
);

function parseSatelliteData(rawData: RawGPData[]): Satellite[] {
  return rawData.map((satellite) => {
    const {
      NORAD_CAT_ID,
      TLE_LINE1,
      TLE_LINE2,
      EPOCH,
      OBJECT_NAME,
      CREATION_DATE,
    } = satellite;
    return {
      noradId: NORAD_CAT_ID,
      tleLine1: TLE_LINE1,
      tleLine2: TLE_LINE2,
      epoch: EPOCH,
      name: OBJECT_NAME,
      lastUpdated: CREATION_DATE,
    };
  });
}

export async function getSatelliteData() {
  return axiosInstance
    .post(`${base_url}${login_path}`, {
      identity: username,
      password: password,
    })
    .then((response) => {
      if (response.status !== 200) {
        throw Error("Login failed");
      }
      console.log("Login success");
      return axiosInstance.get(`${base_url}${tle_query}${satellitesId}`);
    })
    .then((dataResponse) => parseSatelliteData(dataResponse.data))
    .catch((error) => {
      console.error("Error fetching spacecraft data:", error);
      throw error;
    });
}
