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
  nextPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: TSubscription[];
}

export const getSubscriptions = async (nextPageToken?: string) => {
  try {
    let url = "/subscriptions?part=snippet%2CcontentDetails&mine=true";

    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }

    const response = await axios.get<SubscriptionsResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error("Could not fetch subscriptions");
  }
};

interface PostSubscriptionParams {
  channelId: string;
  channelName: string;
}

type PostSubscriptionError = AxiosError<{ error: { message: string } }>;

export const postSubscription = async (params: PostSubscriptionParams) => {
  try {
    await axios2.post(
      "https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet",
      {
        snippet: {
          resourceId: { kind: "youtube#channel", channelId: params.channelId },
        },
      }
    );
  } catch (error) {
    // throw new Error(`Could not subscribe to channel: ${params.channelName}`);
    throw new Error(
      `${(error as PostSubscriptionError).response?.data?.error?.message}: ${
        params.channelName
      }`
    );
  }
};
