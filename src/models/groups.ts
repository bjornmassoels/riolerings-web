import { Company } from './company';
import { Project } from './project';
import { SlokkerProjects } from './slokker-projects';
import { Postnumbers } from './postnumbers';
import { SlokkerPostnumbers } from './slokker-postnumbers';
import { User } from './user';
import { dwaSettings } from './dwaSettings';
import { rwaSettings } from './rwaSettings';
import { slokkerSettings } from './slokkerSettings';
import {Meerwerk} from "./meerwerk";
import { TotaalMeetstaat } from './totaalMeestaat';
import { SlokkerTotaalMeetstaat } from './slokkerTotaalMeetstaat';
import { Schademelding } from './schademelding';

export class Group {
  public _id: string;
  public projectList: Project[];
  public slokkerProjectList: SlokkerProjects[];
  public meerwerkList: Meerwerk[];
  schademeldingList: Schademelding[];
  public street: string;
  public company_id: Company;
  public chosen: boolean;
  public deleted: boolean;
  public user_id: string;
  public created: string;
  public createdDate: Date;
  public totalProjectCount: number;
  public dwaPostNumbers: Postnumbers;
  public rwaPostNumbers: Postnumbers;
  public slokkerPostNumbers: SlokkerPostnumbers;
  public slokkerSettings: slokkerSettings;
  public dwaSettings: dwaSettings;
  public rwaSettings: rwaSettings;
  // public attachedUsers: User[];

  public archived: boolean;

  public rbNaam: string;
  public rbProjectNr: string;
  public rbProjectNaam: string;
  public rbGemeente: string;
  public rbPosten : boolean;
  public bhNaam: string;
  public bhProjectNr: string;
  public bhProjectNaam: string;
  public mogNaam: string;
  public mogNaam1: string;
  public mogNaam2: string;
  public mogProjectNr: string;
  public mogProjectNr1: string;
  public mogProjectNr2: string;
  public mogProjectNaam: string;
  public mogProjectNaam1: string;
  public mogProjectNaam2: string;
  public secondMogOn: boolean;
  public thirdMogOn: boolean;
  public aannemerProjectNr: string;
  public aannemerNaam: string;
  public aannemerWerfleider: string;

  public gemeenteCode: string;
  public heeftPloegen: boolean;
  public projectNr: string;
  public projectNaam: string;
  public gemeente: string;
  public chosenFirma: string;
  id: string;
  public isInUser: boolean;
  public users: User[];
  //berekening fum omh
  public yStukMult: number;
  public bochtMult: number;
  public mofMult: number;
  public buisVertMult: number;

  totalenMeetstaatDWA: TotaalMeetstaat[];
  totalenMeetstaatRWA : TotaalMeetstaat[];
  totalenMeetstaatKolk: SlokkerTotaalMeetstaat[];

  bochtenInGraden: boolean;
  possibleKolkStreets: string[];

  //popup settings schademelding
  gebruiktHerstellingBijSchademelding: boolean;
  gebruiktJurdischeInfoBijSchademelding: boolean;

  //tempvar
  haCount: number;
  kolkCount: number;

  //AWV velden
  isProjectForAWV: boolean;
  aidNummer: string;
  ident8: string;

  constructor() {}
}
