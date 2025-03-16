import { render, screen, fireEvent } from "@testing-library/react";

import { ImageWithFallback } from "./ImageWithFallback";

test("renders the image if the src image is available", () => {
  const imgSrc = "test.jpg";
  const fallbackSrc = "fallback.jpg";
  render(<ImageWithFallback src={imgSrc} fallbackSrc={fallbackSrc} />);
  const image = screen.getByRole("img");

  expect(image).toHaveAttribute("src", imgSrc);
});

test("renders the fallback image if the src image throws an error", () => {
  const imgSrc = "test.jpg";
  const fallbackSrc = "fallback.jpg";
  render(<ImageWithFallback src={imgSrc} fallbackSrc={fallbackSrc} />);
  const image = screen.getByRole("img");

  // simulate an error
  fireEvent.error(image);

  expect(image).toHaveAttribute("src", fallbackSrc);
});

test("renders the fallback image if the src is not provided", () => {
  const fallbackSrc = "fallback.jpg";
  render(<ImageWithFallback fallbackSrc={fallbackSrc} />);
  const image = screen.getByRole("img");

  expect(image).toHaveAttribute("src", fallbackSrc);
});
