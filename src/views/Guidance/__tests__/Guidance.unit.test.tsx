import { render, screen } from "src/testUtils";

import Guidance from "..";

describe("Guidance", () => {
  it("Should Display Guidance in the Document", async () => {
    render(<Guidance />);
    expect(screen.getByText("Guidance")).toBeInTheDocument();
  });
});
