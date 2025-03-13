import { TPlaylist } from "@/queries";
import { Spinner } from "@/ui/Spinner";
import { ImageWithFallback } from "@/ui/ImageWithFallback";

interface PlaylistsProps {
  playlists: TPlaylist[] | null;
  selectedPlaylists: TPlaylist[];
  onCheck?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  showCheckboxes?: boolean;
  areCheckboxesDisabled?: boolean;
  isLoading?: boolean;
}

export const Playlists: React.FC<PlaylistsProps> = ({
  playlists,
  selectedPlaylists,
  onCheck,
  onSelectAll,
  showCheckboxes = true,
  areCheckboxesDisabled = false,
  isLoading = false,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-[18px] lg:text-[20px]">Playlists</p>
          <p
            className={`mt-[2px] text-gray-600 text-[12px] ${
              showCheckboxes && !!playlists?.length
                ? "max-w-[250px] lg:max-w-[350px] xl:max-w-full"
                : ""
            }`}
          >
            Both accounts need to have a channel associated with them in order
            to copy playlists
          </p>
        </div>

        {showCheckboxes && !!playlists?.length && (
          <div className="flex items-center gap-[4px]">
            <input
              type="checkbox"
              id="select-all-playlists"
              className={areCheckboxesDisabled ? "" : "cursor-pointer"}
              disabled={areCheckboxesDisabled}
              checked={selectedPlaylists.length === playlists?.length}
              onChange={(e) => {
                onSelectAll?.(e.currentTarget.checked);
              }}
            />
            <label
              htmlFor="select-all-playlists"
              className={`text-[14px] whitespace-nowrap ${
                areCheckboxesDisabled ? "" : "cursor-pointer"
              }`}
            >
              Select All
            </label>
          </div>
        )}
      </div>

      <div className="mt-[12px]">
        {!playlists && !isLoading && (
          <p className="text-gray-500 text-[14px]">Login to view playlists</p>
        )}

        {playlists && !playlists?.length && !isLoading && (
          <p className="text-gray-500 text-[14px]">No Playlists</p>
        )}
      </div>

      {!!playlists?.length && (
        <div className="mt-[8px] space-y-[16px] grid min-[375px]:grid-cols-2 lg:grid-cols-3 gap-[8px]">
          {playlists?.map((pls) => {
            return (
              <label
                key={pls.id}
                htmlFor={pls.id}
                className={`shadow bg-white flex items-center gap-[8px] h-[48px] px-[16px] ${
                  areCheckboxesDisabled ? "" : "cursor-pointer"
                }`}
              >
                {showCheckboxes && (
                  <input
                    type="checkbox"
                    id={pls.id}
                    className={`mr-[8px] ${
                      areCheckboxesDisabled ? "" : "cursor-pointer"
                    }`}
                    disabled={areCheckboxesDisabled}
                    checked={selectedPlaylists.some((s) => s.id === pls.id)}
                    onChange={(e) => {
                      onCheck?.(pls.id, e.currentTarget.checked);
                    }}
                  />
                )}
                <ImageWithFallback
                  src={pls.snippet?.thumbnails?.default?.url}
                  fallbackSrc="/images/default_thumbnail.jpg"
                  alt="playlist thumbnail"
                  className="w-[32px] h-[32px] rounded-full object-cover"
                />
                <span className="font-medium text-[14px] truncate">
                  {pls.snippet?.title}
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
