export class Profile {
    public constructor(init?: Partial<Profile>){
        Object.assign(this, init)
    }

    profileId: number;
    userId: number;
    user: any;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
}

export class NewProfile {
    public constructor(init?: Partial<NewProfile>){
        Object.assign(this, init)
    }

    userId: number;
    user: any;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
}

export class UpdateProfile {
    public constructor(init?: Partial<UpdateProfile>){
        Object.assign(this, init)
    }

    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
}