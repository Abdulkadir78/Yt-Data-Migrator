import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "./contexts/Auth";
import { Source } from "./components/Source";
import { Destination } from "./components/Destination";
import { SubscriptionsProvider } from "./contexts/Subscriptions";
// import { Playlists } from "./components/Playlists";

const Home = () => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <AuthProvider>
        <SubscriptionsProvider>
          <div className="container px-[16px] mx-auto mt-[40px] ">
            <div>
              <h1 className="text-[28px] lg:text-[32px] font-semibold border-b border-gray-200 pb-[8px]">
                Youtube Data Migrator
              </h1>

              <div className="grid grid-cols-2 gap-[40px] min-h-[88vh]">
                <div className="pt-[16px]">
                  <Source />
                </div>
                <div className="border-l border-gray-200 pl-[40px] pt-[16px]">
                  <Destination />
                </div>
              </div>
            </div>
          </div>
        </SubscriptionsProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default Home;
