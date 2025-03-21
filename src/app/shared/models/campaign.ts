import { CampaignStatus } from "../enums/campaignStatus";

export class Campaign {
    public constructor(init?: Partial<Campaign>){
        Object.assign(this, init)
    }

    campaignId: number;
    userId: number;
    title: string;
    description: number;
    profile: any;
    startDate: Date;
    endDate: Date;
    status: CampaignStatus;
}

export class NewCampaign {
    public constructor(init?: Partial<NewCampaign>){
        Object.assign(this, init)
    }

    userId: number;
    title: string;
    description: number;
    startDate: Date;
    endDate: Date;
    status: CampaignStatus;
}

export class EditCampaign {
    public constructor(init?: Partial<EditCampaign>){
        Object.assign(this, init)
    }

    title: string;
    description: number;
    startDate: Date;
    endDate: Date;
    status: CampaignStatus;
}