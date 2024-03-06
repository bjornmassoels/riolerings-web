import { Company } from './company';
import {Group} from "./groups";
import {User} from "./user";

export class Meerwerk {
  public _id: string;
  public group_id: Group;
  public projectNaam: string;
  public gemeente: string;
  public street: string;
  public huisNr: string;
  public company_id: Company;
  public opmerking: string;
  public minutesWorked: number;
  public photos: string[];
  public lastWorker: User;
  public lastWorkerDate: Date;
  public deleted: boolean;
  public created: string;
  public createdDate: Date;
  public startDate: Date;
  public postNumber: string;
  public isMeerwerk: boolean;
  public countEmployees: number;
  id: string;
  xCoordGeoLocationFirsPhoto: number;
  yCoordGeoLocationFirsPhoto: number;

  constructor() {}
}
