import { render, screen, waitFor } from "@testing-library/react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

import { Login } from "./Login";
import { AuthProvider } from "../contexts/Auth";
import userEvent from "@testing-library/user-event";

jest.mock("@react-oauth/google", () => {
  return {
    GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => {
      return children;
    },
    useGoogleLogin: jest.fn(),
  };
});

// mock auth context (not necessary in our use case)
// jest.mock("../contexts/Auth", () => {
//   return {
//     AuthProvider: ({ children }: { children: React.ReactNode }) => {
//       return children;
//     },
//     useAuth: jest.fn(() => ({})),
//   };
// });

const renderLogin = () => {
  return render(
    <GoogleOAuthProvider clientId="">
      <AuthProvider>
        <Login />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

test("renders a login button", () => {
  renderLogin();

  const button = screen.getByRole("button", { name: /login/i });
  expect(button).toBeInTheDocument();
});

test("call google login on button click", async () => {
  const mockGoogleLogin = jest.fn();
  (useGoogleLogin as jest.Mock).mockReturnValue(mockGoogleLogin);

  renderLogin();
  const loginBtn = screen.getByRole("button", { name: /login/i });

  userEvent.click(loginBtn);
  await waitFor(() => expect(mockGoogleLogin).toHaveBeenCalled());
});
