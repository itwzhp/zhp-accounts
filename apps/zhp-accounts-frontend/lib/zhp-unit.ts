export interface ZhpUnit {
  id: string;
  district: string;
  region: string;
}

const GENERATED_UNITS = [
  {
    id: '55644',
    district: 'Hufiec ZHP „Watra”',
    region: 'Chorągiew Białostocka im. hm. Ryszarda Kaczorowskiego',
  },
  {
    id: '55645',
    district: 'Hufiec ZHP im. Szarych Szeregów',
    region: 'Chorągiew Gdańska im. Bohaterów Ziemi Gdańskiej',
  },
  {
    id: '52646',
    district: 'Hufiec ZHP „Puszcza”',
    region: 'Chorągiew Krakowska',
  },
  {
    id: '55347',
    district: 'Hufiec ZHP im. Tadeusza Kościuszki',
    region: 'Chorągiew Stołeczna',
  },
  {
    id: '56248',
    district: 'Hufiec ZHP „Orlęta”',
    region: 'Chorągiew Śląska',
  },
  {
    id: '57149',
    district: 'Hufiec ZHP im. Bohaterów Westerplatte',
    region: 'Chorągiew Pomorska',
  },
  {
    id: '58050',
    district: 'Hufiec ZHP „Zawisza”',
    region: 'Chorągiew Kujawsko-Pomorska',
  },
  {
    id: '58951',
    district: 'Hufiec ZHP im. Jana Pawła II',
    region: 'Chorągiew Mazowiecka',
  },
  {
    id: '59852',
    district: 'Hufiec ZHP „Bieszczady”',
    region: 'Chorągiew Podkarpacka',
  },
  {
    id: '60753',
    district: 'Hufiec ZHP im. Aleksandra Kamińskiego',
    region: 'Chorągiew Łódzka',
  },
  {
    id: '61654',
    district: 'Hufiec ZHP „Sokół”',
    region: 'Chorągiew Lubelska',
  },
  {
    id: '62555',
    district: 'Hufiec ZHP im. Marii Konopnickiej',
    region: 'Chorągiew Opolska',
  },
  {
    id: '63456',
    district: 'Hufiec ZHP „Gorce”',
    region: 'Chorągiew Małopolska',
  },
  {
    id: '64357',
    district: 'Hufiec ZHP „Bór”',
    region: 'Chorągiew Świętokrzyska',
  },
  {
    id: '65258',
    district: 'Hufiec ZHP im. Stefana Czarnieckiego',
    region: 'Chorągiew Wielkopolska',
  },
  {
    id: '66159',
    district: 'Hufiec ZHP „Pogranicze”',
    region: 'Chorągiew Lubuska',
  },
  {
    id: '67060',
    district: 'Hufiec ZHP „Dolina Liwca”',
    region: 'Chorągiew Mazowiecka',
  },
  {
    id: '67961',
    district: 'Hufiec ZHP im. Mikołaja Kopernika',
    region: 'Chorągiew Warmińsko-Mazurska',
  },
  {
    id: '68862',
    district: 'Hufiec ZHP „Jantar”',
    region: 'Chorągiew Pomorska',
  },
  {
    id: '69763',
    district: 'Hufiec ZHP „Wilki”',
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
