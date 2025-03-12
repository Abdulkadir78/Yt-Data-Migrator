import { useAuth } from "../contexts/Auth";

export const Playlists = () => {
  const { sourceToken } = useAuth();

  const handleGetPlaylists = async () => {
    try {
      // *****Liked videos*****
      // const response = await fetch(
      //   "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&maxResults=50&myRating=like",
      //   { headers: { Authorization: `Bearer ${sourceToken}` } }
      // );

      // *****My Playlists*****
      const response = await fetch(
        "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&mine=true",
        { headers: { Authorization: `Bearer ${sourceToken}` } }
      );

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="mt-10" onClick={handleGetPlaylists}>
        Get Playlists
      </button>
    </div>
  );
};
