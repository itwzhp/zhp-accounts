import { ZhpUnit } from 'zhp-accounts-types';

const GENERATED_UNITS: ZhpUnit[] = [
  {
    id: 55644,
    name: 'Hufiec ZHP „Watra”',
    region: 'Chorągiew Białostocka',
    type: 'hufiec',
  },
  {
    id: 55645,
    name: 'Hufiec ZHP im. Szarych Szeregów',
    region: 'Chorągiew Gdańska',
    type: 'hufiec',
  },
  {
    id: 52646,
    name: 'Hufiec ZHP „Puszcza”',
    region: 'Chorągiew Krakowska',
    type: 'hufiec',
  },
  {
    id: 55347,
    name: 'Hufiec ZHP im. Tadeusza Kościuszki',
    region: 'Chorągiew Stołeczna',
    type: 'hufiec',
  },
  {
    id: 56248,
    name: 'Hufiec ZHP „Orlęta”',
    region: 'Chorągiew Śląska',
    type: 'hufiec',
  },
  {
    id: 57149,
    name: 'Hufiec ZHP im. Bohaterów Westerplatte',
    region: 'Chorągiew Pomorska',
    type: 'hufiec',
  },
  {
    id: 58050,
    name: 'Hufiec ZHP „Zawisza”',
    region: 'Chorągiew Kujawsko-Pomorska',
    type: 'hufiec',
  },
  {
    id: 58951,
    name: 'Hufiec ZHP im. Jana Pawła II',
    region: 'Chorągiew Mazowiecka',
    type: 'hufiec',
  },
  {
    id: 59852,
    name: 'Hufiec ZHP „Bieszczady”',
    region: 'Chorągiew Podkarpacka',
    type: 'hufiec',
  },
  {
    id: 60753,
    name: 'Hufiec ZHP im. Aleksandra Kamińskiego',
    region: 'Chorągiew Łódzka',
    type: 'hufiec',
  },
  {
    id: 61654,
    name: 'Hufiec ZHP „Sokół”',
    region: 'Chorągiew Lubelska',
    type: 'hufiec',
  },
  {
    id: 62555,
    name: 'Hufiec ZHP im. Marii Konopnickiej',
    region: 'Chorągiew Opolska',
    type: 'hufiec',
  },
  {
    id: 63456,
    name: 'Hufiec ZHP „Gorce”',
    region: 'Chorągiew Małopolska',
    type: 'hufiec',
  },
  {
    id: 64357,
    name: 'Hufiec ZHP „Bór”',
    region: 'Chorągiew Świętokrzyska',
    type: 'hufiec',
  },
  {
    id: 65258,
    name: 'Hufiec ZHP im. Stefana Czarnieckiego',
    region: 'Chorągiew Wielkopolska',
    type: 'hufiec',
  },
  {
    id: 66159,
    name: 'Hufiec ZHP „Pogranicze”',
    region: 'Chorągiew Lubuska',
    type: 'hufiec',
  },
  {
    id: 67060,
    name: 'Hufiec ZHP „Dolina Liwca”',
    region: 'Chorągiew Mazowiecka',
    type: 'hufiec',
  },
  {
    id: 67961,
    name: 'Hufiec ZHP im. Mikołaja Kopernika',
    region: 'Chorągiew Warmińsko-Mazurska',
    type: 'hufiec',
  },
  {
    id: 68862,
    name: 'Hufiec ZHP „Jantar”',
    region: 'Chorągiew Pomorska',
    type: 'hufiec',
  },
  {
    id: 69763,
    name: 'Hufiec ZHP „Wilki”',
    region: 'Chorągiew Śląska',
    type: 'hufiec',
  },
];

export async function getZhpUnit(id: number): Promise<ZhpUnit> {
  const unit = GENERATED_UNITS.find((unit) => unit.id === id);

  if (!unit) {
    throw Error(`Could not find unit for id "${id}"`);
  }

  return unit;
}

export async function getZhpUnits(): Promise<ZhpUnit[]> {
  return GENERATED_UNITS;
}
