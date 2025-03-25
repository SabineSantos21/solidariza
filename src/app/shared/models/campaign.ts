import { CampaignStatus } from "../enums/campaignStatus";
import { CampaignType } from "../enums/campaignType";

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
    type: CampaignType;
    address: string;
    city: string;
    state: string;
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
    type: number;
    address: string;
    city: string;
    state: string;
}

export class EditCampaign {
    public constructor(init?: Partial<EditCampaign>){
        Object.assign(this, init)
    }

    title: string;
    description: number;
    startDate: Date;
    endDate: Date;
    status: number;
    type: number;
    address: string;
    city: string;
    state: string;
}