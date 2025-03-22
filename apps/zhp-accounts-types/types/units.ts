export type ZhpUnitTypes = "pjo" | "hufiec" | "chorągiew"

export interface ZhpUnit {
    id: number
    name: string
    parent?: Omit<ZhpUnit, "parent">
    type: ZhpUnitTypes
}
