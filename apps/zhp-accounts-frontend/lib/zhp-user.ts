export interface ZhpUser {
  id: string;
  name: string;
  surname: string;
  membershipNumber: string;
  region: string;
  district: string;
}

const generateUsers = () => {
  const names = [
    'Jan',
    'Marta',
    'Łukasz',
    'Krzysztof',
    'Anna',
    'Piotr',
    'Karolina',
    'Tomasz',
  ];
  const surnames = [
    'Kowalski',
    'Świątek',
    'Nowak',
    'Zieliński',
    'Wójcik',
    'Kaczmarek',
    'Lewandowski',
    'Wiśniewski',
  ];
  const regions = [
    'Chorągiew Białostocka',
    'Chorągiew Warszawska',
    'Chorągiew Gdańska',
    'Chorągiew Krakowska',
  ];
  const districts = [
    'Hufiec ZHP "Watra"',
    'Hufiec ZHP "Zielona Góra"',
    'Hufiec ZHP "Orion"',
  ];

  const randomId = () => Math.ceil(Math.random() * 100000).toString();
  const randomElement = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const getRandomLetters = () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const getRandomNumbers = () =>
    Math.floor(100000000 + Math.random() * 900000000).toString();
  const generateMembershipNumber = () =>
    `${getRandomLetters()}${getRandomNumbers()}`;

  return Array.from({ length: 100 }).map(() => ({
    id: randomId(),
    name: randomElement(names),
    surname: randomElement(surnames),
    membershipNumber: generateMembershipNumber(),
    region: randomElement(regions),
    district: randomElement(districts),
  }));
};

const GENERATED_USERS = generateUsers();

export async function getZhpUser(userId: string): Promise<ZhpUser> {
  const user = GENERATED_USERS.find((u) => u.id === userId);

  if (!user) {
    throw new Error(`Could not find user for id "${userId}"`);
  }

  return user;
}

export async function getZhpUsers(unitId: string): Promise<ZhpUser[]> {
  const randomIndexes = new Set<number>();
  while (randomIndexes.size < 10) {
    const randomIndex = Math.floor(Math.random() * GENERATED_USERS.length);
    randomIndexes.add(randomIndex);
  }
  return Array.from(randomIndexes).map((index) => GENERATED_USERS[index]);
}
