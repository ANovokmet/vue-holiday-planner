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

export interface Resource {
    id: number;
    title: string;
    subtitle?: string;
    img?: string;
    days: { date: Dayjs; class: string | string[]; }[];
}