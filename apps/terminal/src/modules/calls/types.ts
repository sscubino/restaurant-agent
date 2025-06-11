export interface CallData {
    id: number
    callSid: string;
    from: string;
    to: string;
    direction: string;
    callStatus: string;
    duration: string;
    fromCountry: string;
    toCountry: string;
    timestamp: Date;
    accountSid: string;
};