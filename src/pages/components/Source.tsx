import { useState, useEffect } from "react";
import { googleLogout } from "@react-oauth/google";

import { Error } from "@/types";
import { getSubscriptions, getUserInfo } from "@/queries";
import { errorToast } from "@/utils";
import { SUBSCRIPTIONS } from "@/data";
import { Login } from "./Login";
import { Profile } from "./Profile";
import { Subscriptions } from "./Subscriptions";
import { useAuth } from "../contexts/Auth";
import { useSubscriptions } from "../contexts/Subscriptions";

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

  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false);

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
        updateSubscriptions(data.items);

        if (data?.nextPageToken) {
          await getSubscriptionsData(data.nextPageToken);
        }
      } catch (error) {
        errorToast((error as Error).message);
      } finally {
        setIsLoadingSubscriptions(false);
      }
    };

    if (sourceToken) {
      setIsLoadingSubscriptions(true);
      // getSubscriptionsData();
      updateSubscriptions(SUBSCRIPTIONS);
    } else {
      updateSubscriptions(null);
    }
  }, [sourceToken, updateSubscriptions]);

  const handleLogout = () => {
    googleLogout();
    updateSourceToken(null);
    resetSubscriptions();
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
    </div>
  );
};
