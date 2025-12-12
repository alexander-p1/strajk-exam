import { screen, render, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Confirmation from "./Confirmation.jsx";
import userEvent from "@testing-library/user-event";
import { renderConfirmation, renderRoutes } from "./helper.jsx";

describe("Confirmation Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  // Som användare vill jag kunna skicka iväg min reservation och få tillbaka ett ett bokningsnummer och totalsumma så jag vet hur mycket jag ska betala. (120 kr / person + 100 kr / bana).
  describe("USER STORY 4", () => {
    it("AC2: Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd.", () => {
      const mockBooking = {
        when: "2025-12-24T12:00",
        lanes: "2",
        people: "4",
        shoes: ["42", "45", "40", "38"],
        price: 680,
        bookingId: "123bowl",
        active: true,
      };

      sessionStorage.setItem("confirmation", JSON.stringify(mockBooking));

      renderConfirmation();

      expect(screen.getByText(/Booking number/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/123bowl/i)).toBeInTheDocument();
    });

    it("AC3: Systemet ska beräkna och visa totalsumma (120kr/person + 100kr/bana)", () => {
      const mockBooking = {
        when: "2025-12-24T12:00",
        lanes: "2",
        people: "4",
        shoes: ["42", "45", "40", "38"],
        price: 680,
        bookingId: "bowl123",
        active: true,
      };

      sessionStorage.setItem("confirmation", JSON.stringify(mockBooking));

      renderConfirmation();

      expect(screen.getByText(/680 sek/i)).toBeInTheDocument();
    });

    it("AC4: Den totala summan ska visas tydligt på bekräftelsesidan och inkludera en uppdelning mellan spelare och banor.", () => {
      const mockBooking = {
        when: "2025-12-24T12:00",
        lanes: "2",
        people: "4",
        shoes: ["42", "45", "40", "38"],
        price: 680,
        bookingId: "123bowl321",
        active: true,
      };

      sessionStorage.setItem("confirmation", JSON.stringify(mockBooking));

      renderConfirmation();

      expect(screen.getByText(/680/i)).toBeInTheDocument();
      expect(screen.getByText(/who/i)).toBeInTheDocument();
      expect(screen.getByText(/lanes/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue("4")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    });
  });
});

// Som användare vill jag kunna navigera mellan boknings-och bekräftelsevyn.
describe("USER STORY 5", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("AC1: Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar.", async () => {
    const user = userEvent.setup();
    renderRoutes();

    expect(
      screen.getByRole("button", { name: "strIIIIIike!" })
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Date/i), "2025-12-24");
    await user.type(screen.getByLabelText(/Time/i), "12:00");
    await user.type(screen.getByLabelText(/Number of awesome bowlers/i), "2");
    await user.type(screen.getByLabelText(/Number of lanes/i), "1");

    const shoeButton = screen.getByRole("button", { name: "+" });
    await user.click(shoeButton);
    await user.click(shoeButton);

    const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
    await user.type(shoeInputs[0], "42");
    await user.type(shoeInputs[1], "45");

    const bookButton = screen.getByRole("button", { name: "strIIIIIike!" });
    await user.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText(/See you soon!/i)).toBeInTheDocument();
      expect(screen.queryByText("strIIIIIike!")).not.toBeInTheDocument();
    });
  });

  it("AC2: Om användaren navigerar till bekräftelsevyn och ingen bokning är gjord eller finns i session storage ska texten Ingen bokning gjord visas.", () => {
    renderConfirmation();

    expect(screen.getByText(/Inga bokning gjord!/i)).toBeInTheDocument();
  });

  it("AC3: Om användaren navigerar till bekräftelsevyn och det finns en bokning sparad i session storage ska denna visas.", () => {
    const mockBooking = {
      when: "2025-12-24T12:00",
      lanes: "2",
      people: "4",
      shoes: ["42", "45", "40", "38"],
      price: 680,
      bookingId: "bowl1212",
      active: true,
    };

    sessionStorage.setItem("confirmation", JSON.stringify(mockBooking));

    renderConfirmation();

    expect(screen.getByText(/See you soon!/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/bowl1212/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/2025-12-24 12:00/i)).toBeInTheDocument();
    expect(screen.getByText(/680 sek/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("4")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
  });
});
