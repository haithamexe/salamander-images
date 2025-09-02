// Search for tracks
export async function searchTracks(query) {
  const response = await fetch(
    `/api/spotify?action=search&q=${encodeURIComponent(
      query
    )}&type=track&limit=30`
  );
  if (!response.ok) throw new Error("Spotify search failed");
  return response.json();
}

// Search for artists
export async function searchArtists(query) {
  const response = await fetch(
    `/api/spotify?action=search&q=${encodeURIComponent(
      query
    )}&type=artist&limit=5`
  );
  if (!response.ok) throw new Error("Spotify search failed");
  return response.json();
}
