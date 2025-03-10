import { DocumentType } from "../enums/documentType";
import { UserType } from "../enums/userType";

export class User {
    public constructor(init?: Partial<User>){
        Object.assign(this, init)
    }

    userId: number;
    name: string;
    type: UserType;
    documentType: DocumentType;
    documentNumber: string;
    email: string;
    phone: string;
    password: string;
    creationDate: Date;
    isActive: boolean;
}

export class NewUser {
    public constructor(init?: Partial<User>){
        Object.assign(this, init)
    }

    name: string;
    type: number;
    documentType: number;
    documentNumber: string;
    email: string;
    phone: string;
    password: string;
    contactName: string;
    contactPhone: string;

}