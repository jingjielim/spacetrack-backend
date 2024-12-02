import axios from "axios";

const base_url = process.env.SPACETRACK_URL || "";
const login_request = process.env.SPACETRACK_LOGIN_REQUEST || "";
const tle_query = process.env.SPACETRACK_TLE_QUERY || "";
const username = process.env.SPACETRACK_USERNAME || "";
const password = process.env.SPACETRACK_PASSWORD || "";
axios.defaults.withCredentials = true;

async function getSpacecraftData() {
  return axios
    .post(
      `${base_url}${login_request}`,
      {
        identity: username,
        password: password,
      },
      { withCredentials: true }
    )
    .then((response) => {
      console.log("Login response", response.headers);
      console.log("Login data", response.data)
      if (response.status !== 200) {
        throw Error("Login failed");
      }

     return axios.get(`${base_url}${tle_query}`, {
        withCredentials: true,
      });
    }).then((dataResponse) => {
        console.log("Received SpacecraftData: ", dataResponse.headers);
        return dataResponse.data;
    });
}

export default async function handler(req: any, res: any) {
  const spacecraftData = await getSpacecraftData();
  res.status(200).json({ data: spacecraftData });
}
