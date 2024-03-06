

export class TotaalMeetstaat {
  public _id: string;
  buisVoorHor: number;
  buisVoorVert: number;
  buisAchter: number;

  // nieuw

  buisVoorHorGres: number;
  buisVoorHorPVC: number;
  buisVoorHorPP: number;
  buisVoorVertGres: number;
  buisVoorVertPVC: number;
  buisVoorVertPP: number;
  bochtVoor: number;
  reductieVoor: number;

  indrukmof: number;

  yStuk: number;
  tBuis: number;
  tStuk: number;
  flexAan: number;
  mof: number;
  krimpmof: number;
  koppelstuk: number;
  stop: number;
  andere: number;
  kunststof: number;
  pvcTStuk: number;
  gietIjzer: number;
  betonKader: number;
  aluKader: number;
  buisAchterGres: number;

  buisAchterPVC: number;
  buisAchterPP: number;

  bochtAchter: number;

  gradenBochtVoor45: number;
  gradenBochtVoor90: number;
  gradenBochtAchter45: number;
  gradenBochtAchter90: number;

  YAchter: number;
  reductieAchter: number;
  funOmh: number;
  date: Date;
  geenPutje: number;
  anderPutje: number;
  aanslBovAfvoer: number;
  terugslagklep: number;
  infilPutje: number;
  sifonPutje: number;
  tPutje: number;
  constructor( buisVoorHor: number, buisVoorVert: number,buisAchter: number,buisVoorHorGres: number,buisVoorHorPVC: number,buisVoorHorPP: number,buisVoorVertGres: number,buisVoorVertPVC: number,buisVoorVertPP: number,bochtVoor: number,
  reductieVoor: number, indrukmof: number, yStuk: number, tBuis: number,tStuk: number,flexAan: number,mof: number,krimpmof: number,koppelstuk: number,
  stop: number,andere: number,kunststof: number,pvcTStuk: number,gietIjzer: number,betonKader: number,aluKader: number,buisAchterGres: number,
  buisAchterPVC: number,buisAchterPP: number,bochtAchter: number,YAchter: number,reductieAchter: number,funOmh: number, geenPutje: number,
               anderPutje: number, aanslBovAfvoer: number, terugslagklep: number,infilPutje: number, sifonPutje: number, tPutje: number,
               gradenBochtVoor45: number, gradenBochtAchter45: number, gradenBochtVoor90: number, gradenBochtAchter90: number) {
    this.buisVoorHor = buisVoorHor;
    this.buisVoorVert = buisVoorVert;
    this.buisAchter = buisAchter;
    this.buisVoorHorGres = buisVoorHorGres;
    this.buisVoorHorPVC = buisVoorHorPVC;
    this.buisVoorHorPP = buisVoorHorPP ;
    this.buisVoorVertGres = buisVoorVertGres ;
    this.buisVoorVertPVC = buisVoorVertPVC ;
    this.buisVoorVertPP = buisVoorVertPP ;
    this.bochtVoor = bochtVoor ;
    this.reductieVoor = reductieVoor ;
    this.indrukmof = indrukmof ;
    this.yStuk = yStuk ;
    this.tBuis = tBuis ;
    this.tStuk = tStuk ;
    this.flexAan = flexAan ;
    this.mof = mof ;
    this.krimpmof = krimpmof ;
    this.koppelstuk = koppelstuk ;
    this.stop = stop ;
    this.andere = andere ;
    this.kunststof = kunststof ;
    this.pvcTStuk = pvcTStuk ;
    this.gietIjzer = gietIjzer ;
    this.betonKader = betonKader ;
    this.aluKader = aluKader ;
    this.buisAchterGres = buisAchterGres ;
    this.buisAchterPVC = buisAchterPVC ;
    this.buisAchterPP = buisAchterPP ;
    this.bochtAchter = bochtAchter ;
    this.YAchter = YAchter ;
    this.reductieAchter = reductieAchter ;
    this.funOmh = funOmh ;
    this.geenPutje = geenPutje;
    this.anderPutje = anderPutje;
    this.aanslBovAfvoer = aanslBovAfvoer;
    this.terugslagklep = terugslagklep;
    this.infilPutje = infilPutje;
    this.sifonPutje = sifonPutje;
    this.tPutje = tPutje;
    this.gradenBochtVoor45 = gradenBochtVoor45;
    this.gradenBochtAchter45 = gradenBochtAchter45;
    this.gradenBochtVoor90 = gradenBochtVoor90;
    this.gradenBochtAchter90 = gradenBochtAchter90;
  }
}
