import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoogleOAuthProvider } from "@react-oauth/google";

// import { axios2 } from "@/axios";
import { getUserInfo } from "@/queries";
import { Destination } from "./Destination";
import { AuthProvider, TAuthContext, useAuth } from "../contexts/Auth";
import { SubscriptionsProvider } from "../contexts/Subscriptions";
import { PlaylistsProvider } from "../contexts/Playlists";

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

// UI is a functional component, this can't by a variable like UI = <GoogleOAuthProvider>...</GoogleOAuthProvider>
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
  (getUserInfo as jest.Mock).mockResolvedValue(userData);

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

  // jest.resetAllMocks() - Reset all mock implementation between tests.
  // jest.clearAllMocks() - Clears all mocks, resets mock calls, and mock return values.
  // jest.restoreAllMocks() - Restores all mocks to their original (unmocked) implementations.
  // Additionally -
  // .mockReset() - Clear a specific mock's state (like mock return values) between tests
  // Example - (useAuth as jest.Mock).mockReset();

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
