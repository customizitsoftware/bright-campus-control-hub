import { describe, expect, it } from "vitest";
import { navForRole } from "./navigation";

const titles = (r: Parameters<typeof navForRole>[0]) => navForRole(r).flatMap((g) => g.items.map((i) => i.title));

describe("role navigation preview", () => {
  it("shows Platform Admin only to the platform super admin", () => {
    expect(titles("platform_super_admin")).toContain("Platform Admin");
    expect(titles("school_admin")).not.toContain("Platform Admin");
  });
  it("hides Staff from parents", () => {
    expect(titles("parent")).not.toContain("Staff");
  });
  it("shows Fees & Payments and Expenses to the bursar", () => {
    expect(titles("bursar")).toContain("Fees & Payments");
  });
});

describe("expenses visibility", () => {
  it("hides Expenses from parents", () => {
    expect(titles("parent")).not.toContain("Expenses");
  });
});
