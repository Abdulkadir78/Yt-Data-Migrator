import { createContext, useCallback, useContext, useState } from "react";

import { TSubscription } from "@/queries";

interface TSubscriptionsContext {
  subscriptions: TSubscription[] | null;
  updateSubscriptions: (subs: TSubscription[] | null) => void;
  selectedSubscriptions: TSubscription[];
  updateSelectedSubscriptions: (id: string, checked: boolean) => void;
  selectAllSubscriptions: (checked: boolean) => void;
  isCopyingSubscriptions: boolean;
  updateIsCopyingSubscriptions: (isCopy: boolean) => void;
  resetSubscriptions: () => void;
}

const SubscriptionsContext = createContext<TSubscriptionsContext | null>(null);

export const SubscriptionsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [subscriptions, setSubscriptions] = useState<TSubscription[] | null>(
    null
  );
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<
    TSubscription[]
  >([]);

  const [isCopyingSubscriptions, setIsCopyingSubscriptions] = useState(false);

  const updateSubscriptions = useCallback((subs: TSubscription[] | null) => {
    if (!subs) {
      setSubscriptions(null);
    } else {
      setSubscriptions((prev) => {
        return [
          ...(prev || []),
          ...(subs?.filter(
            (item) => !prev?.some((prevItem) => prevItem.id === item.id)
          ) || []),
        ];
      });
    }
  }, []);

  const updateSelectedSubscriptions = useCallback(
    (id: string, checked: boolean) => {
      if (checked) {
        const sub = subscriptions?.find((s) => s.id === id);

        if (sub) {
          setSelectedSubscriptions((prev) => {
            const copy = [...prev];
            copy.push(sub);
            return copy;
          });
        }
      } else {
        setSelectedSubscriptions((prev) => prev.filter((s) => s.id !== id));
      }
    },
    [subscriptions]
  );

  const selectAllSubscriptions = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedSubscriptions(subscriptions || []);
      } else {
        setSelectedSubscriptions([]);
      }
    },
    [subscriptions]
  );

  const updateIsCopyingSubscriptions = useCallback((isCopy: boolean) => {
    setIsCopyingSubscriptions(isCopy);
  }, []);

  const resetSubscriptions = useCallback(() => {
    setSubscriptions(null);
    setSelectedSubscriptions([]);
    setIsCopyingSubscriptions(false);
  }, []);

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        updateSubscriptions,
        selectedSubscriptions,
        updateSelectedSubscriptions,
        selectAllSubscriptions,
        isCopyingSubscriptions,
        updateIsCopyingSubscriptions,
        resetSubscriptions,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
};

export const useSubscriptions = () => {
  const ctx = useContext(SubscriptionsContext);

  if (!ctx) {
    throw new Error(
      "useSubscriptions must be used with a SubscriptionsProvider"
    );
  }

  return ctx;
};
