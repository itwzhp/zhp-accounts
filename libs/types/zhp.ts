export interface ZhpMember {
  id: string;
  name: string;
  surname: string;
  membershipNumber: string;
  region: string;
  district: string;
}

export interface ZhpUnit {
  id: string;
  name: string;
  region?: string;
}
