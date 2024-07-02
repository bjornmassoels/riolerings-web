import { dwaSettings } from "./dwaSettings";
import { rwaSettings } from "./rwaSettings";
import { slokkerSettings } from "./slokkerSettings";


export class Company {
    public _id: string;
    public id: string;
    public name: string;
    public email: string;
    public company_id: string;
    public code: string;
    public adminCode: string;
    public aantalAansluitingen: number;
    public aantalSlokkers: number;
    heeftSequenties: boolean;
    public monthsInContract: number;
    public aansluitingenLastMonth: number;
    public slokkersLastMonth: number;
    public logo: string;
    public hasGallery: boolean;
    public P0: number;
    public projectsPaid: number;
    public projectsUnPaid: number;
    public projectsDeleted: number;
    public slokkerProjectsPaid: number;
    public slokkerProjectsUnPaid: number;
    public slokkerProjectsDeleted: number;
    public totaalPrijs: number;
    prijsPerHA: number;
    prijsPerKolk: number;
    accountDeletionRequests: string[];


    constructor(

    ) {

    }
}
