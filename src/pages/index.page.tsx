import { GoogleOAuthProvider } from "@react-oauth/google";

import { Source } from "./components/Source";
import { Destination } from "./components/Destination";
import { AuthProvider } from "./contexts/Auth";
import { PlaylistsProvider } from "./contexts/Playlists";
import { SubscriptionsProvider } from "./contexts/Subscriptions";

const Home = () => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <AuthProvider>
        <SubscriptionsProvider>
          <PlaylistsProvider>
            <div className="container px-[16px] mx-auto mt-[40px]">
              <div>
                <h1 className="text-[28px] lg:text-[32px] font-semibold border-b border-gray-200 pb-[8px]">
                  <span className="text-red-600">Youtube</span> Data Migrator
                </h1>

                <div className="grid md:grid-cols-2 gap-[40px] min-h-[88vh]">
                  <div className="pt-[16px] md:pb-[40px]">
                    <Source />
                  </div>
                  <div className="border-t md:border-t-0 md:border-l border-gray-200 md:pl-[40px] pt-[16px] pb-[40px]">
                    <Destination />
                  </div>
                </div>
              </div>
            </div>
          </PlaylistsProvider>
        </SubscriptionsProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default Home;
