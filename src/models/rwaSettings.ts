export class rwaSettings {

  public _id: string;
  //   public id: string;
  diepteRioleringHA: boolean = true;
    diepteAansluitingWoning: boolean = true;
    plaatsAansluiting: boolean = true;
    //nieuwe vars
    afstandPutMof: boolean = true;
    terugSlagKlep: boolean = true;
    ssGrond: boolean = true;
    mof: boolean = true;
    krimpMof: boolean = true;
    koppelStuk: boolean = true;
    stop: boolean = true;
    andere: boolean = true;
    lambertCoordinaten: boolean = true;
    //RWA vars
    aanslBovRwa: boolean = true;
    infilPutje: boolean = true;
    aanslOpenRwa: boolean = true;
    tPutje: boolean = true;

  constructor() {}
}
