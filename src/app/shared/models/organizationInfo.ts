import { PixType } from "../enums/pixType";

export class OrganizationInfo {
    public constructor(init?: Partial<OrganizationInfo>){
        Object.assign(this, init)
    }

    organizationInfoId: number;
    userId: number;
    user: any;
    isOrganizationApproved: boolean;
    disapprovalReason: string;
    pixType: PixType;
    pixKey: string;
    beneficiaryName: string;
    beneficiaryCity: string;
    pixValue: string;
    contactName: string;
    contactPhone: string;
}

export class NewOrganizationInfo {
    public constructor(init?: Partial<NewOrganizationInfo>){
        Object.assign(this, init)
    }

    userId: number;
    pixType: PixType;
    pixKey: string;
    beneficiaryName: string;
    beneficiaryCity: string;
    pixValue: string;
    contactName: string;
    contactPhone: string;
}

export class UpdateOrganizationInfo {
    public constructor(init?: Partial<UpdateOrganizationInfo>){
        Object.assign(this, init)
    }

    pixType: PixType;
    pixKey: string;
    beneficiaryName: string;
    beneficiaryCity: string;
    pixValue: string;
    contactName: string;
    contactPhone: string;
}