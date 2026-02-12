/**
 * Typ jednostki organizacyjnej w ZHP.
 * PJO (Podstawowa Jednostka Organizacyjna) to np. gromada zuchowa, drużyna harcerska, ale tutaj może oznaczać każdą jednostkę poniżej hufca (np. Szczep)
 */
export type ZhpUnitType = "pjo" | "hufiec" | "chorągiew"

export interface ZhpUnit {
    id: number
    name: string
    type: ZhpUnitType
}

/**
 * Response structure for getSubUnits - includes both the parent unit and its children
 */
export interface UnitsWithRoot {
    root: ZhpUnit
    subunits: ZhpUnit[]
}
