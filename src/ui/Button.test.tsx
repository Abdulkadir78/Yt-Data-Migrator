import { render, screen } from "@testing-library/react";

import { Button } from "./Button";

test("renders a button with children text", () => {
  render(<Button>Login</Button>);
  const btn = screen.getByRole("button");
  expect(btn).toBeInTheDocument();
});

test("shows a spinner when loading", () => {
  render(<Button loading>Login</Button>);
  const spinner = screen.getByRole("img");
  expect(spinner).toBeInTheDocument();
});

test("applies correct variant classes", () => {
  const { rerender } = render(
    <Button variant="primary">Primary Button</Button>
  );

  expect(screen.getByRole("button")).toHaveClass(
    "border-blue-700 text-blue-700 hover:bg-blue-50"
  );

  rerender(<Button variant="danger">Danger Button</Button>);
  expect(screen.getByRole("button")).toHaveClass(
    "border-red-600 text-red-600 hover:bg-red-50"
  );
});

test("button is disabled when disabled prop is passed", () => {
  render(<Button disabled>Click me</Button>);
  const button = screen.getByRole("button");
  expect(button).toBeDisabled();
  expect(button).toHaveClass("border-gray-300 text-gray-400");
});

test("button is not clickable when disabled", () => {
  const handleClick = jest.fn();

  render(
    <Button onClick={handleClick} disabled>
      Click me
    </Button>
  );

  const button = screen.getByRole("button");
  button.click();
  expect(handleClick).not.toHaveBeenCalled();
});
