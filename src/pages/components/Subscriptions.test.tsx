import { render, screen } from "@testing-library/react";

import { Subscriptions } from "./Subscriptions";
import { SUBSCRIPTIONS } from "@/data";
import userEvent from "@testing-library/user-event";

test("shows login to view when subscriptions is null", () => {
  render(<Subscriptions subscriptions={null} selectedSubscriptions={[]} />);
  const loginText = screen.getByText(/login to view/i);
  expect(loginText).toBeInTheDocument();
});

test("shows no subscriptions when subscriptions is an empty array", () => {
  render(<Subscriptions subscriptions={[]} selectedSubscriptions={[]} />);
  const emptyText = screen.getByText(/no subscriptions/i);
  expect(emptyText).toBeInTheDocument();
});

test("shows a spinner when subscriptions are loading", async () => {
  render(
    <Subscriptions subscriptions={[]} selectedSubscriptions={[]} isLoading />
  );
  const spinner = screen.getByRole("img");
  expect(spinner).toBeInTheDocument();
});

test("renders subscriptions when passed", () => {
  render(
    <Subscriptions subscriptions={SUBSCRIPTIONS} selectedSubscriptions={[]} />
  );

  SUBSCRIPTIONS.forEach((s) => {
    const sub = screen.getByLabelText(s.snippet.title);
    expect(sub).toBeInTheDocument();
  });
});

test("renders a checkbox beside each subscription", async () => {
  render(
    <Subscriptions subscriptions={SUBSCRIPTIONS} selectedSubscriptions={[]} />
  );

  const checkboxes = screen.getAllByRole("checkbox");

  // +1 for the 'Select All' checkbox
  expect(checkboxes).toHaveLength(SUBSCRIPTIONS.length + 1);
});

test("hides checkboxes when showCheckboxes is false", () => {
  render(
    <Subscriptions
      subscriptions={SUBSCRIPTIONS}
      selectedSubscriptions={[]}
      showCheckboxes={false}
    />
  );

  const checkboxes = screen.queryAllByRole("checkbox");
  expect(checkboxes).toHaveLength(0);
});

test("disables all checkbox when areCheckboxesDisabled is true", () => {
  render(
    <Subscriptions
      subscriptions={SUBSCRIPTIONS}
      selectedSubscriptions={[]}
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
    <Subscriptions
      subscriptions={SUBSCRIPTIONS}
      selectedSubscriptions={[]}
      onSelectAll={onSelectAll}
    />
  );

  const selectAllCheckbox = screen.getByLabelText(/select all/i);
  await userEvent.click(selectAllCheckbox);
  expect(onSelectAll).toHaveBeenCalledWith(true);
});

test("call onCheck with correct parameters when a checkbox is checked", async () => {
  const onCheck = jest.fn();
  const firstSub = SUBSCRIPTIONS[0];

  render(
    <Subscriptions
      subscriptions={SUBSCRIPTIONS}
      selectedSubscriptions={[]}
      onCheck={onCheck}
    />
  );

  const checkbox = screen.getByLabelText(
    new RegExp(firstSub.snippet.title, "i")
  );

  await userEvent.click(checkbox);
  expect(onCheck).toHaveBeenCalledWith(firstSub.id, true);
});

test("selectedSubscriptions if passed are checked", () => {
  const onCheck = jest.fn();
  const firstSub = SUBSCRIPTIONS[0];

  render(
    <Subscriptions
      subscriptions={SUBSCRIPTIONS}
      selectedSubscriptions={[firstSub]}
      onCheck={onCheck}
    />
  );

  const checkbox = screen.getByLabelText(
    new RegExp(firstSub.snippet.title, "i")
  );

  expect(checkbox).toBeChecked();
});
