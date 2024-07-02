
import { Group } from './groups';
import { User } from './user';
import { Photo } from './photo';
import { Company } from './company';


export class Schademelding {
  public _id: string;
  group_id: Group;
  created: Date;
  createdDate: Date;
  date: Date;
  deleted: boolean;
  company_id: string;
  creator_user: User;
  ploegbaas: User;
  tegenPartij: string;
  hasBeenViewed: boolean;

  //schade
  schadeGerichtAan: string;
  schadeGerichtAanAndereString: string;
  schadeDoorWie: string;
  schadeDoorWat: string;
  soortActiviteit: string;
  soortActiviteitAndereString: string;
  oorzaakSchade: string;
  isLeidingPlanOpWerf: boolean;
  isLeidingVolgensPlan: boolean;
  diepteLeiding: number;
  leidingBeschermd: string;
  leidingBeschermdAndereString: string;
  diepteGraafwerken: number;
  plaatsVanWerken: string;
  plaatsVanWerkenAndereString: string;
  omschrijvingSchade: string;
  photos: Photo[];
  schets: string;

  // politie
  isMinnelijkeVaststelling: boolean;
  isProcesVerbaal: boolean;
  gemeentePolitie: string;
  isBetwistingMogelijk: boolean;

  //herstelling
  herstelUren: number;
  aantalPersonenHerstelling: number;
  startTijdHerstelling: Date;
  eindTijdHerstelling: Date;
  detailsHerstelling: string;

  //temp update voor pdf
  tempMachineNummer: string;


  isMeerwerk: boolean;
  isSchademelding: boolean;
  isSelected : boolean;

  //velden van meerwerk voor in zelfde lijst te kunnen loopen
  public projectNaam: string;
  public gemeente: string;
  public street: string;
  public huisNr: string;
  public opmerking: string;
  public minutesWorked: number;
  public lastWorker: User;
  public lastWorkerDate: Date;
  public startDate: Date;
  public postNumber: string;
  public countEmployees: number;
  id: string;
  xCoordGeoLocationFirsPhoto: number;
  yCoordGeoLocationFirsPhoto: number;
  updated: Date;

  constructor() {
  }
}
