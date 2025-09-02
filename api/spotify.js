// api/spotify.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get access token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Token error: ${tokenData.error_description}`);
    }

    // Handle different API endpoints
    const { action, ...params } = req.query;
    let spotifyUrl = "https://api.spotify.com/v1/";

    switch (action) {
      case "search":
        const { q, type = "track", limit = 30 } = params;
        spotifyUrl += `search?q=${encodeURIComponent(
          q
        )}&type=${type}&limit=${limit}`;
        break;

      case "track":
        spotifyUrl += `tracks/${params.id}`;
        break;

      case "artist":
        spotifyUrl += `artists/${params.artistId}`;
        break;

      case "album":
        spotifyUrl += `albums/${params.albumId}`;
        break;

      default:
        return res.status(400).json({ error: "Invalid action parameter" });
    }

    const spotifyResponse = await fetch(spotifyUrl, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const data = await spotifyResponse.json();

    if (!spotifyResponse.ok) {
      throw new Error(
        `Spotify API error: ${data.error?.message || "Unknown error"}`
      );
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Spotify API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
