import { createContext, useCallback, useContext, useState } from "react";

import { TPlaylist } from "@/queries";

interface TPlaylistsContext {
  playlists: TPlaylist[] | null;
  updatePlaylists: (subs: TPlaylist[] | null) => void;
  selectedPlaylists: TPlaylist[];
  updateSelectedPlaylists: (id: string, checked: boolean) => void;
  selectAllPlaylists: (checked: boolean) => void;
  isCopyingPlaylists: boolean;
  updateIsCopyingPlaylists: (isCopy: boolean) => void;
  resetPlaylists: () => void;
}

const PlaylistsContext = createContext<TPlaylistsContext | null>(null);

export const PlaylistsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [playlists, setPlaylists] = useState<TPlaylist[] | null>(null);
  const [selectedPlaylists, setSelectedPlaylists] = useState<TPlaylist[]>([]);

  const [isCopyingPlaylists, setIsCopyingPlaylists] = useState(false);

  const updatePlaylists = useCallback((subs: TPlaylist[] | null) => {
    if (!subs) {
      setPlaylists(null);
    } else {
      setPlaylists((prev) => {
        return [
          ...(prev || []),
          ...(subs?.filter(
            (item) => !prev?.some((prevItem) => prevItem.id === item.id)
          ) || []),
        ];
      });
    }
  }, []);

  const updateSelectedPlaylists = useCallback(
    (id: string, checked: boolean) => {
      if (checked) {
        const sub = playlists?.find((s) => s.id === id);

        if (sub) {
          setSelectedPlaylists((prev) => {
            const copy = [...prev];
            copy.push(sub);
            return copy;
          });
        }
      } else {
        setSelectedPlaylists((prev) => prev.filter((s) => s.id !== id));
      }
    },
    [playlists]
  );

  const selectAllPlaylists = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedPlaylists(playlists || []);
      } else {
        setSelectedPlaylists([]);
      }
    },
    [playlists]
  );

  const updateIsCopyingPlaylists = useCallback((isCopy: boolean) => {
    setIsCopyingPlaylists(isCopy);
  }, []);

  const resetPlaylists = useCallback(() => {
    setPlaylists(null);
    setSelectedPlaylists([]);
    setIsCopyingPlaylists(false);
  }, []);

  return (
    <PlaylistsContext.Provider
      value={{
        playlists,
        updatePlaylists,
        selectedPlaylists,
        updateSelectedPlaylists,
        selectAllPlaylists,
        isCopyingPlaylists,
        updateIsCopyingPlaylists,
        resetPlaylists,
      }}
    >
      {children}
    </PlaylistsContext.Provider>
  );
};

export const usePlaylists = () => {
  const ctx = useContext(PlaylistsContext);

  if (!ctx) {
    throw new Error("usePlaylists must be used with a PlaylistsProvider");
  }

  return ctx;
};
