import { TSubscription } from "@/queries";
import { Spinner } from "@/ui/Spinner";
import { ImageWithFallback } from "@/ui/ImageWithFallback";

interface SubscriptionsProps {
  subscriptions: TSubscription[] | null;
  selectedSubscriptions: TSubscription[];
  onCheck?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  showCheckboxes?: boolean;
  areCheckboxesDisabled?: boolean;
  isLoading?: boolean;
}

export const Subscriptions: React.FC<SubscriptionsProps> = ({
  subscriptions,
  selectedSubscriptions,
  onCheck,
  onSelectAll,
  showCheckboxes = true,
  areCheckboxesDisabled = false,
  isLoading = false,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-bold text-[18px] lg:text-[20px]">Subscriptions</p>

        {showCheckboxes && !!subscriptions?.length && (
          <div className="flex items-center gap-[4px]">
            <input
              type="checkbox"
              id="select-all-subscriptions"
              className={areCheckboxesDisabled ? "" : "cursor-pointer"}
              disabled={areCheckboxesDisabled}
              checked={selectedSubscriptions.length === subscriptions?.length}
              onChange={(e) => {
                onSelectAll?.(e.currentTarget.checked);
              }}
            />
            <label
              htmlFor="select-all-subscriptions"
              className={`text-[14px] ${
                areCheckboxesDisabled ? "" : "cursor-pointer"
              }`}
            >
              Select All
            </label>
          </div>
        )}
      </div>

      <div className="mt-[12px]">
        {!subscriptions && !isLoading && (
          <p className="text-gray-500 text-[14px]">
            Login to view subscriptions
          </p>
        )}

        {subscriptions && !subscriptions?.length && !isLoading && (
          <p className="text-gray-500 text-[14px]">No Subscriptions</p>
        )}
      </div>

      {!!subscriptions?.length && (
        <div className="mt-[8px] space-y-[16px] grid grid-cols-2 lg:grid-cols-3 gap-[8px]">
          {subscriptions?.map((sub) => {
            return (
              <label
                key={sub.id}
                htmlFor={sub.id}
                className={`shadow bg-white flex items-center gap-[8px] h-[48px] px-[16px] ${
                  areCheckboxesDisabled ? "" : "cursor-pointer"
                }`}
              >
                {showCheckboxes && (
                  <input
                    type="checkbox"
                    id={sub.id}
                    className={`mr-[8px] ${
                      areCheckboxesDisabled ? "" : "cursor-pointer"
                    }`}
                    disabled={areCheckboxesDisabled}
                    checked={selectedSubscriptions.some((s) => s.id === sub.id)}
                    onChange={(e) => {
                      onCheck?.(sub.id, e.currentTarget.checked);
                    }}
                  />
                )}
                <ImageWithFallback
                  src={sub.snippet?.thumbnails?.default?.url}
                  fallbackSrc="/images/default_profile.jpg"
                  alt="channel profile"
                  className="w-[32px] h-[32px] rounded-full object-cover"
                />
                <span className="font-medium text-[14px] truncate">
                  {sub.snippet?.title}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {isLoading && (
        <div className="mt-[12px]">
          <Spinner />
        </div>
      )}
    </div>
  );
};
