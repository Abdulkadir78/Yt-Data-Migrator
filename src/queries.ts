import { AxiosError } from "axios";
import { axios, axios2 } from "./axios";

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

type GetSubscriptionsError = AxiosError<{ error: { message: string } }>;

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
        (error as GetSubscriptionsError).response?.data?.error?.message
      }`
    );
  }
};

interface PostSubscriptionParams {
  channelId: string;
  channelName: string;
}

type PostSubscriptionError = AxiosError<{ error: { message: string } }>;

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
      `${(error as PostSubscriptionError).response?.data?.error?.message}: ${
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

type GetPlaylistsError = AxiosError<{ error: { message: string } }>;

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
        (error as GetPlaylistsError).response?.data?.error?.message
      }`
    );
  }
};

interface CreatePlaylistParams {
  title: string;
  description: string;
}

type CreatePlaylistError = AxiosError<{ error: { message: string } }>;

export const createPlaylist = async (params: CreatePlaylistParams) => {
  try {
    await axios2.post("/playlists?part=snippet%2Cstatus", {
      snippet: {
        title: params.title,
        description: params.description,
      },
      status: {
        privacyStatus: "private",
      },
    });
  } catch (error) {
    throw new Error(
      (error as CreatePlaylistError).response?.data?.error?.message
    );
  }
};
