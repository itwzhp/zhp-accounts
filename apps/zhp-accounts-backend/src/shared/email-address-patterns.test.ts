import { describe, expect, it } from "vitest";
import { cleanMailNamePart, getPossibleAddressesForUser } from "@/shared/email-address-patterns";

describe("cleanMailNamePart", () => {
  it("removes spaces, diacritics and keeps letters with hyphen", () => {
    expect(cleanMailNamePart("  Łukasz-Żaneta ")).toBe("lukasz-zaneta");
  });

  it("transliterates special latin letters", () => {
    expect(cleanMailNamePart("Ægir Ørn Dvořák Đuro ßeta")).toBe("aegirorndvorakdurosseta");
  });
});

describe("getPossibleAddressesForUser", () => {
  it.each([
    [" Jan  ", " KOWALSKI  ", "jan.kowalski@zhp.pl"],
    ["Jan", "Kowalski-Nowak", "jan.kowalski-nowak@zhp.pl"],
    ["John", "von Neuman", "john.vonneuman@zhp.pl"],
    ["Grażyna", "Ąężćńłśó", "grazyna.aezcnlso@zhp.pl"],
    ["Danuta", "Hübner", "danuta.hubner@zhp.pl"],
    ["Renée", "O’Connor", "renee.oconnor@zhp.pl"],
  ])("returns expected first candidate for %s %s", (firstName, lastName, expectedFirstEmail) => {
    const result = getPossibleAddressesForUser(firstName, lastName);
    expect(result[0]).toBe(expectedFirstEmail);
  });

  it("returns ordered candidate list in expected format", () => {
    const result = getPossibleAddressesForUser("Jan", "Kowalski");

    expect(result[0]).toBe("jan.kowalski@zhp.pl");
    expect(result[1]).toBe("kowalski.jan@zhp.pl");
    expect(result[2]).toBe("j.kowalski@zhp.pl");
    expect(result[3]).toBe("jan.kowalski1@zhp.pl");
    expect(result[result.length - 1]).toBe("jan.kowalski99@zhp.pl");
    expect(result).toHaveLength(102);
  });

  it("returns empty list when clean values are empty", () => {
    expect(getPossibleAddressesForUser("123", "***")).toEqual([]);
  });
});
