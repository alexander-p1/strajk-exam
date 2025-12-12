import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { renderBooking, renderRoutes } from "./helper.jsx";

describe("Booking Component", () => {
  // Som användare vill jag kunna boka datum och tid samt ange antal spelare så att jag kan reservera 1 eller flera baner i bowlinghallen.
  describe("USER STORY 1", () => {
    it("AC1: Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem.", async () => {
      const user = userEvent.setup();
      renderBooking();

      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");

      await user.type(dateInput, "2025-12-24");
      await user.type(timeInput, "12:00");

      expect(dateInput).toHaveValue("2025-12-24");
      expect(timeInput).toHaveValue("12:00");
    });

    it("AC2: Användaren ska kunna ange antal spelare (minst 1)", async () => {
      const user = userEvent.setup();
      renderBooking();

      const playerInput = screen.getByLabelText("Number of awesome bowlers");

      await user.type(playerInput, "4");
      expect(playerInput).toHaveValue(4);
    });

    it("AC3: Användaren ska kunna reservera en eller flera banor", async () => {
      const user = userEvent.setup();
      renderBooking();

      const laneInput = screen.getByLabelText("Number of lanes");

      await user.type(laneInput, "2");
      expect(laneInput).toHaveValue(2);
    });
  });

  // Som användare vill jag kunna välja skostorlek för varje spelare så varje spelare får skor som passar.
  describe("USER STORY 2", () => {
    it("AC1: Användaren ska kunna ange skostorlek för varje spelare", async () => {
      const user = userEvent.setup();
      renderBooking();

      const shoeButton = screen.getByRole("button", { name: "+" });
      await user.click(shoeButton);
      await user.click(shoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
      await user.type(shoeInputs[0], "42");
      await user.type(shoeInputs[1], "39");

      expect(shoeInputs[0]).toHaveValue("42");
      expect(shoeInputs[1]).toHaveValue("39");
    });

    it("AC2: Användaren ska kunna ändra skostorlek för varje spelare", async () => {
      const user = userEvent.setup();
      renderBooking();

      const shoeButton = screen.getByRole("button", { name: "+" });
      await user.click(shoeButton);

      const shoeInput = screen.getByLabelText("Shoe size / person 1");
      await user.type(shoeInput, "42");
      expect(shoeInput).toHaveValue("42");

      await user.clear(shoeInput);
      await user.type(shoeInput, "43");
      expect(shoeInput).toHaveValue("43");
    });

    it("AC3: Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen", async () => {
      const user = userEvent.setup();
      renderBooking();

      const playerInput = screen.getByLabelText("Number of awesome bowlers");
      await user.type(playerInput, "4");

      const shoeButton = screen.getByRole("button", { name: "+" });
      await user.click(shoeButton);
      await user.click(shoeButton);
      await user.click(shoeButton);
      await user.click(shoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
      expect(shoeInputs).toHaveLength(4);

      await user.type(shoeInputs[0], "42");
      await user.type(shoeInputs[1], "45");
      await user.type(shoeInputs[2], "38");
      await user.type(shoeInputs[3], "41");

      expect(shoeInputs[0]).toHaveValue("42");
      expect(shoeInputs[1]).toHaveValue("45");
      expect(shoeInputs[2]).toHaveValue("38");
      expect(shoeInputs[3]).toHaveValue("41");
    });

    it("AC4: Systemet ska visa en översikt där användaren kan kontrollera de valda skostorlekarna för varje spelare innan bokningen slutförs.", async () => {
      const user = userEvent.setup();
      renderBooking();

      const shoeButton = screen.getByRole("button", { name: "+" });
      await user.click(shoeButton);
      await user.click(shoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);

      await user.type(shoeInputs[0], "42");
      await user.type(shoeInputs[1], "39");

      expect(shoeInputs).toHaveLength(2);
      expect(shoeInputs[0]).toHaveValue("42");
      expect(shoeInputs[1]).toHaveValue("39");

      shoeInputs.forEach((input) => {
        expect(input).toBeVisible();
      });

      expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();
    });
  });

  // Som användare vill jag kunna ta bort ett fält för skostorlek om jag råkade klicka i ett för mycket så jag inte boka skor i onödan.
  describe("USER STORY 3", () => {
    it("AC1: Användaren ska kunna ta bort skostorlek med '-' knapp", async () => {
      const user = userEvent.setup();
      renderBooking();

      const addButton = screen.getByRole("button", { name: "+" });
      await user.click(addButton);
      await user.click(addButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
      await user.type(shoeInputs[0], "42");
      await user.type(shoeInputs[1], "45");

      const removeButtons = screen.getAllByRole("button", { name: "-" });
      await user.click(removeButtons[0]);

      const remainingInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
      expect(remainingInputs).toHaveLength(1);
    });

    it("AC2: När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen så att inga skor längre är bokade för den spelaren.", async () => {
      const user = userEvent.setup();
      renderBooking();

      const addButton = screen.getByRole("button", { name: "+" });
      await user.click(addButton);
      await user.click(addButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
      await user.type(shoeInputs[0], "42");
      await user.type(shoeInputs[1], "45");

      const removeButtons = screen.getAllByRole("button", { name: "-" });
      await user.click(removeButtons[0]);

      expect(screen.queryByDisplayValue("42")).not.toBeInTheDocument();
      expect(screen.getByDisplayValue("45")).toBeInTheDocument();
    });

    it("AC3: Om användaren tar bort skostorleken ska systemet inte inkludera den spelaren i skorantalet och priset för skor i den totala bokningssumman.", async () => {
      const user = userEvent.setup();
      renderRoutes();

      await user.type(screen.getByLabelText(/Date/i), "2025-12-24");
      await user.type(screen.getByLabelText(/Time/i), "12:00");
      await user.type(screen.getByLabelText(/Number of awesome bowlers/i), "2");
      await user.type(screen.getByLabelText(/Number of lanes/i), "1");

      const addShoeButton = screen.getByRole("button", { name: "+" });
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
      await user.type(shoeInputs[0], "42");
      await user.type(shoeInputs[1], "45");
      await user.type(shoeInputs[2], "39");

      const removeButtons = screen.getAllByRole("button", { name: "-" });
      await user.click(removeButtons[1]);

      const bookButton = screen.getByRole("button", { name: "strIIIIIike!" });
      await user.click(bookButton);

      await waitFor(() => {
        expect(screen.getByText(/See you soon!/i)).toBeInTheDocument();
        expect(screen.getByText(/340 sek/i)).toBeInTheDocument();
      });
    });
  });

  // Som användare vill jag kunna skicka iväg min reservation och få tillbaka ett ett bokningsnummer och totalsumma så jag vet hur mycket jag ska betala. (120 kr / person + 100 kr / bana).
  describe("USER STORY 4: ", () => {
    it("AC1: Användaren ska kunna slutföra bokningen genom att klicka på en slutför bokning-knapp.", async () => {
      const user = userEvent.setup();
      renderRoutes();

      await user.type(screen.getByLabelText(/Date/i), "2025-12-24");
      await user.type(screen.getByLabelText(/Time/i), "12:00");
      await user.type(screen.getByLabelText(/Number of awesome bowlers/i), "2");
      await user.type(screen.getByLabelText(/Number of lanes/i), "1");

      const shoeButton = screen.getByRole("button", { name: "+" });
      await user.click(shoeButton);
      await user.click(shoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
      await user.type(shoeInputs[0], "42");
      await user.type(shoeInputs[1], "39");

      const bookButton = screen.getByRole("button", { name: "strIIIIIike!" });
      expect(bookButton).toBeInTheDocument();

      await user.click(bookButton);

      await waitFor(() => {
        expect(screen.getByText(/See you soon!/i)).toBeInTheDocument();
      });
    });
  });
});
