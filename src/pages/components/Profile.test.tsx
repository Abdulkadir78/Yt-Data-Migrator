import { render, screen } from "@testing-library/react";

import { Profile } from "./Profile";

test("renders image, name and logout button", () => {
  render(<Profile name="Abdulkadir" />);

  const image = screen.getByRole("img");
  expect(image).toBeInTheDocument();

  const name = screen.getByText(/abdulkadir/i);
  expect(name).toBeInTheDocument();

  const button = screen.getByRole("button", { name: /logout/i });
  expect(button).toBeInTheDocument();
});
