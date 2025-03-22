export type ZhpUnitTypes = "pjo" | "hufiec" | "chorągiew"

export interface ZhpUnit {
    id: number
    name: string
    region?: string
    type: ZhpUnitTypes
}
