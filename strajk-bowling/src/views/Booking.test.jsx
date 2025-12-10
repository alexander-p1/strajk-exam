import { fireEvent, screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Booking from "./Booking.jsx";

describe("BookingTest", () => {
  // Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem.
  // Användaren ska kunna ange antal spelare (minst 1 spelare).
  // Användaren ska kunna reservera ett eller flera banor beroende på antal spelare.
  it("Should be able to book date, time and players and to reserve 1 or more lanes", () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const dateInput = screen.getByLabelText("Date");
    const timeInput = screen.getByLabelText("Time");
    const playerInput = screen.getByLabelText("Number of awesome bowlers");
    const laneInput = screen.getByLabelText("Number of lanes");

    fireEvent.change(dateInput, { target: { value: "2025-12-24" } });
    fireEvent.change(timeInput, { target: { value: "12:00" } });
    fireEvent.change(playerInput, { target: { value: "2" } });
    fireEvent.change(laneInput, { target: { value: "1" } });

    expect(dateInput).toHaveValue("2025-12-24");
    expect(timeInput).toHaveValue("12:00");
    expect(playerInput).toHaveValue(2);
    expect(laneInput).toHaveValue(1);
  });

  // Användaren ska kunna ange skostorlek för varje spelare.
  // Användaren ska kunna ändra skostorlek för varje spelare.
  // Systemet ska visa en översikt där användaren kan kontrollera de valda skostorlekarna för varje spelare innan bokningen slutförs.
  it("Should add shoes and size for each player", () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const shoeButton = screen.getByText("+");
    fireEvent.click(shoeButton);

    const shoeInput = screen.getByLabelText("Shoe size / person 1");
    expect(shoeInput).toBeInTheDocument();

    fireEvent.change(shoeInput, { target: { value: "42" } });
    expect(shoeInput).toHaveValue("42");

    fireEvent.click(shoeButton);

    const shoeInputTwo = screen.getByLabelText("Shoe size / person 2");
    expect(shoeInputTwo).toBeInTheDocument();

    fireEvent.change(shoeInputTwo, { target: { value: "39" } });
    expect(shoeInputTwo).toHaveValue("39");

    const allShoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
    expect(allShoeInputs).toHaveLength(2);

    expect(allShoeInputs[0]).toHaveValue("42");
    expect(allShoeInputs[1]).toHaveValue("39");
  });

  // Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen.
  it("Should be able to change size for all players", () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const shoeButton = screen.getByText("+");

    fireEvent.click(shoeButton);

    const shoeInput = screen.getByLabelText("Shoe size / person 1");
    fireEvent.change(shoeInput, { target: { value: "42" } });

    expect(shoeInput).toHaveValue("42");

    fireEvent.change(shoeInput, { target: { value: "43" } });

    expect(shoeInput).toHaveValue("43");
  });

  // Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare.
  it("Should remove correct shoe when clicking - ", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const addShoeButton = screen.getByText("+");

    await user.click(addShoeButton);
    await user.click(addShoeButton);

    const shoeInput = screen.getAllByLabelText(/Shoe size \/ person/i)

    await user.type(shoeInput[0], "42")
    await user.type(shoeInput[1], "45")

    expect(shoeInput[0]).toHaveValue("42")
    expect(shoeInput[1]).toHaveValue("45")

    const removeButton = screen.getAllByText("-")

    await user.click(removeButton[0])

    const remainingInput = screen.getAllByLabelText(/Shoe size \/ person/i)
    expect(remainingInput).toHaveLength(1)

    expect(screen.queryByDisplayValue("42")).not.toBeInTheDocument;
    expect(screen.queryByDisplayValue("45")).toBeInTheDocument;
  });
});
