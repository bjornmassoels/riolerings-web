
import { Group } from './groups';
import { User } from './user';
import { Photo } from './photo';


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


  public isSlokker: boolean;
  public isMeerwerk: boolean;
  isSchademelding: boolean;

  constructor() {
  }
}
