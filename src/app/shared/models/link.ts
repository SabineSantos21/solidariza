export class Link {
    public constructor(init?: Partial<Link>){
        Object.assign(this, init)
    }

    linkId: number;
    profileId: number;
    url: string;
    type: number;
    profile: any;
}

export class NewLink {
    public constructor(init?: Partial<NewLink>){
        Object.assign(this, init)
    }

    profileId: number;
    url: string;
    type: number;
    profile: any;
}