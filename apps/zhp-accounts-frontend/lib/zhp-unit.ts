export interface ZhpUnit {
  id: string;
  name: string;
  region?: string;
}

const GENERATED_UNITS: ZhpUnit[] = [
  {
    id: '55644',
    name: 'Hufiec ZHP „Watra”',
    region: 'Chorągiew Białostocka',
  },
  {
    id: '55645',
    name: 'Hufiec ZHP im. Szarych Szeregów',
    region: 'Chorągiew Gdańska',
  },
  {
    id: '52646',
    name: 'Hufiec ZHP „Puszcza”',
    region: 'Chorągiew Krakowska',
  },
  {
    id: '55347',
    name: 'Hufiec ZHP im. Tadeusza Kościuszki',
    region: 'Chorągiew Stołeczna',
  },
  {
    id: '56248',
    name: 'Hufiec ZHP „Orlęta”',
    region: 'Chorągiew Śląska',
  },
  {
    id: '57149',
    name: 'Hufiec ZHP im. Bohaterów Westerplatte',
    region: 'Chorągiew Pomorska',
  },
  {
    id: '58050',
    name: 'Hufiec ZHP „Zawisza”',
    region: 'Chorągiew Kujawsko-Pomorska',
  },
  {
    id: '58951',
    name: 'Hufiec ZHP im. Jana Pawła II',
    region: 'Chorągiew Mazowiecka',
  },
  {
    id: '59852',
    name: 'Hufiec ZHP „Bieszczady”',
    region: 'Chorągiew Podkarpacka',
  },
  {
    id: '60753',
    name: 'Hufiec ZHP im. Aleksandra Kamińskiego',
    region: 'Chorągiew Łódzka',
  },
  {
    id: '61654',
    name: 'Hufiec ZHP „Sokół”',
    region: 'Chorągiew Lubelska',
  },
  {
    id: '62555',
    name: 'Hufiec ZHP im. Marii Konopnickiej',
    region: 'Chorągiew Opolska',
  },
  {
    id: '63456',
    name: 'Hufiec ZHP „Gorce”',
    region: 'Chorągiew Małopolska',
  },
  {
    id: '64357',
    name: 'Hufiec ZHP „Bór”',
    region: 'Chorągiew Świętokrzyska',
  },
  {
    id: '65258',
    name: 'Hufiec ZHP im. Stefana Czarnieckiego',
    region: 'Chorągiew Wielkopolska',
  },
  {
    id: '66159',
    name: 'Hufiec ZHP „Pogranicze”',
    region: 'Chorągiew Lubuska',
  },
  {
    id: '67060',
    name: 'Hufiec ZHP „Dolina Liwca”',
    region: 'Chorągiew Mazowiecka',
  },
  {
    id: '67961',
    name: 'Hufiec ZHP im. Mikołaja Kopernika',
    region: 'Chorągiew Warmińsko-Mazurska',
  },
  {
    id: '68862',
    name: 'Hufiec ZHP „Jantar”',
    region: 'Chorągiew Pomorska',
  },
  {
    id: '69763',
    name: 'Hufiec ZHP „Wilki”',
    region: 'Chorągiew Śląska',
  },
];

export async function getZhpUnit(id: string): Promise<ZhpUnit> {
  const unit = GENERATED_UNITS.find((unit) => unit.id === id);

  if (!unit) {
    throw Error(`Could not find unit for id "${id}"`);
  }

  return unit;
}

export async function getZhpUnits(): Promise<ZhpUnit[]> {
  return GENERATED_UNITS;
}
