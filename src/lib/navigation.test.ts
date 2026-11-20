import { describe, expect, it } from "vitest";
import { navForRole } from "./navigation";

const titles = (r: Parameters<typeof navForRole>[0]) => navForRole(r).flatMap((g) => g.items.map((i) => i.title));

describe("role navigation preview", () => {
  it("shows Platform Admin only to the platform super admin", () => {
    expect(titles("platform_super_admin")).toContain("Platform Admin");
    expect(titles("school_admin")).not.toContain("Platform Admin");
  });
  it("hides Staff & HR from parents", () => {
    expect(titles("parent")).not.toContain("Staff & HR");
  });
  it("shows Finance to the bursar", () => {
    expect(titles("bursar")).toContain("Finance");
  });
});
