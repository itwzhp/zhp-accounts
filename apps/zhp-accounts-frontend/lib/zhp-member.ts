import { ZhpMember } from 'zhp-accounts-types';

const generateMembers = () => {
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

  const randomId = () => Math.ceil(Math.random() * 100000);
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
    isAdmin: false,
  }));
};

const GENERATED_MEMBERS = generateMembers();

export async function getZhpMember(memberId: number): Promise<ZhpMember> {
  const member = GENERATED_MEMBERS.find((u) => u.id === memberId);

  if (!member) {
    throw new Error(`Could not find member for id "${memberId}"`);
  }

  return member;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getZhpMembers(unitId: number): Promise<ZhpMember[]> {
  const randomIndexes = new Set<number>();
  while (randomIndexes.size < 10) {
    const randomIndex = Math.floor(Math.random() * GENERATED_MEMBERS.length);
    randomIndexes.add(randomIndex);
  }
  return Array.from(randomIndexes).map((index) => GENERATED_MEMBERS[index]);
}
