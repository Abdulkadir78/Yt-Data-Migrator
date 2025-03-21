import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoogleOAuthProvider } from "@react-oauth/google";

// import { axios2 } from "@/axios";
import { getUserInfo, UserInfoResponse } from "@/queries";
import { Destination } from "./Destination";
import { AuthProvider, TAuthContext, useAuth } from "../contexts/Auth";
import {
  SubscriptionsProvider,
  TSubscriptionsContext,
  useSubscriptions,
} from "../contexts/Subscriptions";
import {
  PlaylistsProvider,
  TPlaylistsContext,
  usePlaylists,
} from "../contexts/Playlists";

// jest.mock("../../axios", () => {
//   return {
//     axios2: {
//       get: jest.fn(),
//     },
//   };
// });

jest.mock("../../queries", () => {
  return {
    getUserInfo: jest.fn(),
  };
});

jest.mock("../contexts/Auth", () => {
  return {
    useAuth: jest.fn(() => {
      return {};
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock("../contexts/Subscriptions", () => {
  return {
    useSubscriptions: jest.fn(() => {
      return {
        selectedSubscriptions: [],
      };
    }),
    SubscriptionsProvider: ({ children }: { children: React.ReactNode }) =>
      children,
  };
});

jest.mock("../contexts/Playlists", () => {
  return {
    usePlaylists: jest.fn(() => {
      return {
        selectedPlaylists: [],
      };
    }),
    PlaylistsProvider: ({ children }: { children: React.ReactNode }) =>
      children,
  };
});

// UI is a functional component, this can't be a variable like UI = <GoogleOAuthProvider>...</GoogleOAuthProvider>
// since a variable will not cause a re-render
const UI = () => (
  <GoogleOAuthProvider clientId="">
    <AuthProvider>
      <SubscriptionsProvider>
        <PlaylistsProvider>
          <Destination />
        </PlaylistsProvider>
      </SubscriptionsProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);

const renderDestination = () => {
  return render(UI());
};

test("renders login button when not logged in", async () => {
  renderDestination();
  const loginBtn = screen.getByRole("button", { name: /login/i });
  expect(loginBtn).toBeInTheDocument();
});

test("does not render profile info and copy actions when logged out", () => {
  renderDestination();

  const img = screen.queryByRole("img");
  const logoutBtn = screen.queryByRole("button", { name: /logout/i });
  const copySubsBtn = screen.queryByRole("button", { name: /copy subs/i });
  const copyPlaylistsBtn = screen.queryByRole("button", {
    name: /copy playlist/i,
  });

  expect(img).not.toBeInTheDocument();
  expect(logoutBtn).not.toBeInTheDocument();
  expect(copySubsBtn).not.toBeInTheDocument();
  expect(copyPlaylistsBtn).not.toBeInTheDocument();
});

test("displays username, profile picture, logout button, copy subscriptions button and copy playlists button when logged in", async () => {
  (useAuth as jest.Mock<Partial<TAuthContext>>).mockReturnValue({
    destinationToken: "12345",
  });

  const userData = {
    name: "ak",
    email: "ak@gmail.com",
    picture: "profile.jpg",
  };

  // ***** using axios mock *****
  // (axios2.get as jest.Mock).mockImplementation((url: string) => {
  //   if (url === "https://www.googleapis.com/oauth2/v3/userinfo") {
  //     return Promise.resolve({ data: userData });
  //   }

  //   return Promise.reject();
  // });

  // ***** using query mock *****
  (
    getUserInfo as jest.Mock<Promise<Partial<UserInfoResponse>>>
  ).mockResolvedValue(userData);

  renderDestination();

  const picture = await waitFor(() => screen.findByRole("img"));
  const name = screen.getByText(userData.name);
  const logoutBtn = screen.getByRole("button", { name: /logout/i });
  const copySubsBtn = screen.getByRole("button", { name: /copy subs/i });
  const copyPlaylistsBtn = screen.getByRole("button", {
    name: /copy playlist/i,
  });

  expect(picture).toHaveAttribute("src", userData.picture);
  expect(picture).toBeInTheDocument();
  expect(name).toBeInTheDocument();
  expect(logoutBtn).toBeInTheDocument();
  expect(copySubsBtn).toBeInTheDocument();
  expect(copyPlaylistsBtn).toBeInTheDocument();
});

test("resets when logged out", async () => {
  // the logout button is still displayed without mocking because mocking functions persists across tests
  // and we already mocked the getUserInfo response in the previous test

  /**

      1. jest.clearAllMocks() - Resets all the mocks usage data, not their implementation. 
          In other words, it only replaces fn.mock.calls and fn.mock.instances properties of a jest mock function.

      2. jest.resetAllMocks() - A superset of clearAllMocks() which also takes care of resetting the implementation to a no return function. 
          In other words, it will replace the mock function with a new jest.fn(), not just its fn.mock.calls and fn.mock.instances.

      3. jest.restoreAllMocks() - Similar to resetAllMocks(), with one very important difference. It restores the original implementation of "spies". 
          So, it goes like "replace mocks with jest.fn(), but replace spies with their original implementation".
          It works in combination with jest.spyOn()
      
      Additionally -
          .mockReset() - similar to calling resetAllMocks but this is for a particular function
          Example - (useAuth as jest.Mock).mockReset();
        
        ...similar for .mockClear() and .mockRestore()
   */

  const mockUpdateDestinationToken = jest.fn();

  (useAuth as jest.Mock<Partial<TAuthContext>>).mockReturnValue({
    destinationToken: "123456",
    updateDestinationToken: mockUpdateDestinationToken,
  });

  const { rerender } = renderDestination();

  const logoutBtn = await waitFor(() =>
    screen.findByRole("button", { name: /logout/i })
  );

  await userEvent.click(logoutBtn);
  expect(mockUpdateDestinationToken).toHaveBeenCalledWith(null);

  // reset destinationToken in context
  (useAuth as jest.Mock<Partial<TAuthContext>>).mockReturnValue({
    destinationToken: null,
  });

  rerender(UI());

  const loginBtn = screen.getByRole("button", { name: /login/i });
  expect(loginBtn).toBeInTheDocument();
  expect(logoutBtn).not.toBeInTheDocument();
});

test("copy subscriptions button shows a spinner when loading and disables copy playlists button", async () => {
  (useAuth as jest.Mock<Partial<TAuthContext>>).mockReturnValue({
    destinationToken: "123456",
  });

  (
    useSubscriptions as jest.Mock<Partial<TSubscriptionsContext>>
  ).mockReturnValue({
    isCopyingSubscriptions: true,
  });

  renderDestination();

  const copySubsBtn = await screen.findByRole("button", { name: /copy subs/i });
  const copyPlaylistsBtn = screen.getByRole("button", { name: /copy play/i });

  const subsSpinner = within(copySubsBtn).getByRole("img");
  const playlistsSpinner = within(copyPlaylistsBtn).queryByRole("img");

  expect(subsSpinner).toBeInTheDocument();
  expect(playlistsSpinner).not.toBeInTheDocument();
  expect(copyPlaylistsBtn).toBeDisabled();

  // another way of doing it instead of using queryByRole
  // expect(() => within(copyPlaylistsBtn).getByRole("img")).toThrow();
});

test("copy playlists button shows a spinner when loading and disables copy subscriptions button", async () => {
  (useAuth as jest.Mock<Partial<TAuthContext>>).mockReturnValue({
    destinationToken: "123456",
  });

  // reset previous subscriptions loading state (from previous test)
  (useSubscriptions as jest.Mock).mockReturnValue({});

  (usePlaylists as jest.Mock<Partial<TPlaylistsContext>>).mockReturnValue({
    isCopyingPlaylists: true,
  });

  renderDestination();

  const copySubsBtn = await screen.findByRole("button", { name: /copy subs/i });
  const copyPlaylistsBtn = screen.getByRole("button", { name: /copy play/i });

  const playlistsSpinner = within(copyPlaylistsBtn).getByRole("img");
  const subsSpinner = within(copySubsBtn).queryByRole("img");

  expect(playlistsSpinner).toBeInTheDocument();
  expect(subsSpinner).not.toBeInTheDocument();
  expect(copySubsBtn).toBeDisabled();
});
