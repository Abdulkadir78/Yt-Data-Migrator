import { render, screen } from "@testing-library/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import {
  getUserInfo,
  getSubscriptions,
  getPlaylists,
  SubscriptionsResponse,
  UserInfoResponse,
  PlaylistsResponse,
} from "@/queries";
import { Source } from "./Source";
import { AuthProvider, TAuthContext, useAuth } from "../contexts/Auth";
import { SubscriptionsProvider } from "../contexts/Subscriptions";
import { PlaylistsProvider } from "../contexts/Playlists";
import { PLAYLISTS, SUBSCRIPTIONS } from "@/data";
import userEvent from "@testing-library/user-event";

jest.mock("../contexts/Auth", () => {
  return {
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    useAuth: jest.fn(() => ({})),
  };
});

jest.mock("../../queries", () => {
  return {
    getUserInfo: jest.fn(),
    getSubscriptions: jest.fn(),
    getPlaylists: jest.fn(),
  };
});

const UI = () => (
  <GoogleOAuthProvider clientId="">
    <AuthProvider>
      <SubscriptionsProvider>
        <PlaylistsProvider>
          <Source />
        </PlaylistsProvider>
      </SubscriptionsProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);

const renderSource = () => {
  return render(UI());
};

test("renders login button when logged out", () => {
  renderSource();
  const loginBtn = screen.getByRole("button", { name: /login/i });
  expect(loginBtn).toBeInTheDocument();
});

test("show login to view subscriptions and playlists message when logged out", () => {
  renderSource();

  const loginToViewSubs = screen.getByText(/login to view subs/i);
  const loginToViewPlaylists = screen.getByText(/login to view play/i);

  expect(loginToViewSubs).toBeInTheDocument();
  expect(loginToViewPlaylists).toBeInTheDocument();
});

test("displays username, profile picture and logout button when logged in", async () => {
  (useAuth as jest.Mock<Partial<TAuthContext>>).mockReturnValue({
    sourceToken: "123",
  });

  const userData = {
    name: "ak",
    email: "ak@gmail.com",
    picture: "profile.jpg",
  };

  (
    getUserInfo as jest.Mock<Promise<Partial<UserInfoResponse>>>
  ).mockResolvedValue(userData);

  renderSource();

  const logoutBtn = await screen.findByRole("button", { name: /logout/i });
  const profileImg = screen.getByRole("img");
  const name = screen.getByText(userData.name);

  expect(logoutBtn).toBeInTheDocument();
  expect(name).toBeInTheDocument();
  expect(profileImg).toBeInTheDocument();
  expect(profileImg).toHaveAttribute("src", userData.picture);
});

test("displays no subscriptions and no playlists if api returns no data", async () => {
  // mock functions getSubscriptions and getPlaylists defined above return no data (undefined)
  renderSource();

  const noSubs = await screen.findByText(/no subs/i);
  const noPlaylists = await screen.findByText(/no play/i);

  expect(noSubs).toBeInTheDocument();
  expect(noPlaylists).toBeInTheDocument();
});

test("renders subscriptions if api returns subscriptions data", async () => {
  (
    getSubscriptions as jest.Mock<Promise<Partial<SubscriptionsResponse>>>
  ).mockResolvedValue({
    items: SUBSCRIPTIONS,
  });

  renderSource();

  for (const sub of SUBSCRIPTIONS) {
    const subLabel = await screen.findByLabelText(sub.snippet.title);
    expect(subLabel).toBeInTheDocument();
  }
});

test("renders playlists if api returns playlists data", async () => {
  (
    getPlaylists as jest.Mock<Promise<Partial<PlaylistsResponse>>>
  ).mockResolvedValue({
    items: PLAYLISTS,
  });

  renderSource();

  for (const play of PLAYLISTS) {
    const playLabel = await screen.findByLabelText(play.snippet.title);
    expect(playLabel).toBeInTheDocument();
  }
});

test("resets when logged out", async () => {
  const { rerender } = renderSource();

  // findByRole is used instead of getByRole to suppress the act warning
  const logoutBtn = await screen.findByRole("button", { name: /logout/i });
  userEvent.click(logoutBtn);

  (useAuth as jest.Mock<Partial<TAuthContext>>).mockReturnValue({
    sourceToken: null,
  });

  rerender(UI());

  const loginBtn = screen.getByRole("button", { name: /login/i });
  const loginToViewSubs = screen.getByText(/login to view subs/i);
  const loginToViewPlaylists = screen.getByText(/login to view play/i);

  expect(loginBtn).toBeInTheDocument();
  expect(loginToViewSubs).toBeInTheDocument();
  expect(loginToViewPlaylists).toBeInTheDocument();
});
