import { useState, useEffect } from "react";
import { googleLogout } from "@react-oauth/google";

import { Error } from "@/types";
import { getPlaylists, getSubscriptions, getUserInfo } from "@/queries";
import { errorToast } from "@/utils";
// import { SUBSCRIPTIONS, PLAYLISTS } from "@/data";
import { Login } from "./Login";
import { Profile } from "./Profile";
import { Subscriptions } from "./Subscriptions";
import { useAuth } from "../contexts/Auth";
import { useSubscriptions } from "../contexts/Subscriptions";
import { Playlists } from "./Playlists";
import { usePlaylists } from "../contexts/Playlists";

export const Source = () => {
  const { sourceToken, updateSourceToken } = useAuth();

  const {
    subscriptions,
    selectedSubscriptions,
    updateSubscriptions,
    updateSelectedSubscriptions,
    selectAllSubscriptions,
    isCopyingSubscriptions,
    resetSubscriptions,
  } = useSubscriptions();

  const {
    playlists,
    selectedPlaylists,
    updatePlaylists,
    updateSelectedPlaylists,
    selectAllPlaylists,
    isCopyingPlaylists,
    resetPlaylists,
  } = usePlaylists();

  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

  const [userInfo, setUserInfo] = useState<{
    name: string;
    picture: string;
  } | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo({ name: data.name, picture: data.picture });
      } catch (error) {
        errorToast((error as Error).message);
      }
    };

    if (sourceToken) {
      getUserData();
    } else {
      setUserInfo(null);
    }
  }, [sourceToken]);

  useEffect(() => {
    const getSubscriptionsData = async (pageToken?: string) => {
      try {
        const data = await getSubscriptions(pageToken);
        // push to the subscriptions array
        updateSubscriptions(data.items);

        if (data?.nextPageToken) {
          // recursively get subscriptions until all subscriptions are fetched
          await getSubscriptionsData(data.nextPageToken);
        }
      } catch (error) {
        errorToast((error as Error).message);
        // this indicates that we have tried fetching subscriptions, so show empty state
        // setting it to null indicates the user is not yet logged in
        updateSubscriptions([]);
      } finally {
        setIsLoadingSubscriptions(false);
      }
    };

    if (sourceToken) {
      setIsLoadingSubscriptions(true);
      getSubscriptionsData();
      // updateSubscriptions(SUBSCRIPTIONS);
    } else {
      // not logged in
      updateSubscriptions(null);
    }
  }, [sourceToken, updateSubscriptions]);

  useEffect(() => {
    const getPlaylistsData = async (pageToken?: string) => {
      try {
        const data = await getPlaylists(pageToken);
        // push to the playlists array
        updatePlaylists(data.items);

        if (data?.nextPageToken) {
          // recursively get playlists until all playlists are fetched
          await getPlaylistsData(data.nextPageToken);
        }
      } catch (error) {
        errorToast((error as Error).message);
        // this indicates that we have tried fetching playlists, so show empty state
        // setting it to null indicates the user is not yet logged in
        updatePlaylists([]);
      } finally {
        setIsLoadingPlaylists(false);
      }
    };

    if (sourceToken) {
      setIsLoadingPlaylists(true);
      getPlaylistsData();
      // updatePlaylists(PLAYLISTS);
    } else {
      // not logged in
      updatePlaylists(null);
    }
  }, [sourceToken, updatePlaylists]);

  const handleLogout = () => {
    googleLogout();
    updateSourceToken(null);
    resetSubscriptions();
    resetPlaylists();
  };

  return (
    <div>
      <p className="font-bold text-[20px] lg:text-[24px]">Source Account</p>

      <div className="mt-[16px]">
        {sourceToken ? (
          <Profile
            name={userInfo?.name || ""}
            picture={userInfo?.picture}
            logoutBtnProps={{
              onClick: handleLogout,
              disabled: isCopyingSubscriptions,
            }}
          />
        ) : (
          <Login />
        )}
      </div>

      <div className="mt-[40px]">
        <Subscriptions
          subscriptions={subscriptions}
          selectedSubscriptions={selectedSubscriptions}
          onCheck={updateSelectedSubscriptions}
          onSelectAll={selectAllSubscriptions}
          areCheckboxesDisabled={isCopyingSubscriptions}
          isLoading={isLoadingSubscriptions}
        />
      </div>

      <div className="mt-[32px]">
        <Playlists
          playlists={playlists}
          selectedPlaylists={selectedPlaylists}
          onCheck={updateSelectedPlaylists}
          onSelectAll={selectAllPlaylists}
          areCheckboxesDisabled={isCopyingPlaylists}
          isLoading={isLoadingPlaylists}
        />
      </div>
    </div>
  );
};
