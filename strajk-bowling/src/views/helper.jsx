import { Route, Routes, MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import Booking from "./Booking.jsx";
import Confirmation from "./Confirmation.jsx";

export const renderBooking = () => {
  render(
    <MemoryRouter>
      <Booking />
    </MemoryRouter>
  );
};

export const renderRoutes = () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </MemoryRouter>
  );
};

export const renderConfirmation = () => {
  render(
    <MemoryRouter>
      <Confirmation />
    </MemoryRouter>
  );
};
