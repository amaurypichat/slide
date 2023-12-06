import { render, screen, act } from "@testing-library/react";
// import userEvent from '@testing-library/user-event'
import "@testing-library/jest-dom";
// import Home from "../pages/index";
import Ttext from "../component/Ttext";
import React from "react";

// const setup = () => {
  // return render(Home);
// };
// jest.mock('@react-three/cannon');

test("Item 1 menu", async () => {

  var hh = "";
  // act(() => {
  const result = render(<Ttext />);


  // await screen.findByRole("menu");

  expect(screen).toHaveTextContent("Site réalisé avec Three.js et WebGL");
  //   expect(screen.getByRole('button')).toBeDisabled()
});
