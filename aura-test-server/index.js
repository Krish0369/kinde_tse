import express from "express";
import axios from "axios";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 3001;

app.use(cors());

const cliendId = process.env.KINDE_CLIENT_ID;
const clientSecret = process.env.KINDE_CLIENT_SECRET;
const kindeDomain = process.env.KINDE_DOMAIN;

async function getAccessToken() {
  const tokenUrl = `${kindeDomain}/oauth2/token`;
  const data = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: cliendId,
    client_secret: clientSecret,
    audience: `${kindeDomain}/api`,
  });
  const headers = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await axios.post(tokenUrl, data.toString(), headers);

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting token: ", error);

    throw error;
  }
}

app.get("/api/organizations", async (req, res) => {
  try {
    const token = await getAccessToken();

    const organizations = await axios.get(
      `${kindeDomain}/api/v1/organizations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(organizations.data);
  } catch (error) {
    console.error("Could not get organizations: ", error);

    res.status(500).json({ error: "Failed to get organizations" });
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server running at http://localhost:${PORT}`);
});
