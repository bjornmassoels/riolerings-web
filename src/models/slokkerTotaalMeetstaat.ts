

export class SlokkerTotaalMeetstaat {
  public _id: number;
  public date: Date;
  indrukmof: number;
  tBuis: number;
  ytStuk: number;
  flexAan: number;
  //buis = buis horizontaal
  buis: number;
  buisVert: number;
  bocht: number;
  reductie: number;
  funOmh: number;
  mof: number;
  krimpmof: number;
  koppelstuk: number;
  stop: number;
  andere: number;

  infiltratieKolk: number;
  gradenBocht45: number;
  gradenBocht90: number;
  constructor( indrukmof: number,tBuis: number,ytStuk: number,flexAan: number,buis: number, buisVert: number,
               bocht: number,reductie: number,funOmh: number,mof: number,krimpmof: number,koppelstuk: number,
               stop: number,andere: number,infiltratieKolk: number, gradenBocht45: number, gradenBocht90: number) {
    this.indrukmof = indrukmof;
    this.tBuis = tBuis;
    this.ytStuk = ytStuk;
    this.flexAan = flexAan;
    this.buis = buis;
    this.buisVert = buisVert;
    this.bocht = bocht;
    this.reductie = reductie;
    this.funOmh = funOmh;
    this.mof = mof;
    this.krimpmof = krimpmof;
    this.koppelstuk = koppelstuk;
    this.stop = stop;
    this.andere = andere;
    this.infiltratieKolk = infiltratieKolk;
    this.gradenBocht45 = gradenBocht45;
    this.gradenBocht90 = gradenBocht90;
  }
}
