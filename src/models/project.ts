import { Company } from './company';
import { Waterafvoer } from './waterafvoer';
import { Slokkers } from './slokkers';
import {Group} from "./groups";
import { User } from './user';

export class Project {
  public _id: string;
  public projectNr: string;
  public projectNaam: string;
  public gemeente: string;
  public street: string;
  public huisNr: string;
  public vanHuisNr: number;
  public totHuisNr:number;
  public equipMentArray: string[];
  public startDate: Date;
  public company_id: Company;
  public user_id: string;
  public index: string;
  public opmerking: string;
  public isSlokker: boolean;
  public finished: boolean;
  public droogWaterAfvoer: Waterafvoer;
  public regenWaterAfvoer: Waterafvoer;
  public group_id: Group;
  public photos: string[];
  public photosDWA: string[];
  public photosRWA:string[];
  public drawing: string;
  public drawingRWA: string;
  public created: string;
  public createdDate: Date;
  public latitudeList: number[];
  public longitudeList: number[];
  public slokker: Slokkers;
  public archived: boolean;
  public isSelected: boolean;
  public isWachtAansluiting: boolean;
  public deleted: boolean;
  public isGemengd: boolean;
  public naamFiche: string;
  public putje: boolean;
  public equipNrRiolering: string;
  public usersWhoEdited: User[];
  werfleider: string;
  id: string;
  heeftPloegen: boolean;

  public paid: boolean;
  public lastWorker: User;
  public lastWorkerDate: Date;
  afgewerktDatum: Date;
  // meerwerk
  public isMeerwerk: boolean;
  public minutesWorked: number;
  public postNumber: string;
  public countEmployees: number;
  bestandNaam: string;

  //tempvar voor overkoepling met project
  xCoordGeoLocationFirsPhoto: number;
  yCoordGeoLocationFirsPhoto: number;
  updated: Date;
  constructor() {}
}
