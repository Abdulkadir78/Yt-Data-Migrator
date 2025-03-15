import { axios, axios2 } from "./axios";
import { APIError, Error as TError } from "./types";

interface UserInfoResponse {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string;
}

export const getUserInfo = async (
  type: "source" | "destination" = "source"
) => {
  const axiosInstance = type === "source" ? axios : axios2;

  try {
    const response = await axiosInstance.get<UserInfoResponse>(
      "https://www.googleapis.com/oauth2/v3/userinfo"
    );
    return response.data;
  } catch (error) {
    throw new Error("Could not fetch user information");
  }
};

export interface TSubscription {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    resourceId: { kind: string; channelId: string };
    channelId: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
  contentDetails: {
    totalItemCount: number;
    newItemCount: number;
    activityType: string;
  };
}

export interface SubscriptionsResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: TSubscription[];
}

export const getSubscriptions = async (nextPageToken?: string) => {
  try {
    let url =
      "/subscriptions?part=snippet%2CcontentDetails&maxResults=50&mine=true";

    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }

    const response = await axios.get<SubscriptionsResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error(
      `Could not fetch subscriptions: ${
        (error as APIError).response?.data?.error?.message
      }`
    );
  }
};

interface PostSubscriptionParams {
  channelId: string;
  channelName: string;
}

export const postSubscription = async (params: PostSubscriptionParams) => {
  try {
    await axios2.post("/subscriptions?part=snippet", {
      snippet: {
        resourceId: { kind: "youtube#channel", channelId: params.channelId },
      },
    });
  } catch (error) {
    // throw new Error(`Could not subscribe to channel: ${params.channelName}`);
    throw new Error(
      `${(error as APIError).response?.data?.error?.message}: ${
        params.channelName
      }`
    );
  }
};

export interface TPlaylist {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    localized: { title: string; description: string };
  };
  contentDetails: { itemCount: number };
}

interface PlaylistsResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  pageInfo: { totalResults: number; resultsPerPage: number };
  items: TPlaylist[];
}

export const getPlaylists = async (nextPageToken?: string) => {
  try {
    let url =
      "/playlists?part=snippet%2CcontentDetails&maxResults=50&mine=true";

    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }

    const response = await axios.get<PlaylistsResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error(
      `Could not fetch playlists: ${
        (error as APIError).response?.data?.error?.message
      }`
    );
  }
};

interface CreatePlaylistParams {
  title: string;
  description: string;
  sourcePlaylistId: string;
}

interface CreatePlaylistResponse {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    defaultLanguage: string;
  };
  status: { privacyStatus: string };
}

export const createPlaylist = async (params: CreatePlaylistParams) => {
  try {
    // create playlist in destination account
    const response = await axios2.post<CreatePlaylistResponse>(
      "/playlists?part=snippet%2Cstatus",
      {
        snippet: {
          title: params.title,
          description: params.description,
        },
        status: {
          privacyStatus: "private",
        },
      }
    );

    const createdPlaylist = response.data;

    // get all playlist videos from the source account
    const videos = await getAllPlaylistItems(params.sourcePlaylistId, []);

    // copy all videos from the source playlist to the destination playlist
    for (const video of videos) {
      await postPlaylistItem({
        playlistId: createdPlaylist.id,
        position: video.snippet?.position,
        videoId: video.snippet?.resourceId?.videoId,
      });
    }

    // const promises: Promise<void>[] = [];
    // for (const video of videos) {
    //   promises.push(
    //     postPlaylistItem({
    //       playlistId: createdPlaylist.id,
    //       position: video.snippet?.position,
    //       videoId: video.snippet?.resourceId?.videoId,
    //     })
    //   );
    // }

    // const postResponses = await Promise.allSettled(promises);
    // const hasError = postResponses.some((res) => res.status === "rejected");

    // if (hasError) {
    //   throw new Error(
    //     `Some videos could not be copied into the playlist: ${params.title}`
    //   );
    // }
  } catch (error) {
    // TError for manually thrown errors
    throw new Error(
      (error as APIError).response?.data?.error?.message ||
        (error as TError)?.message
    );
  }
};

interface PlaylistItemsParams {
  playlistId: string;
  nextPageToken?: string;
}

interface PlaylistItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      high?: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: { kind: string; videoId: string };
    videoOwnerChannelTitle?: string;
    videoOwnerChannelId?: string;
  };
  contentDetails: { videoId: string; videoPublishedAt?: string };
}
interface PlaylistItemsResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  items: PlaylistItem[];
  pageInfo: { totalResults: number; resultsPerPage: number };
}

// get videos in a playlist
const getPlaylistItems = async (params: PlaylistItemsParams) => {
  try {
    let url = `/playlistItems?part=snippet%2CcontentDetails&maxResults=100&playlistId=${params.playlistId}`;

    if (params.nextPageToken) {
      url += `&pageToken=${params.nextPageToken}`;
    }

    const response = await axios.get<PlaylistItemsResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error(
      `Could not fetch playlist items: ${
        (error as APIError).response?.data?.error?.message
      }`
    );
  }
};

// get all playlist items recursively (api is paginated)
const getAllPlaylistItems = async (
  playlistId: string,
  items: PlaylistItem[]
) => {
  try {
    const response = await getPlaylistItems({ playlistId });

    items = items.concat(response.items);
    if (response.nextPageToken) {
      return await getAllPlaylistItems(playlistId, items);
    }

    return items;
  } catch (error) {
    throw new Error((error as TError).message);
  }
};

interface PostPlaylistItemsParams {
  playlistId: string;
  position: number;
  videoId: string;
}

// add video to playlist
const postPlaylistItem = async (params: PostPlaylistItemsParams) => {
  try {
    await axios2.post("/playlistItems?part=snippet", {
      snippet: {
        playlistId: params.playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId: params.videoId,
        },
      },
    });
  } catch (error) {
    // if the playlist contains unavailable or deleted videos, skip them
    if (
      (error as APIError).response?.data?.error?.status ===
        "FAILED_PRECONDITION" ||
      (error as APIError).response?.data?.error?.code === 404
    ) {
      return;
    }

    throw new Error((error as APIError).response?.data?.error?.message);
  }
};
