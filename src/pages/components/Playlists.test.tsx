import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Playlists } from "./Playlists";
import { PLAYLISTS } from "@/data";

test("shows login to view when playlists is null", () => {
  render(<Playlists playlists={null} selectedPlaylists={[]} />);
  const loginText = screen.getByText(/login to view/i);
  expect(loginText).toBeInTheDocument();
});

test("shows no playlists when playlists is an empty array", () => {
  render(<Playlists playlists={[]} selectedPlaylists={[]} />);
  const emptyText = screen.getByText(/no playlists/i);
  expect(emptyText).toBeInTheDocument();
});

test("shows a spinner when playlists are loading", async () => {
  render(<Playlists playlists={[]} selectedPlaylists={[]} isLoading />);
  const spinner = screen.getByRole("img");
  expect(spinner).toBeInTheDocument();
});

test("renders playlists when passed", () => {
  render(<Playlists playlists={PLAYLISTS} selectedPlaylists={[]} />);

  PLAYLISTS.forEach((s) => {
    const sub = screen.getByLabelText(s.snippet.title);
    expect(sub).toBeInTheDocument();
  });
});

test("renders a checkbox beside each subscription", async () => {
  render(<Playlists playlists={PLAYLISTS} selectedPlaylists={[]} />);

  const checkboxes = screen.getAllByRole("checkbox");

  // +1 for the 'Select All' checkbox
  expect(checkboxes).toHaveLength(PLAYLISTS.length + 1);
});

test("hides checkboxes when showCheckboxes is false", () => {
  render(
    <Playlists
      playlists={PLAYLISTS}
      selectedPlaylists={[]}
      showCheckboxes={false}
    />
  );

  const checkboxes = screen.queryAllByRole("checkbox");
  expect(checkboxes).toHaveLength(0);
});

test("disables all checkbox when areCheckboxesDisabled is true", () => {
  render(
    <Playlists
      playlists={PLAYLISTS}
      selectedPlaylists={[]}
      areCheckboxesDisabled
    />
  );

  const checkboxes = screen.getAllByRole("checkbox");
  for (const checkbox of checkboxes) {
    expect(checkbox).toBeDisabled();
  }
});

test("call onSelectAll when 'select all' checkbox is checked", async () => {
  const onSelectAll = jest.fn();

  render(
    <Playlists
      playlists={PLAYLISTS}
      selectedPlaylists={[]}
      onSelectAll={onSelectAll}
    />
  );

  const selectAllCheckbox = screen.getByLabelText(/select all/i);
  await userEvent.click(selectAllCheckbox);
  expect(onSelectAll).toHaveBeenCalledWith(true);
});

test("call onCheck with correct parameters when a checkbox is checked", async () => {
  const onCheck = jest.fn();
  const firstSub = PLAYLISTS[0];

  render(
    <Playlists playlists={PLAYLISTS} selectedPlaylists={[]} onCheck={onCheck} />
  );

  const checkbox = screen.getByLabelText(
    new RegExp(firstSub.snippet.title, "i")
  );

  await userEvent.click(checkbox);
  expect(onCheck).toHaveBeenCalledWith(firstSub.id, true);
});

test("selectedPlaylists if passed are checked", () => {
  const onCheck = jest.fn();
  const firstSub = PLAYLISTS[0];

  render(
    <Playlists
      playlists={PLAYLISTS}
      selectedPlaylists={[firstSub]}
      onCheck={onCheck}
    />
  );

  const checkbox = screen.getByLabelText(
    new RegExp(firstSub.snippet.title, "i")
  );

  expect(checkbox).toBeChecked();
});
