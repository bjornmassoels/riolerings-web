enum TypeKolkEnum {
  Beton = 'Beton',
  Gietijzer = 'Gietijzer'
}

export class Slokkers {
    public _id: string;
    id: string;
    buis: number;
    buis2: number;
    buisVert: number;
    buisVert2: number;
    bocht2: number;
    bocht: number;
    gradenBocht45: number;
    gradenBocht90: number;
    gradenBocht45Fase2: number;
    gradenBocht90Fase2: number;
    reductie: number;
    Y: number;
    inDrukMof: boolean;
    tussenIPLinks: string;
    tussenIPRechts: string;
    afstandPutMof: number;
    diepteAansluitingMv: number;
    diepteAanboringRiool: number;
    mof: number;
    krimpmof: number;
    koppelstuk: number;
    stop: number;
    andere: string;
    buisType: string;
    infiltratieKlok: boolean;
    //oude variabele, voor invoeging aansluitingVrijeUitstroom 07/2024
    aansluitingOpengracht: boolean;
    //nieuwe var
    aansluitingVrijeUitstroom: string;
    plaatsAansluiting: string;
    diameter: string;
    tBuisStuk: string;
    xCoordGeoLocationFirsPhoto: number;
    yCoordGeoLocationFirsPhoto: number;
    //AWV toevoegingen
    xCoord: string;
    yCoord: string;
    zCoord: string;
    x2Coord: string;
    y2Coord: string;
    z2Coord: string;
    typeKolk: TypeKolkEnum;

    constructor() {
    }
}
