import { describe, expect, it } from "vitest";
import { formatNaira, initials } from "./format";

describe("formatting", () => {
  it("formats Naira with the ₦ sign and thousands separators", () => {
    expect(formatNaira(185000)).toBe("₦185,000");
  });
  it("builds two-letter initials", () => {
    expect(initials("Chiamaka Okafor")).toBe("CO");
  });
});
