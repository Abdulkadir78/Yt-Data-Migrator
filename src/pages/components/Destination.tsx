import { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";

import { Button } from "@/ui/Button";
import { errorToast, successToast } from "@/utils";
import { getUserInfo, postSubscription } from "@/queries";
import { Login } from "./Login";
import { useAuth } from "../contexts/Auth";
import { Profile } from "./Profile";
import { useSubscriptions } from "../contexts/Subscriptions";

export const Destination = () => {
  const { destinationToken, updateDestinationToken } = useAuth();
  const {
    selectedSubscriptions,
    isCopyingSubscriptions,
    updateIsCopyingSubscriptions,
  } = useSubscriptions();

  const [userInfo, setUserInfo] = useState<{
    name: string;
    picture: string;
  } | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getUserInfo("destination");
        setUserInfo({ name: data.name, picture: data.picture });
      } catch (error) {
        errorToast((error as Error).message);
      }
    };

    if (destinationToken) {
      getUserData();
    } else {
      setUserInfo(null);
    }
  }, [destinationToken]);

  const handleLogout = () => {
    googleLogout();
    updateDestinationToken(null);
  };

  const copySubscriptions = async () => {
    if (!selectedSubscriptions.length) {
      errorToast("Select subscriptions from the source account to copy");
      return;
    }

    updateIsCopyingSubscriptions(true);

    const promises: Promise<void>[] = [];

    const data =
      selectedSubscriptions?.map((sub) => {
        const channelId = sub.snippet.resourceId.channelId;
        const channelName = sub.snippet.title || "";

        return { channelId, channelName };
      }) || [];

    data?.forEach((d) => {
      promises.push(postSubscription(d));
    });

    const responses = await Promise.allSettled(promises);
    const rejected: { channelId: string; channelName: string }[] = [];

    responses.forEach((res, i) => {
      if (res.status === "rejected") {
        rejected.push(data?.[i]);
      }
    });

    if (rejected.length) {
      errorToast(
        "Some subscriptions could not be copied: " +
          rejected.map((r) => r.channelName).join(", ")
      );
    } else {
      successToast("Subscriptions copied successfully");
    }

    updateIsCopyingSubscriptions(false);
  };

  return (
    <div>
      <p className="font-bold text-[20px] lg:text-[24px]">
        Destination Account
      </p>

      <div className="mt-[16px]">
        {destinationToken ? (
          <Profile
            name={userInfo?.name || ""}
            picture={userInfo?.picture}
            logoutBtnProps={{
              onClick: handleLogout,
              disabled: isCopyingSubscriptions,
            }}
          />
        ) : (
          <Login type="destination" />
        )}

        {destinationToken && (
          <div className="my-[40px] flex gap-[16px]">
            <Button
              onClick={copySubscriptions}
              className="w-[180px] h-[40px] py-0"
              loading={isCopyingSubscriptions}
              disabled={isCopyingSubscriptions}
            >
              Copy Subscriptions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
