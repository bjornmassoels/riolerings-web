import { Company } from "./company";
import {Slokkers} from './slokkers';
import {Group} from "./groups";
import { User } from "./user";

export class SlokkerProjects {
  public _id: string;
  public projectNr: string;
  public projectNaam: string;
  public gemeente: string;
  public street: string;
  public huisNr: string;
  public startDate: Date;
  public index: string;
  public company_id: Company;
  public user_id: string;
  public isSlokker: boolean;
  public opmerking: string;
  public slokker: Slokkers;
  public photos: string[];
  public finished: boolean;
  public created: string;
  public group_id: Group;
  public createdDate: Date;
  public latitudeList: number[];
  public longitudeList: number[];
  public naamFiche: string;
  public equipNrRiolering: string;
  public usersWhoEdited: User[];
  public werfleider: string;
  public isMeerwerk: boolean;
  public paid: boolean;
  public lastWorker: User;
  public lastWorkerDate: Date;
  public postNumber: string;
  afgewerktDatum: Date;
  updated: Date;


  id: string;
  constructor() {}
}
