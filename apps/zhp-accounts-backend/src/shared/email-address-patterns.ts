const SPECIAL_CHAR_REPLACEMENTS: Record<string, string> = {
  ł: "l",
  đ: "d",
  ð: "d",
  þ: "th",
  ø: "o",
  æ: "ae",
  œ: "oe",
  ß: "ss",
};

function transliterateSpecialChars(text: string): string {
  return text.replace(/[łđðþøæœß]/g, (char) => SPECIAL_CHAR_REPLACEMENTS[char] ?? char);
}

export function cleanMailNamePart(text: string): string {
  return transliterateSpecialChars(text.toLowerCase())
    .replace(/\s+/g, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z-]/g, "");
}

export function getPossibleAddressesForUser(firstName: string, lastName: string): string[] {
  const cleanedFirstName = cleanMailNamePart(firstName);
  const cleanedLastName = cleanMailNamePart(lastName);

  if (!cleanedFirstName || !cleanedLastName) {
    return [];
  }

  const candidates = [
    `${cleanedFirstName}.${cleanedLastName}@zhp.pl`,
    `${cleanedLastName}.${cleanedFirstName}@zhp.pl`,
    `${cleanedFirstName[0]}.${cleanedLastName}@zhp.pl`,
  ];

  for (let i = 1; i <= 99; i += 1) {
    candidates.push(`${cleanedFirstName}.${cleanedLastName}${i}@zhp.pl`);
  }

  return candidates;
}
