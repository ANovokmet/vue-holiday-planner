import { Dayjs } from "dayjs";

export interface Day {
    title: string;
    value: number;
    date: Dayjs;
    key: string;
    class: string | string[];
    headerClass: string | string[];
    left: number;
}

export interface ResourceDay {
    date?: Dayjs; 
    startDate?: Dayjs;
    endDate?: Dayjs;
    class: string | string[];
    style: any;
}

export interface Resource {
    id: number;
    title: string;
    subtitle?: string;
    img?: string;
    days: ResourceDay[];
}

export interface CustomDay {
    date: Dayjs; 
    class: string | string[];
    headerClass: string | string[];
}