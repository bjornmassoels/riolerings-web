import { Materialen } from './materialen';
import { Sequentie } from './sequentie';

enum AfvoerType {
  'Regenwater afvoer' = 1,
  'Droogwater afvoer',
}
enum BuizenType {
  'Grès' = 1,
  'PVC',
}

export class Waterafvoer {
  public _id: string;
  buisVoorHor: number;
  buisVoorVert: number;
  buisAchter: number;
  YVoor: number;
  bochtVoor: number;
  bochtAchter: number;
  YAchter: number;
  reductieVoor: number;
  reductieVoor2: number;
  buisVoorHor2: number;
  buisVoorVert2: number;
  bochtVoor2: number;
  reductieAchter: number;
  buisType: string;
  gietijzer: boolean;
  betonkader:boolean;
  alukader: boolean;
  inDrukMof: boolean;
  tBuisStuk: string;
  diameterAchter: string;

  //aquafin
  diepteRioleringHA: number;
  diepteAansluitingWoning: number;
  tussenIPLinks: string;
  tussenIPRechts: string;
  plaatsAansluiting: number;

  // uniform
  diameter: string;
  diameterAndere: string;
  ligging: string;
  liggingAndere: string;
  afstandPutMof: number;
  terugslagklep: boolean;
  diameterPut: number;
  letterHor: string;
  putHor: number;
  letterVer: string;
  putVer: number;
  mof: number;
  krimpmof: number;
  koppelstuk: number;
  stop: number;
  andere: string;
  xCoord: string;
  yCoord: string;
  zCoord: string;
  public putje: boolean;
  soortPutje: string;
  anderPutje: string;
  // uniform RWA vars
  aanslBovRWA: number;
  infilPutje: boolean;
  aanslOpenRWA: boolean;
  isPP: boolean;
  isWachtaansluiting: boolean;
  buisTypeAchter: string;
  diameterAchterAndere: string;
  hasChangedMateriaalBuis: boolean;
  hasChangedDiameterBuis: boolean;
  sifonPutje: number;
  tPutje: number;
  gradenBochtVoor45: number;
  gradenBochtVoor90: number;
  gradenBocht2Voor45: number;
  gradenBocht2Voor90: number;
  gradenBochtAchter45: number;
  gradenBochtAchter90: number;
  xCoordGeoLocationFirsPhoto: number;
  yCoordGeoLocationFirsPhoto: number;

  constructor() {}
}
