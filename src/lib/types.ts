export type BrandId = "A" | "B" | "C" | "D";

export type Stage = "Lead" | "Active Pipeline" | "Active Client";

export type ServiceId = "X" | "Y" | "Z" | "W";

export interface Brand {
  id: BrandId;
  name: string;
  color: string;
}

export interface Service {
  id: ServiceId;
  name: string;
}

export interface RecordItem {
  id: string;
  company: string;
  contact: string;
  owner: string;
  brandId: BrandId;
  stage: Stage;
  clientId: string | null;
  services: ServiceId[];
  marketingEmailsOn: boolean;
  createdAt: string;
  updatedAt: string;
  clientSince: string | null;
}

export interface AppState {
  records: RecordItem[];
  nextClientSeq: number;
  selectedBrand: BrandId | "ALL";
}
