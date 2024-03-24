import { Waterafvoer } from '../models/waterafvoer';
import { Postnumbers } from '../models/postnumbers';
import { SlokkerPostnumbers } from '../models/slokker-postnumbers';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { Group } from '../models/groups';
import * as fs from 'file-saver';
import { dwaSettings } from '../models/dwaSettings';
import { TotaalMeetstaat } from '../models/totaalMeestaat';
import { SlokkerTotaalMeetstaat } from '../models/slokkerTotaalMeetstaat';
import { slokkerSettings } from '../models/slokkerSettings';
import { group } from '@angular/animations';
@Injectable()
export class NieuweExcelService {
  constructor(private apiService: ApiService) {
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function() {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }


  generateNewExcel(title: string, headers: string[], dataList: Group, logoURL: string, companyName: string, isVordering: boolean) {
    let workbook = new Workbook();
    let dwaPostNumbers = dataList.dwaPostNumbers;
    if (dwaPostNumbers == null) {
      dwaPostNumbers = new Postnumbers();
    }
    let rwaPostNumbers = dataList.rwaPostNumbers;
    if (rwaPostNumbers == null) {
      rwaPostNumbers = new Postnumbers();
    }
    let slokkerPostNumbers = dataList.slokkerPostNumbers;
    if (slokkerPostNumbers == null) {
      slokkerPostNumbers = new SlokkerPostnumbers();
    }
    let worksheet = workbook.addWorksheet('Blad1 DWA', {
      views: [{ state: "frozen", ySplit: 6 }],
    });

    let buisVertMult = 1;
    let yStukMult = 0.5;
    let bochtMult = 0.3;
    let mofMult = 0.15;

    if(dataList.yStukMult != null){
      yStukMult = dataList.yStukMult;
    }
    if(dataList.bochtMult != null){
      bochtMult = dataList.bochtMult;
    }
    if(dataList.mofMult != null){
      mofMult = dataList.mofMult;
    }
    if(dataList.buisVertMult != null){
      buisVertMult = dataList.buisVertMult;
    }
    // Add new row
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    titleRow.height = 23;
    worksheet.mergeCells('A1:I1');
    worksheet.mergeCells('N1:U1');
    titleRow.getCell('N').value = '  Bedrijf: ' + companyName;
    titleRow.getCell('W').value = 'Berekening fundering/omhulling:';

    if (dataList.projectList.length !== 0) {
      let locationRow = worksheet.addRow([
        dataList.aannemerProjectNr + ' - ' + dataList.rbProjectNaam +
        ' - ' + dataList.rbGemeente
      ]);
      locationRow.font = {
        name: 'Arial',
        family: 4,
        size: 13,
        bold: true,
      };
      locationRow.height = 20;
      locationRow.getCell('W').value = 'Buis vert: x' + buisVertMult + ', Bocht: x' + bochtMult +
        ", Y-Stuk: x" + yStukMult + ", Indrukmof: x" + mofMult;

    }
    worksheet.mergeCells('A2:I2');
    //CHECK VOOR NIET GEBRUIKTE VARIABELEN
    console.log(dataList.dwaSettings)
    let notUsedVariableCount = 0;
    let secondNotUsedVariableCount = 0;
    let thirdNotUsedVariableCount = 0;
    if(!dataList.bochtenInGraden){
      notUsedVariableCount++;
    }
    if (!dataList.dwaSettings.mof) {
      notUsedVariableCount++;
    }
    if (!dataList.dwaSettings.krimpMof) {
      notUsedVariableCount++;
    }
    if (!dataList.dwaSettings.koppelStuk) {
      notUsedVariableCount++;
    }
    if (!dataList.dwaSettings.stop) {
      notUsedVariableCount++;
    }
    if (!dataList.dwaSettings.andere) {
      notUsedVariableCount++;
    }
    if (!dataList.dwaSettings.terugSlagKlep) {
      notUsedVariableCount++;
    }
    if (!dataList.dwaSettings.sifonPutje) {
      secondNotUsedVariableCount++;
    }
    if (!dataList.dwaSettings.tPutje) {
      secondNotUsedVariableCount++;
    }
    if(!dataList.bochtenInGraden){
      thirdNotUsedVariableCount++;
    }
    let kolommen = ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO'];

    let indexEndVoorPutje = 7 - notUsedVariableCount;
    let eindVoorPutje = kolommen[indexEndVoorPutje];

    let indexStartPutjeEnSoortPutje = 9 - notUsedVariableCount;
    let startPutjeEnSoortPutje = kolommen[indexStartPutjeEnSoortPutje];

    let indexEindSoortPutje = 12 - notUsedVariableCount;
    let eindSoortPutje = kolommen[indexEindSoortPutje];

    let indexBeginPutKader = 15 - (notUsedVariableCount + secondNotUsedVariableCount);
    let beginPutKader = kolommen[indexBeginPutKader];

    let indexEindPutKader = 17 - (notUsedVariableCount + secondNotUsedVariableCount);
    let eindPutKader = kolommen[indexEindPutKader];

    let indexBeginNaPutje = 18 - (notUsedVariableCount + secondNotUsedVariableCount);
    let beginNaPutje = kolommen[indexBeginNaPutje];

    let indexEindBuisNaPut = 20 - (notUsedVariableCount + secondNotUsedVariableCount);
    let eindBuisNaPut = kolommen[indexEindBuisNaPut];

    let indexStukkenNaPut = 21 - (notUsedVariableCount + secondNotUsedVariableCount);
    let stukkenNaPut = kolommen[indexStukkenNaPut]

    let indexEindPut = 24 - (notUsedVariableCount + secondNotUsedVariableCount + thirdNotUsedVariableCount);
    let eindNaPut = kolommen[indexEindPut]

    console.log(notUsedVariableCount)
    let putjesRow = worksheet.addRow(['', '', '', 'VOOR PUTJE']);
    putjesRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    putjesRow.height = 18;
    putjesRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A3:C3');
    putjesRow.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EEECE1' },
      bgColor: { argb: '000080' },
    };
    putjesRow.getCell('A').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet.mergeCells('D3:I3');
    putjesRow.getCell('J').value = 'VOOR PUTJE'
    worksheet.mergeCells('J3:' + eindVoorPutje + '3');
    putjesRow.getCell(startPutjeEnSoortPutje).value = 'PUTJE';
    worksheet.mergeCells(startPutjeEnSoortPutje + '3:' + eindPutKader + '3');
    putjesRow.getCell(beginNaPutje).value = 'NA PUTJE';
    worksheet.mergeCells(beginNaPutje + '3:' + eindNaPut + '3');
    putjesRow.getCell(kolommen[indexEndVoorPutje+1]).border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    putjesRow.getCell(kolommen[indexEndVoorPutje+1]).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEDFF' },
      bgColor: { argb: '000080' },
    };

    //STANDAARD INDEX VANAF R =
    putjesRow.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number === 4 || number === 10) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FABF8F' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (indexStartPutjeEnSoortPutje + 16)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (indexBeginNaPutje + 16)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F79646' },
          bgColor: { argb: '000080' },
        };
      }


    });
    let postenRow = worksheet.addRow(['Postnummers']);
    worksheet.mergeCells('A4:C4');
    postenRow.font = { name: 'Arial', family: 4, size: 12 };
    postenRow.alignment = {horizontal:'center'}
    postenRow.getCell('D').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorHorGres);
    postenRow.getCell('E').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorHorPVC);
    postenRow.getCell('F').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorHorPP);

    postenRow.getCell('G').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorVertGres);
    postenRow.getCell('H').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorVertPVC);
    postenRow.getCell('I').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorVertPP);
    postenRow.getCell('J').value = this.PostNumberNullToString(dwaPostNumbers.indrukmof);
    postenRow.getCell('K').value = this.PostNumberNullToString(dwaPostNumbers.yStuk);
    postenRow.getCell('L').value = this.PostNumberNullToString(dwaPostNumbers.tBuis);
    postenRow.getCell('M').value = this.PostNumberNullToString(dwaPostNumbers.tStuk);
    postenRow.getCell('N').value = this.PostNumberNullToString(dwaPostNumbers.flexAan);
    postenRow.getCell('O').value = this.PostNumberNullToString(dwaPostNumbers.reductieVoor);

    let indexCount = 0;
    if(!dataList.bochtenInGraden){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bochtVoor);
      indexCount++;
    } else {
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bocht45Voor);
      indexCount++;
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bocht90Voor);
      indexCount++;
    }
    if(dataList.dwaSettings.mof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.mof);
      indexCount++;
    }
    if(dataList.dwaSettings.krimpMof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.krimpmof);
      indexCount++;
    }
    if(dataList.dwaSettings.koppelStuk){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.koppelstuk);
      indexCount++;
    }
    if(dataList.dwaSettings.stop){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.stop);
      indexCount++;
    }
    if(dataList.dwaSettings.andere){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.andere);
      indexCount++;
    }
    if(dataList.dwaSettings.terugSlagKlep){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.terugslagKlep);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.funOmh);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.kunststof);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.pvcTStuk);
    indexCount += 3;
    if(dataList.dwaSettings.sifonPutje){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.sifonPutje);
      indexCount++;
    }
    if(dataList.dwaSettings.tPutje){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.tPutje);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.gietIjzer);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.betonKader);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.aluKader);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.buisAchterGres);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.buisAchterPVC);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.buisAchterPP);
    indexCount++;
    if(!dataList.bochtenInGraden){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bochtAchter);
      indexCount++;
    } else {
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bocht45Achter);
      indexCount++;
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bocht90Achter);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.reductieAchter);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.YAchter);
    postenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    let putjesRow2 = worksheet.addRow(['', '', '', 'BUIS HORIZONTAAL']);
    putjesRow2.font = { name: 'Arial', family: 4, size: 13, bold: true };
    putjesRow2.height = 18;
    putjesRow2.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A5:C5');
    putjesRow2.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EEECE1' },
      bgColor: { argb: '000080' },
    };
    putjesRow2.getCell('A').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet.mergeCells('D5:F5');
    putjesRow2.getCell('G').value = 'BUIS VERTICAAL';
    worksheet.mergeCells('G5:I5');
    putjesRow2.getCell('J').value = 'HOEVEELHEDEN VOOR PUTJE';
    worksheet.mergeCells('J5:' + eindVoorPutje + '5');
    putjesRow2.getCell(kolommen[indexEndVoorPutje+1]).value = 'Fun/omh';
    putjesRow2.getCell(startPutjeEnSoortPutje).value = 'SOORT PUTJE';
    worksheet.mergeCells(startPutjeEnSoortPutje + '5:' + eindSoortPutje + '5');
    putjesRow2.getCell(beginPutKader).value = 'PUTKADERS';
    worksheet.mergeCells(beginPutKader + '5:' + eindPutKader + '5');
    putjesRow2.getCell(beginNaPutje).value = 'BUIS NA PUTJE';
    worksheet.mergeCells(beginNaPutje + '5:' + eindBuisNaPut + '5');
    putjesRow2.getCell(stukkenNaPut).value = 'STUKKEN NA PUTJE';
    worksheet.mergeCells(stukkenNaPut + '5:' + eindNaPut + '5');


    putjesRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number === 4 || number === 7 || number === 10) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FABF8F' },
          bgColor: { argb: '000080' },
        };
      } else if ((number === (indexStartPutjeEnSoortPutje + 16)) || (number === (indexBeginPutKader + 16) )){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if ((number === (indexBeginNaPutje + 16)) || (number === (indexStukkenNaPut + 16))) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F79646' },
          bgColor: { argb: '000080' },
        };
      } else if (number === indexEndVoorPutje + 17) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEDFF' },
          bgColor: { argb: '000080' },
        };
      } else if(number === (indexBeginPutKader + 14)){
        if(dataList.dwaSettings.sifonPutje && dataList.dwaSettings.tPutje){
          cell.border = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' },
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EEECE1' },
            bgColor: { argb: '000080' },
          };
        }
      } else if(number === (indexBeginPutKader + 15)){
        if(dataList.dwaSettings.sifonPutje || dataList.dwaSettings.tPutje){
          cell.border = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' },
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EEECE1' },
            bgColor: { argb: '000080' },
          };
        }
      }
    });

    let stukkenRow = worksheet.addRow(['Straat', 'Huisnr.', 'Volgnr.', 'Gres','PVC','PP', 'Gres','PVC','PP','Indrukmof', 'Y-Stuk', 'T-Buis',
    'T-Stuk', 'Flex. aansl.', 'Reductie']);
    stukkenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    stukkenRow.height = 18;
    stukkenRow.alignment = { vertical: 'middle', horizontal: 'center' };
    indexCount = 0;

    if(!dataList.bochtenInGraden){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht';
      indexCount++;
    } else {
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 45°';
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 90°';
      indexCount++;
    }
    if(dataList.dwaSettings.mof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Mof';
      indexCount++;
    }
    if(dataList.dwaSettings.krimpMof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Krimpmof';
      indexCount++;
    }
    if(dataList.dwaSettings.koppelStuk){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Koppelstuk';
      indexCount++;
    }
    if(dataList.dwaSettings.stop){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Stop';
      indexCount++;
    }
    if(dataList.dwaSettings.andere){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Andere';
      indexCount++;
    }
    if(dataList.dwaSettings.terugSlagKlep){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Terugslagklep';
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Fun/omh';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Kunststof';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PVC T-Stuk';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Geen';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Andere';
    indexCount++;
    if(dataList.dwaSettings.sifonPutje){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Sifonput';
      indexCount++;
    }
    if(dataList.dwaSettings.tPutje){
      stukkenRow.getCell(kolommen[indexCount]).value = 'T-putje';
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Gietijzer';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Beton';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Alu';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Gres';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PVC';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PP';
    indexCount++;
    if(!dataList.bochtenInGraden){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht';
      indexCount++;
    } else {
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 45°';
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 90°';
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Reductie';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Y-Stuk';

    stukkenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number <= 3) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      }else if (number > 3 && number <= (23 - notUsedVariableCount)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FABF8F' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (24 - notUsedVariableCount)){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEDFF' },
          bgColor: { argb: '000080' },
        };
      }else if (number > (24 - notUsedVariableCount) && number <= (33 - (notUsedVariableCount + secondNotUsedVariableCount))){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if (number > (33 - (notUsedVariableCount + secondNotUsedVariableCount)) && number <= (40 - (notUsedVariableCount + secondNotUsedVariableCount + thirdNotUsedVariableCount))){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F79646' },
          bgColor: { argb: '000080' },
        };
      }
    });

    let buisVoorHorGresCount = 0;
    let buisVoorHorPVCCount = 0;
    let buisVoorHorPPCount = 0;
    let buisVoorVertGresCount = 0;
    let buisVoorVertPVCCount = 0;
    let buisVoorVertPPCount = 0;
    let bochtVoorCount = 0;
    let bochtVoor45Count = 0;
    let bochtVoor90Count = 0;
    let bochtAchter45Count = 0;
    let bochtAchter90Count = 0;
    let indrukmofCount = 0;
    let yStukCount = 0;
    let tBuisCount = 0;
    let tStukCount = 0;
    let flexAanCount = 0;
    let reductieVoorCount = 0;
    let mofCount = 0;
    let krimpmofCount = 0;
    let koppelstukCount = 0;
    let stopCount = 0;
    let andereCount = 0;
    let funOmhCount = 0;
    let kunststofCount = 0;
    let pvcTStukCount = 0;
    let geenPutjeCount = 0;
    let anderPutjeCount = 0;
    let gietIjzerCount = 0;
    let betonKaderCount = 0;
    let aluKaderCount = 0;
    let buisAchterGresCount = 0;
    let buisAchterPVCCount = 0;
    let buisAchterPPCount = 0;
    let bochtAchterCount = 0;
    let reductieAchterCount = 0;
    let YAchterCount = 0;
    let totalRowCount = 0;
    let terugslagklepCount = 0;
    let sifonPutjeCount = 0;
    let tPutjeCount = 0;
    for (let data of dataList.projectList) {
      let project = data;
      if(project.droogWaterAfvoer != null && this.checkHasDWA(project.droogWaterAfvoer)) {
        totalRowCount++;
        let buisVoorHorGres = 0;
        let buisVoorHorPVC = 0;
        let buisVoorHorPP = 0;
        let buisVoorVertGres = 0;
        let buisVoorVertPVC = 0;
        let buisVoorVertPP = 0;
        let buisAchterGres = 0;
        let buisAchterPVC = 0;
        let buisAchterPP = 0;
        if(project.droogWaterAfvoer.buisTypeAchter == null){
          switch(project.droogWaterAfvoer.buisType){
            case null: {
              break;
            }
            case 'Gres': {
              buisVoorHorGresCount += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertGresCount +=   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              buisAchterGresCount += this.NullToZero(project.droogWaterAfvoer.buisAchter);
              buisVoorHorGres = this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertGres =   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              buisAchterGres = this.NullToZero(project.droogWaterAfvoer.buisAchter);
              break;
            }
            case 'PVC': {
              buisVoorHorPVCCount += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertPVCCount +=   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              buisAchterPVCCount += this.NullToZero(project.droogWaterAfvoer.buisAchter);
              buisVoorHorPVC = this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertPVC =   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              buisAchterPVC = this.NullToZero(project.droogWaterAfvoer.buisAchter);
              break;
            }
            case 'PP': {
              buisVoorHorPPCount += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertPPCount +=   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              buisAchterPPCount += this.NullToZero(project.droogWaterAfvoer.buisAchter);
              buisVoorHorPP = this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertPP =   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              buisAchterPP = this.NullToZero(project.droogWaterAfvoer.buisAchter);
              break;
            }
          }
        } else {
          switch(project.droogWaterAfvoer.buisType){
            case null: {
              break;
            }
            case 'Gres': {
              buisVoorHorGresCount += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertGresCount +=   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              buisVoorHorGres = this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertGres =   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              break;
            }
            case 'PVC': {
              buisVoorHorPVCCount += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertPVCCount +=   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              buisVoorHorPVC = this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertPVC =   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              break;
            }
            case 'PP': {
              buisVoorHorPPCount += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertPPCount +=   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              buisVoorHorPP = this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
              buisVoorVertPP =   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
              break;
            }
          }
          switch(project.droogWaterAfvoer.buisTypeAchter){
            case null: {
              break;
            }
            case 'Gres': {
              buisAchterGresCount += this.NullToZero(project.droogWaterAfvoer.buisAchter);
              buisAchterGres = this.NullToZero(project.droogWaterAfvoer.buisAchter);
              break;
            }
            case 'PVC': {
              buisAchterPVCCount += this.NullToZero(project.droogWaterAfvoer.buisAchter);
              buisAchterPVC = this.NullToZero(project.droogWaterAfvoer.buisAchter);
              break;
            }
            case 'PP': {
              buisAchterPPCount += this.NullToZero(project.droogWaterAfvoer.buisAchter);
              buisAchterPP = this.NullToZero(project.droogWaterAfvoer.buisAchter);
              break;
            }
          }
        }

        if(!dataList.bochtenInGraden){
          bochtVoorCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2);
          bochtAchterCount += this.NullToZero(project.droogWaterAfvoer.bochtAchter);
        }
        else {
          bochtVoor45Count += this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor45);
          bochtVoor90Count += this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor90);
          bochtAchter45Count += this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter45);
          bochtAchter90Count += this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter90);
        }
        reductieVoorCount += this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2);
        reductieAchterCount += this.NullToZero(project.droogWaterAfvoer.reductieAchter);
        YAchterCount += this.NullToZero(project.droogWaterAfvoer.YAchter);

        if (project.droogWaterAfvoer.alukader != null && project.droogWaterAfvoer.alukader === true && !project.droogWaterAfvoer.gietijzer) {
          aluKaderCount++;
        }
        if (project.droogWaterAfvoer.betonkader != null && project.droogWaterAfvoer.betonkader === true && project.droogWaterAfvoer.gietijzer ) {
          betonKaderCount++;
        }
        if (project.droogWaterAfvoer.gietijzer != null && project.droogWaterAfvoer.gietijzer === true) {
          gietIjzerCount++;
        }
        let indrukmof = 0;
        let tBuis = 0;
        let tStuk = 0;
        let yStuk = 0;
        let kunststof = 0;
        let geenPutje = 0;
        let anderPutje = '';
        let flexAansluiting = 0;
        let pvcTStuk = 0;
        let terugslagklep = 0;
        switch (project.droogWaterAfvoer.tBuisStuk) {
          case 'aanboring':
            indrukmofCount++;
            indrukmof = 1;
            break;
          case 'T-Buis':
            tBuisCount++;
            tBuis = 1;
            break;
          case 'T-Stuk':
            tStuk = 1;
            tStukCount++;
            break;
          case 'Y-Stuk':
            yStuk = 1;
            yStukCount++;
            break;
          case 'flexAan':
            flexAansluiting = 1;
            flexAanCount++;
            break;
        }
        if(project.droogWaterAfvoer.soortPutje === 't-stuk'){
          pvcTStukCount++;
          pvcTStuk += 1;
        } else if(project.droogWaterAfvoer.soortPutje === 'kunststof'){
          kunststofCount += 1;
          kunststof = 1;
        } else if(project.droogWaterAfvoer.soortPutje === 'geen'){
          geenPutjeCount++;
          geenPutje = 1;
        }  else if(project.droogWaterAfvoer.soortPutje === 'andere'){
          anderPutjeCount++;
          anderPutje = project.droogWaterAfvoer.anderPutje;
        }

        if(dataList.dwaSettings.terugSlagKlep === true && project.droogWaterAfvoer.terugslagklep === true){
          terugslagklep = 1;
          terugslagklepCount++;
        }
        sifonPutjeCount += this.NullToZero(project.droogWaterAfvoer.sifonPutje);
        tPutjeCount += this.NullToZero(project.droogWaterAfvoer.tPutje);

        let funOmh = 0;
        if(!dataList.bochtenInGraden){
          funOmh =
            this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2) +
            (this.NullToZero(project.droogWaterAfvoer.buisVoorVert) * buisVertMult) + (this.NullToZero(project.droogWaterAfvoer.buisVoorVert2) * buisVertMult) +
            ((this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)) * bochtMult) +
            (this.NullToZero(yStuk * yStukMult)) +
            (this.NullToZero(indrukmof) * mofMult);
          funOmhCount += +funOmh;
        } else {
          funOmh =
            this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2) +
            (this.NullToZero(project.droogWaterAfvoer.buisVoorVert) * buisVertMult) + (this.NullToZero(project.droogWaterAfvoer.buisVoorVert2) * buisVertMult) +
            ((this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor45) +
            this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor90)) * bochtMult) +
            (this.NullToZero(yStuk * yStukMult)) +
            (this.NullToZero(indrukmof) * mofMult);
          funOmhCount += +funOmh;
        }
        let funOmhString = +(funOmh.toFixed(2));

        let dataRow = worksheet.addRow([
          project?.street,
          project?.huisNr,
          project?.index,
          this.ConvertNumberToEmptyString(buisVoorHorGres),
          this.ConvertNumberToEmptyString(buisVoorHorPVC),
          this.ConvertNumberToEmptyString(buisVoorHorPP),
          this.ConvertNumberToEmptyString(buisVoorVertGres),
          this.ConvertNumberToEmptyString(buisVoorVertPVC),
          this.ConvertNumberToEmptyString(buisVoorVertPP),
          this.ConvertNumberToEmptyString(indrukmof),
          this.ConvertNumberToEmptyString(yStuk),
          this.ConvertNumberToEmptyString(tBuis),
          this.ConvertNumberToEmptyString(tStuk),
          this.ConvertNumberToEmptyString(flexAansluiting),
          this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2))
        ]);
       dataRow.font = { name: 'Arial', family: 4, size: 12};
        let indexCount = 0;
        if(!dataList.bochtenInGraden){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2));
          indexCount++;
        } else {
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor45));
          indexCount++;
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor90));
          indexCount++;
        }
        if(dataList.dwaSettings.mof){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.mof);
          mofCount += this.NullToZero(project.droogWaterAfvoer.mof);
          indexCount++;
        }
        if(dataList.dwaSettings.krimpMof){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.krimpmof);
          krimpmofCount += this.NullToZero(project.droogWaterAfvoer.krimpmof);
          indexCount++;
        }
        if(dataList.dwaSettings.koppelStuk){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.koppelstuk);
          koppelstukCount += this.NullToZero(project.droogWaterAfvoer.koppelstuk);
          indexCount++;
        }
        if(dataList.dwaSettings.stop){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.stop);
          stopCount += this.NullToZero(project.droogWaterAfvoer.stop);
          indexCount++;
        }
        if(dataList.dwaSettings.andere){
          dataRow.getCell(kolommen[indexCount]).value = project.droogWaterAfvoer.andere;
          if(project.droogWaterAfvoer.andere != null && project.droogWaterAfvoer.andere.trim() !== ''){
            andereCount++;
          }
          indexCount++;
        }
        if(dataList.dwaSettings.terugSlagKlep){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(terugslagklep);
          indexCount++;
        }
        dataRow.getCell(kolommen[indexCount]).value = funOmhString;
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(kunststof);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(pvcTStuk);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(geenPutje);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = anderPutje;
        indexCount++;
        if(dataList.dwaSettings.sifonPutje){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.sifonPutje);
          indexCount++;
        }
        if(dataList.dwaSettings.tPutje){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.tPutje);
          indexCount++;
        }
        dataRow.getCell(kolommen[indexCount]).value = this.BoolToString(project.droogWaterAfvoer.gietijzer);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(buisAchterGres)
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(buisAchterPVC)
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(buisAchterPP)
        indexCount++;
        if(!dataList.bochtenInGraden){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter)
          indexCount++;
        } else {
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.gradenBochtAchter45)
          indexCount++;
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.gradenBochtAchter90)
          indexCount++;
        }

        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter)
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter)
        indexCount++;
      }
    }
    funOmhCount = +funOmhCount.toFixed(2);
    buisVoorHorGresCount = +buisVoorHorGresCount.toFixed(2);
    buisVoorHorPVCCount = +buisVoorHorPVCCount.toFixed(2);
    buisVoorHorPPCount = +buisVoorHorPPCount.toFixed(2);
    buisVoorVertGresCount = +buisVoorVertGresCount.toFixed(2);
    buisVoorVertPVCCount = +buisVoorVertPVCCount.toFixed(2);
    buisVoorVertPPCount = +buisVoorVertPPCount.toFixed(2);
    bochtVoorCount = +bochtVoorCount.toFixed(2);
    bochtVoor45Count = +bochtVoor45Count.toFixed(2);
    bochtVoor90Count = +bochtVoor90Count.toFixed(2);
    bochtAchter45Count = +bochtAchter45Count.toFixed(2);
    bochtAchter90Count = +bochtAchter90Count.toFixed(2);
    indrukmofCount = +indrukmofCount.toFixed(2);
    yStukCount = +yStukCount.toFixed(2);
    tBuisCount = +tBuisCount.toFixed(2);
    tStukCount = +tStukCount.toFixed(2);
    flexAanCount = +flexAanCount.toFixed(2);
    reductieVoorCount = +reductieVoorCount.toFixed(2);
    buisAchterGresCount = +buisAchterGresCount.toFixed(2);
    buisAchterPVCCount = +buisAchterPVCCount.toFixed(2);
    buisAchterPPCount = +buisAchterPPCount.toFixed(2);
    terugslagklepCount = +terugslagklepCount.toFixed(2);

    let counter = 0;
    let totaalExtraPreviousTotalen = 0;
    if(dataList.totalenMeetstaatDWA != null && dataList.totalenMeetstaatDWA.length !== 0){
      totaalExtraPreviousTotalen = dataList.totalenMeetstaatDWA.length;

      for(let vorige of dataList.totalenMeetstaatDWA){
        counter++;
        let vorigeTotalenRow = worksheet.addRow([(counter === dataList.totalenMeetstaatDWA.length ? 'Laatste vorige totalen' : 'Vorige totalen'),
          'Datum:', new Date(vorige.date).toLocaleDateString(), vorige.buisVoorHorGres, vorige.buisVoorHorPVC, vorige.buisVoorHorPP,
          vorige.buisVoorVertGres, vorige.buisVoorVertPVC, vorige.buisVoorVertPP, vorige.indrukmof,
          vorige.yStuk, vorige.tBuis, vorige.tStuk, vorige.flexAan, vorige.reductieVoor]);
        vorigeTotalenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
        vorigeTotalenRow.height = 18;
        vorigeTotalenRow.alignment = { vertical: 'middle', horizontal: 'center' };
        indexCount = 0;

        if(!dataList.bochtenInGraden){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.bochtVoor;
          indexCount++;
        } else {
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gradenBochtVoor45;
          indexCount++;
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gradenBochtVoor90;
          indexCount++;
        }
        if(dataList.dwaSettings.mof){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.mof;
          indexCount++;
        }
        if(dataList.dwaSettings.krimpMof){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.krimpmof;
          indexCount++;
        }
        if(dataList.dwaSettings.koppelStuk){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.koppelstuk;
          indexCount++;
        }
        if(dataList.dwaSettings.stop){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.stop;
          indexCount++;
        }
        if(dataList.dwaSettings.andere){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.andere;
          indexCount++;
        }
        if(dataList.dwaSettings.terugSlagKlep){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.terugslagklep;
          indexCount++;
        }
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.funOmh;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.kunststof;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.pvcTStuk;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.geenPutje;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.anderPutje;
        indexCount++;
        if(dataList.dwaSettings.sifonPutje){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.sifonPutje;
          indexCount++;
        }
        if(dataList.dwaSettings.tPutje){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.tPutje;
          indexCount++;
        }
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gietIjzer;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.betonKader;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.aluKader;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.buisAchterGres;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.buisAchterPVC ;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.buisAchterPP;
        indexCount++;
        if(!dataList.bochtenInGraden){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.bochtAchter;
          indexCount++;
        } else {
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gradenBochtAchter45;
          indexCount++;
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gradenBochtAchter90;
          indexCount++;
        }
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.reductieAchter;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.YAchter;
        indexCount++;
        if(counter === dataList.totalenMeetstaatDWA.length){
          vorigeTotalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '44c7dbFF' },
              bgColor: { argb: '44db58FF' },
            };
            cell.border = {
              top: { style: 'medium' },
              left: { style: 'medium' },
              bottom: { style: 'medium' },
              right: { style: 'medium' },
            };
          });
        } else {
          vorigeTotalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }
      }
    }

    let allStrings = ['VOOR PUTJE','PUTJE','NA PUTJE','BUIS HORIZONTAAL', 'BUIS VERTICAAL','HOEVEELHEDEN VOOR PUTJE','SOORT PUTJE','PUTKADERS','BUIS NA PUTJE','STUKKEN NA PUTJE',
      'Huis- en wachtaansluitingen RWA', 'Huis- en wachtaansluitingen DWA',('  Bedrijf: ' + companyName),  'Postnummers',
      'Berekening fundering/omhulling:', 'Buis vert: x' + buisVertMult + ', Bocht: x' + bochtMult + ", Y-Stuk: x" + yStukMult + ", Indrukmof: x" + mofMult, 'Kolken','Bedrijf: ' + companyName,
      dataList.aannemerProjectNr + ' - ' + dataList.rbProjectNaam + ' - ' + dataList.rbGemeente];
    worksheet.columns.forEach(function (column, i) {
      if((i >= 1 && i < 10) || (i >= 11 && i <= 13) || (i >= 27 - notUsedVariableCount && i <= 33 - notUsedVariableCount)){
        column.width = 11;
      } else if(i === 10) {
        column.width = 13;
      } else{
        let maxLength = 0;
        column["eachCell"]({ includeEmpty: true }, function (cell) {
          if(!allStrings.find(x => x === cell.value)){
            let columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength ) {
              maxLength = columnLength;
            }
          }
        });
        column.width = maxLength < 11 ? 11 : maxLength + 3;
        if(i === 0){
          column.width = 25;
        }  else if(maxLength >= 8 && maxLength < 10){
          column.width = maxLength < 13 ? 13 : maxLength + 2;
        } else if(maxLength >= 10 && maxLength < 13){
          column.width = 14;
        } else if(maxLength >= 13){
          column.width = 16;
        }
      }
    });
    let totaalKolommen = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN'];
    let eindKolomNewData = 6 + totalRowCount;

    if(totaalExtraPreviousTotalen > 0){
      totaalExtraPreviousTotalen++;
      let latestTotalen = dataList.totalenMeetstaatDWA[dataList.totalenMeetstaatDWA.length - 1];
      let verschilTotalenRow = worksheet.addRow(['VERSCHIL totalen', '', '']);
      verschilTotalenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
      verschilTotalenRow.height = 18;
      verschilTotalenRow.alignment = { vertical: 'middle', horizontal: 'center' };
      indexCount = 1;

      let column = "D";
      indexCount = 0;
      let verschilRow = 6 + totaalExtraPreviousTotalen + totalRowCount;
      for(let i = 0; i < 12; i++){
        column = totaalKolommen[i];
        verschilTotalenRow.getCell(totaalKolommen[i]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }

      if(!dataList.bochtenInGraden){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      } else {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.dwaSettings.mof){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.dwaSettings.krimpMof){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.dwaSettings.koppelStuk){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.dwaSettings.stop){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.dwaSettings.andere){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.dwaSettings.terugSlagKlep){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      if(dataList.dwaSettings.sifonPutje){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.dwaSettings.tPutje){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      if(!dataList.bochtenInGraden){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      } else {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      verschilTotalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'f2f2f2' },
          bgColor: { argb: 'f2f2f2' },
        };
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
           bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
      });

    }

    let totalenRow = worksheet.addRow(['Huidige totalen', '', '']);
    totalenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    totalenRow.height = 18;
    totalenRow.alignment = { vertical: 'middle', horizontal: 'center' };
    indexCount = 0;
    let nonEmptyCount = 0;
    console.log(eindKolomNewData);
    let row = "D";
    for(let i = 0; i < 12; i++){
      row = totaalKolommen[i];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(!dataList.bochtenInGraden){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    } else {
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.dwaSettings.mof){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.dwaSettings.krimpMof){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.dwaSettings.koppelStuk){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.dwaSettings.stop){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.dwaSettings.andere){
      row = totaalKolommen[indexCount];
      //optelling andere veld
      nonEmptyCount = 0;
      const startRow = 7;
      const endRow = eindKolomNewData; // The end row number
      for (let i = startRow; i <= endRow; i++) {
        let cellValue = worksheet.getCell(`${row}${i}`).value;
        // Check if the cell is not null/undefined, and is not an empty string
        if (cellValue !== null && cellValue !== undefined && cellValue.toString().trim() !== '') {
          nonEmptyCount++;
        }
      }
      totalenRow.getCell(totaalKolommen[indexCount]).value = nonEmptyCount;
      indexCount++;
    }
    if(dataList.dwaSettings.terugSlagKlep){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=COUNT(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=COUNT(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=COUNT(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    //optelling andere veld
    nonEmptyCount = 0;
    let startRow = 7;
    let endRow = eindKolomNewData; // The end row number
    for (let i = startRow; i <= endRow; i++) {
      let cellValue = worksheet.getCell(`${row}${i}`).value;
      // Check if the cell is not null/undefined, and is not an empty string
      if (cellValue !== null && cellValue !== undefined && cellValue.toString().trim() !== '') {
        nonEmptyCount++;
      }
    }
    totalenRow.getCell(totaalKolommen[indexCount]).value = nonEmptyCount;
    indexCount++;

    if(dataList.dwaSettings.sifonPutje){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.dwaSettings.tPutje){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    //start gietijzer
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: '=COUNTIF(' + row + "7:" + row + eindKolomNewData +',"ja")', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: '=COUNTIF(' + row + "7:" + row + eindKolomNewData +',"ja")', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: '=COUNTIF(' + row + "7:" + row + eindKolomNewData +',"ja")', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    if(!dataList.bochtenInGraden){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    } else {
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    totalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF21' },
        bgColor: { argb: 'FFFF21' },
      };
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });


    stukkenRow = worksheet.addRow(['Straat', 'Huisnr.', 'Volgnr.', 'Gres','PVC','PP', 'Gres','PVC','PP','Indrukmof', 'Y-Stuk', 'T-Buis',
      'T-Stuk', 'Flex. aansl.', 'Reductie']);
    stukkenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    stukkenRow.height = 18;
    stukkenRow.alignment = { vertical: 'middle', horizontal: 'center' };
    indexCount = 0;

    if(!dataList.bochtenInGraden){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht';
      indexCount++;
    } else {
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 45°';
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 90°';
      indexCount++;
    }
    if(dataList.dwaSettings.mof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Mof';
      indexCount++;
    }
    if(dataList.dwaSettings.krimpMof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Krimpmof';
      indexCount++;
    }
    if(dataList.dwaSettings.koppelStuk){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Koppelstuk';
      indexCount++;
    }
    if(dataList.dwaSettings.stop){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Stop';
      indexCount++;
    }
    if(dataList.dwaSettings.andere){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Andere';
      indexCount++;
    }
    if(dataList.dwaSettings.terugSlagKlep){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Terugslagklep';
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Fun/omh';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Kunststof';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PVC T-Stuk';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Geen';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Andere';
    indexCount++;
    if(dataList.dwaSettings.sifonPutje){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Sifonput';
      indexCount++;
    }
    if(dataList.dwaSettings.tPutje){
      stukkenRow.getCell(kolommen[indexCount]).value = 'T-putje';
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Gietijzer';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Beton';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Alu';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Gres';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PVC';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PP';
    indexCount++;
    if(!dataList.bochtenInGraden){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht';
      indexCount++;
    } else {
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 45°';
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 90°';
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Reductie';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Y-Stuk';

    stukkenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number <= 3) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      }else if (number > 3 && number <= (23 - notUsedVariableCount)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FABF8F' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (24 - notUsedVariableCount)){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEDFF' },
          bgColor: { argb: '000080' },
        };
      }else if (number > (24 - notUsedVariableCount) && number <= (33 - (notUsedVariableCount + secondNotUsedVariableCount))){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if (number > (33 - (notUsedVariableCount + secondNotUsedVariableCount)) && number <= (40 - (notUsedVariableCount + secondNotUsedVariableCount + thirdNotUsedVariableCount))){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F79646' },
          bgColor: { argb: '000080' },
        };
      }
    });

    let totaalBuisHorVoor = buisVoorHorGresCount + buisVoorHorPVCCount + buisVoorHorPPCount;
    let totaalBuisVertVoor = buisVoorVertGresCount + buisVoorVertPVCCount + buisVoorVertPPCount;
    let totaalBuisAchter = buisAchterGresCount + buisAchterPVCCount + buisAchterPPCount;
    totaalBuisHorVoor = +totaalBuisHorVoor.toFixed(2);
    totaalBuisVertVoor = +totaalBuisVertVoor.toFixed(2);
    totaalBuisAchter = +totaalBuisAchter.toFixed(2);

    //SAVE MEETSTAAT TOTALEN
    let totalenMeetstaatDWA = new TotaalMeetstaat(totaalBuisHorVoor,totaalBuisVertVoor, totaalBuisAchter,buisVoorHorGresCount, buisVoorHorPVCCount, buisVoorHorPPCount,
      buisVoorVertGresCount, buisVoorVertPVCCount, buisVoorVertPPCount, bochtVoorCount, reductieVoorCount, indrukmofCount, yStukCount, tBuisCount, tStukCount,
      flexAanCount, mofCount, krimpmofCount, koppelstukCount,stopCount, andereCount,kunststofCount,pvcTStukCount,gietIjzerCount,betonKaderCount,aluKaderCount,buisAchterGresCount,
      buisAchterPVCCount, buisAchterPPCount, bochtAchterCount, YAchterCount, reductieAchterCount, funOmhCount,geenPutjeCount,anderPutjeCount,0,terugslagklepCount,0,
      sifonPutjeCount, tPutjeCount, bochtVoor45Count, bochtAchter45Count, bochtVoor90Count, bochtAchter90Count);



    let putjes2RowRij = 9 + totaalExtraPreviousTotalen + totalRowCount;
    putjesRow2 = worksheet.addRow(['', '', '', 'BUIS HORIZONTAAL']);
    putjesRow2.font = { name: 'Arial', family: 4, size: 13, bold: true };
    putjesRow2.height = 18;
    putjesRow2.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A' + putjes2RowRij + ':C' + putjes2RowRij);
    putjesRow2.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EEECE1' },
      bgColor: { argb: '000080' },
    };
    putjesRow2.getCell('A').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet.mergeCells('D' + putjes2RowRij + ':F' + putjes2RowRij);
    putjesRow2.getCell('G').value = 'BUIS VERTICAAL';
    worksheet.mergeCells('G' + putjes2RowRij + ':I' + putjes2RowRij);
    putjesRow2.getCell('J').value = 'HOEVEELHEDEN VOOR PUTJE';
    worksheet.mergeCells('J' + putjes2RowRij +':' + eindVoorPutje + putjes2RowRij);
    putjesRow2.getCell(kolommen[indexEndVoorPutje+1]).value = 'Fun/omh';
    putjesRow2.getCell(startPutjeEnSoortPutje).value = 'SOORT PUTJE';
    worksheet.mergeCells(startPutjeEnSoortPutje + putjes2RowRij + ':' + eindSoortPutje + putjes2RowRij);
    putjesRow2.getCell(beginPutKader).value = 'PUTKADERS';
    worksheet.mergeCells(beginPutKader + putjes2RowRij + ':' + eindPutKader + putjes2RowRij);
    putjesRow2.getCell(beginNaPutje).value = 'BUIS NA PUTJE';
    worksheet.mergeCells(beginNaPutje + putjes2RowRij + ':' + eindBuisNaPut + putjes2RowRij);
    putjesRow2.getCell(stukkenNaPut).value = 'STUKKEN NA PUTJE';
    worksheet.mergeCells(stukkenNaPut + putjes2RowRij + ':' + eindNaPut + putjes2RowRij);


    putjesRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number === 4 || number === 7 || number === 11) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FABF8F' },
          bgColor: { argb: '000080' },
        };
      } else if ((number === (indexStartPutjeEnSoortPutje + 16)) || (number === (indexBeginPutKader + 16))){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if ((number === (indexBeginNaPutje + 16)) || (number === (indexStukkenNaPut + 16))) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F79646' },
          bgColor: { argb: '000080' },
        };
      } else if (number === indexEndVoorPutje + 17) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEDFF' },
          bgColor: { argb: '000080' },
        };
      } else if(number === (indexBeginPutKader + 14)){
        if(dataList.dwaSettings.sifonPutje && dataList.dwaSettings.tPutje){
          cell.border = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' },
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EEECE1' },
            bgColor: { argb: '000080' },
          };
        }
      } else if(number === (indexBeginPutKader + 15)){
        if(dataList.dwaSettings.sifonPutje || dataList.dwaSettings.tPutje){
          cell.border = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' },
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EEECE1' },
            bgColor: { argb: '000080' },
          };
        }
      }
    });

    postenRow = worksheet.addRow(['Postnummers']);
    let postRowRij = 10 + totaalExtraPreviousTotalen + totalRowCount;
    worksheet.mergeCells('A' + postRowRij + ':C' + postRowRij);
    postenRow.font = { name: 'Arial', family: 4, size: 11 };
    postenRow.alignment = {horizontal:'center'}
    postenRow.getCell('D').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorHorGres);
    postenRow.getCell('E').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorHorPVC);
    postenRow.getCell('F').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorHorPP);

    postenRow.getCell('G').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorVertGres);
    postenRow.getCell('H').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorVertPVC);
    postenRow.getCell('I').value = this.PostNumberNullToString(dwaPostNumbers.buisVoorVertPP);

    postenRow.getCell('J').value = this.PostNumberNullToString(dwaPostNumbers.indrukmof);
    postenRow.getCell('K').value = this.PostNumberNullToString(dwaPostNumbers.yStuk);
    postenRow.getCell('L').value = this.PostNumberNullToString(dwaPostNumbers.tBuis);
    postenRow.getCell('M').value = this.PostNumberNullToString(dwaPostNumbers.tStuk);
    postenRow.getCell('N').value = this.PostNumberNullToString(dwaPostNumbers.flexAan);
    postenRow.getCell('O').value = this.PostNumberNullToString(dwaPostNumbers.reductieVoor);

    indexCount = 0;
    if(!dataList.bochtenInGraden){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bochtVoor);
      indexCount++;
    } else{
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bocht45Voor);
      indexCount++;
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bocht90Voor);
      indexCount++;
    }
    if(dataList.dwaSettings.mof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.mof);
      indexCount++;
    }
    if(dataList.dwaSettings.krimpMof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.krimpmof);
      indexCount++;
    }
    if(dataList.dwaSettings.koppelStuk){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.koppelstuk);
      indexCount++;
    }
    if(dataList.dwaSettings.stop){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.stop);
      indexCount++;
    }
    if(dataList.dwaSettings.andere){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.andere);
      indexCount++;
    }
    if(dataList.dwaSettings.terugSlagKlep){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.terugslagKlep);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.funOmh);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.kunststof);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.pvcTStuk);
    indexCount += 3;
    if(dataList.dwaSettings.sifonPutje){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.sifonPutje);
      indexCount++;
    }
    if(dataList.dwaSettings.tPutje){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.tPutje);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.gietIjzer);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.betonKader);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.aluKader);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.buisAchterGres);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.buisAchterPVC);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.buisAchterPP);
    indexCount++;
    if(!dataList.bochtenInGraden){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bochtAchter);
      indexCount++;
    } else{
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bocht45Achter);
      indexCount++;
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.bocht90Achter);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.reductieAchter);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(dwaPostNumbers.YAchter);

    postenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    let putjesRowRij = 11 + totaalExtraPreviousTotalen + totalRowCount;
    putjesRow = worksheet.addRow(['', '', '', 'VOOR PUTJE']);
    putjesRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    putjesRow.height = 18;
    putjesRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A' + putjesRowRij + ':C' + putjesRowRij);
    putjesRow.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EEECE1' },
      bgColor: { argb: '000080' },
    };
    putjesRow.getCell('A').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet.mergeCells('D' + putjesRowRij + ':I' + putjesRowRij);
    putjesRow.getCell('J').value = 'VOOR PUTJE'
    worksheet.mergeCells('J' + putjesRowRij + ':' + eindVoorPutje + putjesRowRij);
    putjesRow.getCell(startPutjeEnSoortPutje).value = 'PUTJE';
    worksheet.mergeCells(startPutjeEnSoortPutje + putjesRowRij + ':' + eindPutKader + putjesRowRij);
    putjesRow.getCell(beginNaPutje).value = 'NA PUTJE';
    worksheet.mergeCells(beginNaPutje + putjesRowRij + ':' + eindNaPut + putjesRowRij);
    putjesRow.getCell(kolommen[indexEndVoorPutje+1]).border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    putjesRow.getCell(kolommen[indexEndVoorPutje+1]).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEDFF' },
      bgColor: { argb: '000080' },
    };
    //STANDAARD INDEX VANAF R =
    putjesRow.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number === 4 || number === 11) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FABF8F' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (indexStartPutjeEnSoortPutje + 16)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (indexBeginNaPutje + 16)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F79646' },
          bgColor: { argb: '000080' },
        };
      }
    });

    worksheet.pageSetup = {
      orientation: 'landscape',
      paperSize: 9, // 1 = Letter, 9 = A4
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      printArea: 'A1:' + kolommen[indexCount] + (10 + totaalExtraPreviousTotalen + totalRowCount), // Define print area
      margins: {
        left: 0.2, right: 0.2,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
      }
    };
    worksheet.properties.showGridLines = true;
    worksheet.views = [
      { zoomScale: 70 }
    ];




































    /// RWA BEGIN

    let worksheet2 = workbook.addWorksheet('Blad2 RWA', {
      views: [{ state: "frozen", ySplit: 6 }],
    });

    // Add new row
    titleRow = worksheet2.addRow(['Huis- en wachtaansluitingen RWA']);
    titleRow.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    titleRow.height = 23;
    worksheet2.mergeCells('A1:I1');
    worksheet2.mergeCells('N1:U1');
    titleRow.getCell('N').value = '  Bedrijf: ' + companyName;
    titleRow.getCell('W').value = 'Berekening fundering/omhulling:';

    if (dataList.projectList.length !== 0) {
      let locationRow = worksheet2.addRow([
        dataList.aannemerProjectNr + ' - ' + dataList.rbProjectNaam +
        ' - ' + dataList.rbGemeente
      ]);
      locationRow.font = {
        name: 'Arial',
        family: 4,
        size: 13,
        bold: true,
      };
      locationRow.height = 20;
      locationRow.getCell('W').value = 'Buis vert: x' + buisVertMult + ', Bocht: x' + bochtMult +
        ", Y-Stuk: x" + yStukMult + ", Indrukmof: x" + mofMult;

    }
    worksheet2.mergeCells('A2:I2');
    //CHECK VOOR NIET GEBRUIKTE VARIABELEN
    notUsedVariableCount = 0;
    secondNotUsedVariableCount = 0;
    thirdNotUsedVariableCount = 0;
    if(!dataList.bochtenInGraden){
      notUsedVariableCount++;
    }
    if (!dataList.rwaSettings.mof) {
      notUsedVariableCount++;
    }
    if (!dataList.rwaSettings.krimpMof) {
      notUsedVariableCount++;
    }
    if (!dataList.rwaSettings.koppelStuk) {
      notUsedVariableCount++;
    }
    if (!dataList.rwaSettings.stop) {
      notUsedVariableCount++;
    }
    if (!dataList.rwaSettings.andere) {
      notUsedVariableCount++;
    }
    if (!dataList.rwaSettings.aanslBovRwa) {
      notUsedVariableCount++;
    }
    if (!dataList.rwaSettings.terugSlagKlep) {
      notUsedVariableCount++;
    }
    if (!dataList.rwaSettings.tPutje) {
      secondNotUsedVariableCount++;
    }
    if (!dataList.rwaSettings.infilPutje) {
      secondNotUsedVariableCount++;
    }
    if(!dataList.bochtenInGraden){
      thirdNotUsedVariableCount++;
    }
    kolommen = ['N','O','P','Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL'];
    indexEndVoorPutje = 8 - notUsedVariableCount;
    eindVoorPutje = kolommen[indexEndVoorPutje];

    indexStartPutjeEnSoortPutje = 10 - notUsedVariableCount;
    startPutjeEnSoortPutje = kolommen[indexStartPutjeEnSoortPutje];

      indexEindSoortPutje = 15 - (secondNotUsedVariableCount + notUsedVariableCount);
      indexBeginPutKader = 16 - (secondNotUsedVariableCount + notUsedVariableCount);
      indexEindPutKader = 18 - (secondNotUsedVariableCount + notUsedVariableCount);
      indexBeginNaPutje = 19 - (secondNotUsedVariableCount + notUsedVariableCount);
      indexEindBuisNaPut = 20 - (secondNotUsedVariableCount + notUsedVariableCount);
      indexStukkenNaPut = 21 - (secondNotUsedVariableCount + notUsedVariableCount);
      indexEindPut = 24 - (secondNotUsedVariableCount + notUsedVariableCount + thirdNotUsedVariableCount);

    eindSoortPutje = kolommen[indexEindSoortPutje];

    beginPutKader = kolommen[indexBeginPutKader];

    eindPutKader = kolommen[indexEindPutKader];

    beginNaPutje = kolommen[indexBeginNaPutje];

    eindBuisNaPut = kolommen[indexEindBuisNaPut];

    stukkenNaPut = kolommen[indexStukkenNaPut]

    eindNaPut = kolommen[indexEindPut];
    beginNaPutje = kolommen[indexBeginNaPutje];

    console.log(notUsedVariableCount)
    putjesRow = worksheet2.addRow(['', '', '', 'VOOR PUTJE']);
    putjesRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    putjesRow.height = 18;
    putjesRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet2.mergeCells('A3:C3');
    putjesRow.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EEECE1' },
      bgColor: { argb: '000080' },
    };
    putjesRow.getCell('A').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet2.mergeCells('D3:G3');
    putjesRow.getCell('H').value = 'VOOR PUTJE'
    worksheet2.mergeCells('H3:' + eindVoorPutje + '3');
    putjesRow.getCell(startPutjeEnSoortPutje).value = 'PUTJE';
    worksheet2.mergeCells(startPutjeEnSoortPutje + '3:' + eindPutKader + '3');
    putjesRow.getCell(beginNaPutje).value = 'NA PUTJE';
    worksheet2.mergeCells(beginNaPutje + '3:' + eindNaPut + '3');
    putjesRow.getCell(kolommen[indexEndVoorPutje+1]).border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    putjesRow.getCell(kolommen[indexEndVoorPutje+1]).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEDFF' },
      bgColor: { argb: '000080' },
    };

    //STANDAARD INDEX VANAF R =
    putjesRow.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number === 4 || number === 10) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (indexStartPutjeEnSoortPutje + 16)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (indexBeginNaPutje + 17)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      }


    });
    postenRow = worksheet2.addRow(['Postnummers']);
    worksheet2.mergeCells('A4:C4');
    postenRow.font = { name: 'Arial', family: 4, size: 12 };
    postenRow.alignment = {horizontal:'center'}
    postenRow.getCell('D').value = this.PostNumberNullToString(rwaPostNumbers.buisVoorHorPVC);
    postenRow.getCell('E').value = this.PostNumberNullToString(rwaPostNumbers.buisVoorHorPP);

    postenRow.getCell('F').value = this.PostNumberNullToString(rwaPostNumbers.buisVoorVertPVC);
    postenRow.getCell('G').value = this.PostNumberNullToString(rwaPostNumbers.buisVoorVertPP);

    postenRow.getCell('H').value = this.PostNumberNullToString(rwaPostNumbers.indrukmof);
    postenRow.getCell('I').value = this.PostNumberNullToString(rwaPostNumbers.yStuk);
    postenRow.getCell('J').value = this.PostNumberNullToString(rwaPostNumbers.tBuis);
    postenRow.getCell('K').value = this.PostNumberNullToString(rwaPostNumbers.tStuk);
    postenRow.getCell('L').value = this.PostNumberNullToString(rwaPostNumbers.flexAan);
    postenRow.getCell('M').value = this.PostNumberNullToString(rwaPostNumbers.reductieVoor);

    indexCount = 0;
    if(!dataList.bochtenInGraden){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bochtVoor);
      indexCount++;
    } else {
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bocht45Voor);
      indexCount++;
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bocht90Voor);
      indexCount++;
    }
    if(dataList.rwaSettings.mof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.mof);
      indexCount++;
    }
    if(dataList.rwaSettings.krimpMof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.krimpmof);
      indexCount++;
    }
    if(dataList.rwaSettings.koppelStuk){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.koppelstuk);
      indexCount++;
    }
    if(dataList.rwaSettings.stop){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.stop);
      indexCount++;
    }
    if(dataList.rwaSettings.andere){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.andere);
      indexCount++;
    }
    if(dataList.rwaSettings.aanslBovRwa){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.aanslBovAfvoer);
      indexCount++;
    }
    if(dataList.rwaSettings.terugSlagKlep){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.terugslagKlep);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.funOmh);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.kunststof);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.pvcTStuk);
    indexCount += 3;
    if(dataList.rwaSettings.infilPutje){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.infiltratiePutje);
      indexCount++;
    }
    if(dataList.rwaSettings.tPutje){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.tPutje);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.gietIjzer);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.betonKader);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.aluKader);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.buisAchterPVC);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.buisAchterPP);
    indexCount++;
    if(!dataList.bochtenInGraden){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bochtAchter);
      indexCount++;
    } else {
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bocht45Achter);
      indexCount++;
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bocht90Achter);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.reductieAchter);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.YAchter);
    postenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    putjesRow2 = worksheet2.addRow(['', '', '', 'BUIS HORIZONTAAL']);
    putjesRow2.font = { name: 'Arial', family: 4, size: 13, bold: true };
    putjesRow2.height = 18;
    putjesRow2.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet2.mergeCells('A5:C5');
    putjesRow2.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EEECE1' },
      bgColor: { argb: '000080' },
    };
    putjesRow2.getCell('A').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet2.mergeCells('D5:E5');
    putjesRow2.getCell('F').value = 'BUIS VERTICAAL';
    worksheet2.mergeCells('F5:G5');
    putjesRow2.getCell('H').value = 'HOEVEELHEDEN VOOR PUTJE';
    worksheet2.mergeCells('H5:' + eindVoorPutje + '5');
    putjesRow2.getCell(kolommen[indexEndVoorPutje+1]).value = 'Fun/omh';
    putjesRow2.getCell(startPutjeEnSoortPutje).value = 'SOORT PUTJE';
    worksheet2.mergeCells(startPutjeEnSoortPutje + '5:' + eindSoortPutje + '5');
    putjesRow2.getCell(beginPutKader).value = 'PUTKADERS';
    worksheet2.mergeCells(beginPutKader + '5:' + eindPutKader + '5');
    putjesRow2.getCell(beginNaPutje).value = 'BUIS NA PUTJE';
    worksheet2.mergeCells(beginNaPutje + '5:' + eindBuisNaPut + '5');
    putjesRow2.getCell(stukkenNaPut).value = 'STUKKEN NA PUTJE';
    worksheet2.mergeCells(stukkenNaPut + '5:' + eindNaPut + '5');


    putjesRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number === 4 || number === 6 || number === 8) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      } else if ((number === (indexStartPutjeEnSoortPutje + 15)) || (number === (indexBeginPutKader + 15))){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if ((number === (indexBeginNaPutje + 15)) || (number === (indexStukkenNaPut + 15))) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      } else if (number === indexEndVoorPutje + 15) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEDFF' },
          bgColor: { argb: '000080' },
        };
      } else if(number === (indexBeginPutKader + 13)){
        if(dataList.rwaSettings.infilPutje && dataList.rwaSettings.tPutje){
          cell.border = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' },
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EEECE1' },
            bgColor: { argb: '000080' },
          };
        }
      } else if(number === (indexBeginPutKader + 14)){
        if(dataList.rwaSettings.infilPutje || dataList.rwaSettings.tPutje){
          cell.border = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' },
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EEECE1' },
            bgColor: { argb: '000080' },
          };
        }
      }
    });

    stukkenRow = worksheet2.addRow(['Straat', 'Huisnr.', 'Volgnr.', 'PVC','PP','PVC','PP','Indrukmof', 'Y-Stuk', 'T-Buis',
      'T-Stuk', 'Flex. aansl.', 'Reductie']);
    stukkenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    stukkenRow.height = 18;
    stukkenRow.alignment = { vertical: 'middle', horizontal: 'center' };
    indexCount = 0;

    if(!dataList.bochtenInGraden){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht';
      indexCount++;
    } else {
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 45°';
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 90°';
      indexCount++;
    }
    if(dataList.rwaSettings.mof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Mof';
      indexCount++;
    }
    if(dataList.rwaSettings.krimpMof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Krimpmof';
      indexCount++;
    }
    if(dataList.rwaSettings.koppelStuk){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Koppelstuk';
      indexCount++;
    }
    if(dataList.rwaSettings.stop){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Stop';
      indexCount++;
    }
    if(dataList.rwaSettings.andere){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Andere';
      indexCount++;
    }
    if(dataList.rwaSettings.aanslBovRwa){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Aansl. bov';
      indexCount++;
    }
    if(dataList.rwaSettings.terugSlagKlep){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Terugslagklep';
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Fun/omh';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Kunststof';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PVC T-Stuk';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Geen';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Andere';
    if(dataList.rwaSettings.infilPutje){
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Infilputje'
    }
    if(dataList.rwaSettings.tPutje){
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'T-putje'
    }
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Gietijzer';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Beton';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Alu';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PVC';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PP';
    indexCount++;

    if(!dataList.bochtenInGraden){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht';
      indexCount++;
    } else {
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 45°';
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 90°';
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Reductie';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Y-Stuk';

    stukkenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number <= 3) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      }else if (number > 3 && number <= (22 - notUsedVariableCount)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (23 - notUsedVariableCount)){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEDFF' },
          bgColor: { argb: '000080' },
        };
      } else if (number > (23 - notUsedVariableCount) && number <= 32 - (secondNotUsedVariableCount + notUsedVariableCount)){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if (number > 32  - (secondNotUsedVariableCount + notUsedVariableCount + thirdNotUsedVariableCount) && number <= 38 - (secondNotUsedVariableCount + notUsedVariableCount + thirdNotUsedVariableCount)){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      }
    });


    let buisVoorHorPVCCountRWA = 0;
    let buisVoorHorPPCountRWA = 0;
    let buisVoorVertPVCCountRWA = 0;
    let buisVoorVertPPCountRWA = 0;
    let bochtVoorCountRWA = 0;
    let indrukmofCountRWA = 0;
    let yStukCountRWA = 0;
    let tBuisCountRWA = 0;
    let tStukCountRWA = 0;
    let flexAanCountRWA = 0;
    let reductieVoorCountRWA = 0;
    let mofCountRWA = 0;
    let krimpmofCountRWA = 0;
    let koppelstukCountRWA = 0;
    let stopCountRWA = 0;
    let andereCountRWA = 0;
    let aanslBovRegenafvoerCountRWA = 0;
    let terugslagklepCountRWA = 0;
    let funOmhCountRWA = 0;
    let kunststofCountRWA = 0;
    let pvcTStukCountRWA = 0;
    let geenPutjeCountRWA = 0;
    let anderPutjeCountRWA = 0;
    let infilPutjeCountRWA = 0;
    let gietIjzerCountRWA = 0;
    let betonKaderCountRWA = 0;
    let aluKaderCountRWA = 0;
    let buisAchterPVCCountRWA = 0;
    let buisAchterPPCountRWA = 0;
    let bochtAchterCountRWA = 0;
    let reductieAchterCountRWA = 0;
    let YAchterCountRWA = 0;
    let totalRowCountRWA = 0;
    let tPutjeCountRWA = 0;
    let bochtVoor45CountRWA = 0;
    let bochtVoor90CountRWA = 0;
    let bochtAchter45CountRWA = 0;
    let bochtAchter90CountRWA = 0;
    for (let data of dataList.projectList) {
      let project = data;
      if (project.regenWaterAfvoer != null && this.checkHasRWA(project.regenWaterAfvoer)) {
        totalRowCountRWA++;
        let buisVoorHorPVC = 0;
        let buisVoorHorPP = 0;
        let buisVoorVertPVC = 0;
        let buisVoorVertPP = 0;
        let buisAchterPVC = 0;
        let buisAchterPP = 0;
        if(project.regenWaterAfvoer.isPP){
          buisVoorHorPPCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
          buisVoorVertPPCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
          buisAchterPPCountRWA += this.NullToZero(project.regenWaterAfvoer.buisAchter);
          buisVoorHorPP = this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
          buisVoorVertPP = this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
          buisAchterPP = this.NullToZero(project.regenWaterAfvoer.buisAchter);
        } else if(project.regenWaterAfvoer.buisTypeAchter == null){
          buisVoorHorPVCCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
          buisVoorVertPVCCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
          buisAchterPVCCountRWA += this.NullToZero(project.regenWaterAfvoer.buisAchter);
          buisVoorHorPVC = this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
          buisVoorVertPVC = this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
          buisAchterPVC = this.NullToZero(project.regenWaterAfvoer.buisAchter);
        } else {
          switch(project.regenWaterAfvoer.buisType) {
            case null: {
              break;
            }
            case 'PVC': {
              buisVoorHorPVCCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
              buisVoorVertPVCCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
              buisVoorHorPVC = this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
              buisVoorVertPVC = this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
              break;
            }
            case 'PP': {
              buisVoorHorPPCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
              buisVoorVertPPCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
              buisVoorHorPP = this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
              buisVoorVertPP = this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
              break;
            }
          }
          switch(project.regenWaterAfvoer.buisTypeAchter) {
            case null: {
              break;
            }
            case 'PVC': {
              buisAchterPVCCountRWA += this.NullToZero(project.regenWaterAfvoer.buisAchter);
              buisAchterPVC = this.NullToZero(project.regenWaterAfvoer.buisAchter);
              break;
            }
            case 'PP': {
              buisAchterPPCountRWA += this.NullToZero(project.regenWaterAfvoer.buisAchter);
              buisAchterPP = this.NullToZero(project.regenWaterAfvoer.buisAchter);
              break;
            }
          }
        }

        if(!dataList.bochtenInGraden){
          bochtVoorCountRWA += this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2);
          bochtAchterCountRWA += this.NullToZero(project.regenWaterAfvoer.bochtAchter);
        }
        else {
          bochtVoor45CountRWA += this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.regenWaterAfvoer.gradenBocht2Voor45);
          bochtVoor90CountRWA += this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.regenWaterAfvoer.gradenBocht2Voor90);
          bochtAchter45CountRWA += this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter45);
          bochtAchter90CountRWA += this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter90);
        }
        reductieVoorCountRWA += this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2);
        reductieAchterCountRWA += this.NullToZero(project.regenWaterAfvoer.reductieAchter);
        YAchterCountRWA += this.NullToZero(project.regenWaterAfvoer.YAchter);

        if (project.regenWaterAfvoer.alukader != null && project.regenWaterAfvoer.alukader === true && !project.regenWaterAfvoer.gietijzer) {
          aluKaderCountRWA++;
        }
        if (project.regenWaterAfvoer.betonkader != null && project.regenWaterAfvoer.betonkader === true && project.regenWaterAfvoer.gietijzer) {
          betonKaderCountRWA++;
        }
        if (project.regenWaterAfvoer.gietijzer != null && project.regenWaterAfvoer.gietijzer === true) {
          gietIjzerCountRWA++;
        }
        let indrukmof = 0;
        let tBuis = 0;
        let tStuk = 0;
        let yStuk = 0;
        let kunststof = 0;
        let geenPutje = 0;
        let anderPutje = '';
        let terugslagklep = 0;
        let infilPutje = 0;
        let flexAansluiting = 0;
        let pvcTStuk = 0;
        switch (project.regenWaterAfvoer.tBuisStuk) {
          case 'aanboring':
            indrukmofCountRWA++;
            indrukmof = 1;
            break;
          case 'T-Buis':
            tBuisCountRWA++;
            tBuis = 1;
            break;
          case 'T-Stuk':
            tStuk = 1;
            tStukCountRWA++;
            break;
          case 'Y-Stuk':
            yStuk = 1;
            yStukCountRWA++;
            break;
          case 'flexAan':
            flexAansluiting = 1;
            flexAanCountRWA++;
            break;
        }
        if (project.regenWaterAfvoer.soortPutje === 't-stuk') {
          pvcTStukCountRWA++;
          pvcTStuk += 1;
        } else if (project.regenWaterAfvoer.soortPutje === 'kunststof') {
          kunststofCountRWA += 1;
          kunststof = 1;
        } else if (project.regenWaterAfvoer.soortPutje === 'geen') {
          geenPutjeCountRWA++;
          geenPutje = 1;
        } else if (project.regenWaterAfvoer.soortPutje === 'andere') {
          anderPutjeCountRWA++;
          anderPutje = project.regenWaterAfvoer.anderPutje;
        }
        if(dataList.rwaSettings.infilPutje === true && project.regenWaterAfvoer.infilPutje === true){
          infilPutje = 1;
          infilPutjeCountRWA++;
        }
        if(dataList.rwaSettings.terugSlagKlep === true && project.regenWaterAfvoer.terugslagklep === true){
          terugslagklep = 1;
          terugslagklepCountRWA++;
        }
        tPutjeCountRWA += this.NullToZero(project.regenWaterAfvoer.tPutje);
        let funOmh = 0;
        if(!dataList.bochtenInGraden){
          funOmh =
            this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2) +
            (this.NullToZero(project.regenWaterAfvoer.buisVoorVert) * buisVertMult) + (this.NullToZero(project.regenWaterAfvoer.buisVoorVert2) * buisVertMult) +
            ((this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2)) * bochtMult) +
            (this.NullToZero(yStuk * yStukMult)) +
            (this.NullToZero(indrukmof) * mofMult);
          funOmhCountRWA += +funOmh;
        } else {
          funOmh =
            this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2) +
            (this.NullToZero(project.regenWaterAfvoer.buisVoorVert) * buisVertMult) + (this.NullToZero(project.regenWaterAfvoer.buisVoorVert2) * buisVertMult) +
            ((this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.regenWaterAfvoer.gradenBocht2Voor45) +
              this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.regenWaterAfvoer.gradenBocht2Voor90)) * bochtMult) +
            (this.NullToZero(yStuk * yStukMult)) +
            (this.NullToZero(indrukmof) * mofMult);
          funOmhCountRWA += +funOmh;
        }
        let funOmhString = +(funOmh.toFixed(2));

        let dataRow = worksheet2.addRow([
          project?.street,
          project?.huisNr,
          project?.index,
          this.ConvertNumberToEmptyString(buisVoorHorPVC),
          this.ConvertNumberToEmptyString(buisVoorHorPP),
          this.ConvertNumberToEmptyString(buisVoorVertPVC),
          this.ConvertNumberToEmptyString(buisVoorVertPP),
          this.ConvertNumberToEmptyString(indrukmof),
          this.ConvertNumberToEmptyString(yStuk),
          this.ConvertNumberToEmptyString(tBuis),
          this.ConvertNumberToEmptyString(tStuk),
          this.ConvertNumberToEmptyString(flexAansluiting),
          this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2))
        ]);
        dataRow.font = { name: 'Arial', family: 4, size: 12};
        let indexCount = 0;
        if(!dataList.bochtenInGraden){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2));
          indexCount++;
        } else {
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.regenWaterAfvoer.gradenBocht2Voor45));
          indexCount++;
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.regenWaterAfvoer.gradenBocht2Voor90));
          indexCount++;
        }
        if(dataList.rwaSettings.mof){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.regenWaterAfvoer.mof);
          mofCountRWA += this.NullToZero(project.regenWaterAfvoer.mof);
          indexCount++;
        }
        if(dataList.rwaSettings.krimpMof){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.regenWaterAfvoer.krimpmof);
          krimpmofCountRWA += this.NullToZero(project.regenWaterAfvoer.krimpmof);
          indexCount++;
        }
        if(dataList.rwaSettings.koppelStuk){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.regenWaterAfvoer.koppelstuk);
          koppelstukCountRWA += this.NullToZero(project.regenWaterAfvoer.koppelstuk);
          indexCount++;
        }
        if(dataList.rwaSettings.stop){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.regenWaterAfvoer.stop);
          stopCountRWA += this.NullToZero(project.regenWaterAfvoer.stop);
          indexCount++;
        }
        if(dataList.rwaSettings.andere){
          dataRow.getCell(kolommen[indexCount]).value = project.regenWaterAfvoer.andere;
          if(project.regenWaterAfvoer.andere != null && project.regenWaterAfvoer.andere.trim() !== ''){
            andereCountRWA++;
          }
          indexCount++;
        }
        if(dataList.rwaSettings.aanslBovRwa){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.regenWaterAfvoer.aanslBovRWA);
          aanslBovRegenafvoerCountRWA += this.NullToZero(project.regenWaterAfvoer.aanslBovRWA);
          indexCount++;
        }
        if(dataList.rwaSettings.terugSlagKlep){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(terugslagklep);
          indexCount++;
        }
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(funOmhString);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(kunststof);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(pvcTStuk);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(geenPutje);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = anderPutje;
        indexCount++;
        if(dataList.rwaSettings.infilPutje){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(infilPutje);
          indexCount++;
        }
        if(dataList.rwaSettings.tPutje){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.regenWaterAfvoer.tPutje);
          indexCount++;
        }
        dataRow.getCell(kolommen[indexCount]).value = this.BoolToString(project.regenWaterAfvoer.gietijzer);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false);
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(buisAchterPVC)
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(buisAchterPP)
        indexCount++;
        if(!dataList.bochtenInGraden){
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.bochtAchter));
          indexCount++;
        } else {
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter45));
          indexCount++;
          dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter90));
          indexCount++;
        }
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter)
        indexCount++;
        dataRow.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter)
        indexCount++;

      }
    }



    funOmhCountRWA = +funOmhCountRWA.toFixed(2);
    buisVoorHorPVCCountRWA = +buisVoorHorPVCCountRWA.toFixed(2);
    buisVoorHorPPCountRWA = +buisVoorHorPPCountRWA.toFixed(2);
    buisVoorVertPVCCountRWA = +buisVoorVertPVCCountRWA.toFixed(2);
    buisVoorVertPPCountRWA = +buisVoorVertPPCountRWA.toFixed(2);
    bochtVoorCountRWA = +bochtVoorCountRWA.toFixed(2);
    bochtVoor45CountRWA = +bochtVoor45CountRWA.toFixed(2);
    bochtVoor90CountRWA = +bochtVoor90CountRWA.toFixed(2);
    bochtAchter45CountRWA = +bochtAchter45CountRWA.toFixed(2);
    bochtAchter90CountRWA = +bochtAchter90CountRWA.toFixed(2);
    indrukmofCountRWA = +indrukmofCountRWA.toFixed(2);
    yStukCountRWA = +yStukCountRWA.toFixed(2);
    tBuisCountRWA = +tBuisCountRWA.toFixed(2);
    tStukCountRWA = +tStukCountRWA.toFixed(2);
    flexAanCountRWA = +flexAanCountRWA.toFixed(2);
    reductieVoorCountRWA = +reductieVoorCountRWA.toFixed(2);
    buisAchterPVCCountRWA = +buisAchterPVCCountRWA.toFixed(2);
    buisAchterPPCountRWA = +buisAchterPPCountRWA.toFixed(2);
    infilPutjeCountRWA = +infilPutjeCountRWA.toFixed(2);
    aanslBovRegenafvoerCountRWA = +aanslBovRegenafvoerCountRWA.toFixed(2);
    terugslagklepCountRWA = +terugslagklepCountRWA.toFixed(2);


    let totaalBuisHorVoorRWA = buisVoorHorPVCCountRWA + buisVoorHorPPCountRWA;
    let totaalBuisVertVoorRWA = buisVoorVertPVCCountRWA + buisVoorVertPPCountRWA;
    let totaalBuisAchterRWA = buisAchterPVCCountRWA + buisAchterPPCountRWA;
    totaalBuisHorVoorRWA = +totaalBuisHorVoorRWA.toFixed(2);
    totaalBuisVertVoorRWA = +totaalBuisVertVoorRWA.toFixed(2);
    totaalBuisAchterRWA = +totaalBuisAchterRWA.toFixed(2);

    let totalenMeetstaatRWA = new TotaalMeetstaat(totaalBuisHorVoorRWA, totaalBuisVertVoorRWA, totaalBuisAchterRWA, 0,
      buisVoorHorPVCCountRWA, buisVoorHorPPCountRWA, 0, buisVoorVertPVCCountRWA, buisVoorVertPPCountRWA, bochtVoorCountRWA, reductieVoorCountRWA,
      indrukmofCountRWA, yStukCountRWA,tBuisCountRWA, tStukCountRWA, flexAanCountRWA,mofCountRWA,krimpmofCountRWA,koppelstukCountRWA,stopCountRWA,andereCountRWA,
      kunststofCountRWA,pvcTStukCountRWA,gietIjzerCountRWA,betonKaderCountRWA,aluKaderCountRWA,0,buisAchterPVCCountRWA,buisAchterPPCountRWA,
      bochtAchterCountRWA, YAchterCountRWA, reductieAchterCountRWA, funOmhCountRWA, geenPutjeCountRWA, anderPutjeCountRWA, aanslBovRegenafvoerCountRWA, terugslagklepCountRWA,
      infilPutjeCountRWA,0,tPutjeCountRWA, bochtVoor45CountRWA, bochtAchter45CountRWA, bochtVoor90CountRWA, bochtAchter90CountRWA);

    counter = 0;
    totaalExtraPreviousTotalen = 0;
    if(dataList.totalenMeetstaatRWA != null && dataList.totalenMeetstaatRWA.length !== 0){
      totaalExtraPreviousTotalen = dataList.totalenMeetstaatRWA.length;

      for(let vorige of dataList.totalenMeetstaatRWA){
        counter++;
        let vorigeTotalenRow = worksheet2.addRow([(counter === dataList.totalenMeetstaatRWA.length ? 'Laatste vorige totalen' : 'Vorige totalen'),
          'Datum:', new Date(vorige.date).toLocaleDateString(), vorige.buisVoorHorPVC, vorige.buisVoorHorPP,
          vorige.buisVoorVertPVC, vorige.buisVoorVertPP, vorige.indrukmof,
          vorige.yStuk, vorige.tBuis, vorige.tStuk, vorige.flexAan, vorige.reductieVoor]);
        vorigeTotalenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
        vorigeTotalenRow.height = 18;
        vorigeTotalenRow.alignment = { vertical: 'middle', horizontal: 'center' };
        indexCount = 0;

        if(!dataList.bochtenInGraden){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.bochtVoor;
          indexCount++;
        } else {
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gradenBochtVoor45;
          indexCount++;
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gradenBochtVoor90;
          indexCount++;
        }
        if(dataList.rwaSettings.mof){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.mof;
          indexCount++;
        }
        if(dataList.rwaSettings.krimpMof){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.krimpmof;
          indexCount++;
        }
        if(dataList.rwaSettings.koppelStuk){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.koppelstuk;
          indexCount++;
        }
        if(dataList.rwaSettings.stop){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.stop;
          indexCount++;
        }
        if(dataList.rwaSettings.andere){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.andere;
          indexCount++;
        }
        if(dataList.rwaSettings.aanslBovRwa){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.aanslBovAfvoer;
          indexCount++;
        }
        if(dataList.rwaSettings.terugSlagKlep){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.terugslagklep;
          indexCount++;
        }
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.funOmh;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.kunststof;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.pvcTStuk;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.geenPutje;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.anderPutje;
        indexCount++;
        if(dataList.rwaSettings.infilPutje){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.infilPutje;
          indexCount++;
        }
        if(dataList.rwaSettings.tPutje){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.tPutje;
          indexCount++;
        }
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gietIjzer;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.betonKader;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.aluKader;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.buisAchterPVC;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.buisAchterPP;
        indexCount++;
        if(!dataList.bochtenInGraden){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.bochtAchter;
          indexCount++;
        } else {
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gradenBochtAchter45;
          indexCount++;
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gradenBochtAchter90;
          indexCount++;
        }
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.reductieAchter;
        indexCount++;
        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.YAchter;
        indexCount++;
        if(counter === dataList.totalenMeetstaatRWA.length){
          vorigeTotalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'D8E4BC' },
              bgColor: { argb: 'D8E4BC' },
            };
            cell.border = {
              top: { style: 'medium' },
              left: { style: 'medium' },
              bottom: { style: 'medium' },
              right: { style: 'medium' },
            };
          });
        } else {
          vorigeTotalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }
      }
    }

    worksheet2.columns.forEach(function (column, i) {
      if((i >= 1 && i < 8)){
        column.width = 12;
      } else if((i >= 9 && i <= 11) || (i >= 27 - notUsedVariableCount && i  <= (32 - notUsedVariableCount))){
        column.width = 11;
      } else if(i === 8) {
        column.width = 13;
      } else{
        let maxLength = 0;
        column["eachCell"]({ includeEmpty: true }, function (cell) {
          if(!allStrings.find(x => x === cell.value)){
            let columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength ) {
              maxLength = columnLength;
            }
          }
        });
        column.width = maxLength < 11 ? 11 : maxLength + 3;
        if(i === 0){
          column.width = 25;
        }  else if(maxLength >= 8 && maxLength < 10){
          column.width = maxLength < 13 ? 13 : maxLength + 2;
        } else if(maxLength >= 10 && maxLength < 13){
          column.width = 14;
        } else if(maxLength >= 13){
          column.width = 16;
        }
      }
    });
    if(totaalExtraPreviousTotalen > 0){
      totaalExtraPreviousTotalen++;
      let latestTotalen = dataList.totalenMeetstaatRWA[dataList.totalenMeetstaatRWA.length-1];

      let verschilTotalenRow = worksheet2.addRow(['VERSCHIL totalen', '', '']);
      verschilTotalenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
      verschilTotalenRow.height = 18;
      verschilTotalenRow.alignment = { vertical: 'middle', horizontal: 'center' };
      let column = "D";
      indexCount = 0;
      let verschilRow = 6 + totaalExtraPreviousTotalen + totalRowCountRWA;
      for(let i = 0; i < 10; i++){
        column = totaalKolommen[i];
        verschilTotalenRow.getCell(totaalKolommen[i]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(!dataList.bochtenInGraden){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      } else {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }

      if(dataList.rwaSettings.mof){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.rwaSettings.krimpMof){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.rwaSettings.koppelStuk){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.rwaSettings.stop){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.rwaSettings.andere){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.rwaSettings.aanslBovRwa){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.rwaSettings.terugSlagKlep){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      if(dataList.rwaSettings.infilPutje){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.rwaSettings.tPutje){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      if(!dataList.bochtenInGraden){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      } else {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      verschilTotalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'f2f2f2' },
          bgColor: { argb: 'f2f2f2' },
        };
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
      });
    }
    totalenRow = worksheet2.addRow(['Huidige totalen', '', '']);
    totalenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    totalenRow.height = 18;
    totalenRow.alignment = { vertical: 'middle', horizontal: 'center' };
    indexCount = 0;
    eindKolomNewData = 6 + totalRowCountRWA;
    row = "D";
    for(let i = 0; i < 10; i++){
      row = totaalKolommen[i];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(!dataList.bochtenInGraden){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    } else {
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.rwaSettings.mof){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.rwaSettings.krimpMof){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.rwaSettings.koppelStuk){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.rwaSettings.stop){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if (dataList.rwaSettings.andere) {
      row = totaalKolommen[indexCount];
      //optelling andere veld
      nonEmptyCount = 0;
      const startRow = 7;
      const endRow = eindKolomNewData; // The end row number
      for (let i = startRow; i <= endRow; i++) {
        let cellValue = worksheet2.getCell(`${row}${i}`).value;
        // Check if the cell is not null/undefined, and is not an empty string
        if (cellValue !== null && cellValue !== undefined && cellValue.toString().trim() !== '') {
          nonEmptyCount++;
        }
      }
      totalenRow.getCell(totaalKolommen[indexCount]).value = nonEmptyCount;
      indexCount++;
    }
    if(dataList.rwaSettings.aanslBovRwa){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.rwaSettings.terugSlagKlep){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    //optelling andere veld
    nonEmptyCount = 0;
    startRow = 7;
    endRow = eindKolomNewData; // The end row number
    for (let i = startRow; i <= endRow; i++) {
      let cellValue = worksheet2.getCell(`${row}${i}`).value;
      // Check if the cell is not null/undefined, and is not an empty string
      if (cellValue !== null && cellValue !== undefined && cellValue.toString().trim() !== '') {
        nonEmptyCount++;
      }
    }
    totalenRow.getCell(totaalKolommen[indexCount]).value = nonEmptyCount;
    indexCount++;
    if(dataList.rwaSettings.infilPutje){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.rwaSettings.tPutje){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: '=COUNTIF(' + row + "7:" + row + eindKolomNewData +',"ja")', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: '=COUNTIF(' + row + "7:" + row + eindKolomNewData +',"ja")', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: '=COUNTIF(' + row + "7:" + row + eindKolomNewData +',"ja")', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    if(!dataList.bochtenInGraden){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    } else {
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=SUM(" + row + "7:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    row = totaalKolommen[indexCount];
    totalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF21' },
        bgColor: { argb: 'FFFF21' },
      };
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });

    stukkenRow = worksheet2.addRow(['Straat', 'Huisnr.', 'Volgnr.', 'PVC','PP','PVC','PP','Indrukmof', 'Y-Stuk', 'T-Buis',
      'T-Stuk', 'Flex. aansl.', 'Reductie']);
    stukkenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    stukkenRow.height = 18;
    stukkenRow.alignment = { vertical: 'middle', horizontal: 'center' };
    indexCount = 0;

    if(!dataList.bochtenInGraden){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht';
      indexCount++;
    } else {
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 45°';
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 90°';
      indexCount++;
    }
    if(dataList.rwaSettings.mof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Mof';
      indexCount++;
    }
    if(dataList.rwaSettings.krimpMof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Krimpmof';
      indexCount++;
    }
    if(dataList.rwaSettings.koppelStuk){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Koppelstuk';
      indexCount++;
    }
    if(dataList.rwaSettings.stop){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Stop';
      indexCount++;
    }
    if(dataList.rwaSettings.andere){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Andere';
      indexCount++;
    }
    if(dataList.rwaSettings.aanslBovRwa){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Aansl. bov';
      indexCount++;
    }
    if(dataList.rwaSettings.terugSlagKlep){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Terugslagklep';
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Fun/omh';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Kunststof';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PVC T-Stuk';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Geen';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Andere';
    if(dataList.rwaSettings.infilPutje){
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Infilputje'
    }
    if(dataList.rwaSettings.tPutje){
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'T-putje'
    }
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Gietijzer';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Beton';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Alu';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PVC';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'PP';
    indexCount++;
    if(!dataList.bochtenInGraden){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht';
      indexCount++;
    } else {
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 45°';
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 90°';
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Reductie';
    indexCount++;
    stukkenRow.getCell(kolommen[indexCount]).value = 'Y-Stuk';

    stukkenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number <= 3) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      }else if (number > 3 && number <= (22 - notUsedVariableCount)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (23 - notUsedVariableCount)){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEDFF' },
          bgColor: { argb: '000080' },
        };
      } else if (number > (23 - notUsedVariableCount) && number <= 32 - (secondNotUsedVariableCount + notUsedVariableCount)){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if (number > 32  - (secondNotUsedVariableCount + notUsedVariableCount + thirdNotUsedVariableCount) && number <= 38 - (secondNotUsedVariableCount + notUsedVariableCount + thirdNotUsedVariableCount)){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      }
    });

    putjes2RowRij = 9 + totaalExtraPreviousTotalen + totalRowCountRWA;

    putjesRow2 = worksheet2.addRow(['', '', '', 'BUIS HORIZONTAAL']);
    putjesRow2.font = { name: 'Arial', family: 4, size: 13, bold: true };
    putjesRow2.height = 18;
    putjesRow2.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet2.mergeCells('A' + putjes2RowRij + ':C' + putjes2RowRij);
    putjesRow2.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EEECE1' },
      bgColor: { argb: '000080' },
    };
    putjesRow2.getCell('A').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet2.mergeCells('D' + putjes2RowRij + ':E' + putjes2RowRij);
    putjesRow2.getCell('F').value = 'BUIS VERTICAAL';
    worksheet2.mergeCells('F' + putjes2RowRij + ':G' + putjes2RowRij);
    putjesRow2.getCell('H').value = 'HOEVEELHEDEN VOOR PUTJE';
    worksheet2.mergeCells('H' + putjes2RowRij + ':' + eindVoorPutje + putjes2RowRij);
    putjesRow2.getCell(kolommen[indexEndVoorPutje+1]).value = 'Fun/omh';
    putjesRow2.getCell(startPutjeEnSoortPutje).value = 'SOORT PUTJE';
    worksheet2.mergeCells(startPutjeEnSoortPutje + putjes2RowRij + ':' + eindSoortPutje + putjes2RowRij);
    putjesRow2.getCell(beginPutKader).value = 'PUTKADERS';
    worksheet2.mergeCells(beginPutKader + putjes2RowRij + ':' + eindPutKader + putjes2RowRij);
    putjesRow2.getCell(beginNaPutje).value = 'BUIS NA PUTJE';
    worksheet2.mergeCells(beginNaPutje + putjes2RowRij + ':' + eindBuisNaPut + putjes2RowRij);
    putjesRow2.getCell(stukkenNaPut).value = 'STUKKEN NA PUTJE';
    worksheet2.mergeCells(stukkenNaPut + putjes2RowRij + ':' + eindNaPut + putjes2RowRij);


    putjesRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number === 4 || number === 6 || number === 8) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      } else if ((number === (indexStartPutjeEnSoortPutje + 15)) || (number === (indexBeginPutKader + 15))){
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if ((number === (indexBeginNaPutje + 15)) || (number === (indexStukkenNaPut + 15))) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      } else if (number === indexEndVoorPutje + 15) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEDFF' },
          bgColor: { argb: '000080' },
        };
      }
    });
    postRowRij = 10 + totaalExtraPreviousTotalen + totalRowCountRWA;

    postenRow = worksheet2.addRow(['Postnummers', '', '']);
    worksheet2.mergeCells('A' + postRowRij + ':C' + postRowRij);
    postenRow.font = { name: 'Arial', family: 4, size: 12 };
    postenRow.alignment = {horizontal:'center'}
    postenRow.getCell('D').value = this.PostNumberNullToString(rwaPostNumbers.buisVoorHorPVC);
    postenRow.getCell('E').value = this.PostNumberNullToString(rwaPostNumbers.buisVoorHorPP);

    postenRow.getCell('F').value = this.PostNumberNullToString(rwaPostNumbers.buisVoorVertPVC);
    postenRow.getCell('G').value = this.PostNumberNullToString(rwaPostNumbers.buisVoorVertPP);

    postenRow.getCell('H').value = this.PostNumberNullToString(rwaPostNumbers.indrukmof);
    postenRow.getCell('I').value = this.PostNumberNullToString(rwaPostNumbers.yStuk);
    postenRow.getCell('J').value = this.PostNumberNullToString(rwaPostNumbers.tBuis);
    postenRow.getCell('K').value = this.PostNumberNullToString(rwaPostNumbers.tStuk);
    postenRow.getCell('L').value = this.PostNumberNullToString(rwaPostNumbers.flexAan);
    postenRow.getCell('M').value = this.PostNumberNullToString(rwaPostNumbers.reductieVoor);

    indexCount = 0;
    if(!dataList.bochtenInGraden){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bochtVoor);
      indexCount++;
    } else {
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bocht45Voor);
      indexCount++;
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bocht90Voor);
      indexCount++;
    }
    if(dataList.rwaSettings.mof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.mof);
      indexCount++;
    }
    if(dataList.rwaSettings.krimpMof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.krimpmof);
      indexCount++;
    }
    if(dataList.rwaSettings.koppelStuk){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.koppelstuk);
      indexCount++;
    }
    if(dataList.rwaSettings.stop){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.stop);
      indexCount++;
    }
    if(dataList.rwaSettings.andere){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.andere);
      indexCount++;
    }
    if(dataList.rwaSettings.aanslBovRwa){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.aanslBovAfvoer);
      indexCount++;
    }
    if(dataList.rwaSettings.terugSlagKlep){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.terugslagKlep);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.funOmh);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.kunststof);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.pvcTStuk);
    indexCount += 3;
    if(dataList.rwaSettings.infilPutje){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.infiltratiePutje);
      indexCount++;
    }
    if(dataList.rwaSettings.tPutje){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.tPutje);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.gietIjzer);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.betonKader);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.aluKader);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.buisAchterPVC);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.buisAchterPP);
    indexCount++;
    if(!dataList.bochtenInGraden){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bochtAchter);
      indexCount++;
    } else {
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bocht45Achter);
      indexCount++;
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.bocht90Achter);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.reductieAchter);
    indexCount++;
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(rwaPostNumbers.YAchter);
    postenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    let putjeRowRij = 11 + totaalExtraPreviousTotalen + totalRowCountRWA;

    putjesRow = worksheet2.addRow(['', '', '', 'VOOR PUTJE']);
    putjesRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    putjesRow.height = 18;
    putjesRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet2.mergeCells('A' + putjeRowRij + ':C' + putjeRowRij);
    putjesRow.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EEECE1' },
      bgColor: { argb: '000080' },
    };
    putjesRow.getCell('A').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    worksheet2.mergeCells('D' + putjeRowRij + ':G' + putjeRowRij);
    putjesRow.getCell('H').value = 'VOOR PUTJE'
    worksheet2.mergeCells('H' + putjeRowRij + ':' + eindVoorPutje + putjeRowRij);
    putjesRow.getCell(startPutjeEnSoortPutje).value = 'PUTJE';
    worksheet2.mergeCells(startPutjeEnSoortPutje + putjeRowRij + ':' + eindPutKader + putjeRowRij);
    putjesRow.getCell(beginNaPutje).value = 'NA PUTJE';
    worksheet2.mergeCells(beginNaPutje + putjeRowRij + ':' + eindNaPut + putjeRowRij);
    putjesRow.getCell(kolommen[indexEndVoorPutje+1]).border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    putjesRow.getCell(kolommen[indexEndVoorPutje+1]).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEDFF' },
      bgColor: { argb: '000080' },
    };

    //STANDAARD INDEX VANAF R =
    putjesRow.eachCell({ includeEmpty: true }, (cell, number) => {
      if (number === 4 || number === 10) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (indexStartPutjeEnSoortPutje + 16)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EEECE1' },
          bgColor: { argb: '000080' },
        };
      } else if (number === (indexBeginNaPutje + 17)) {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B8CCE4' },
          bgColor: { argb: '000080' },
        };
      }
    });


    worksheet2.pageSetup = {
      orientation: 'landscape',
      paperSize: 9, // 1 = Letter, 9 = A4
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      printArea: 'A1:' + kolommen[indexCount] + (10 + totaalExtraPreviousTotalen + totalRowCount), // Define print area
      margins: {
        left: 0.2, right: 0.2,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
      }
    };
    worksheet2.properties.showGridLines = true;
    worksheet2.views = [
      { zoomScale: 70 }
    ];


























    //begin kolkpage

    let worksheet3 = workbook.addWorksheet('Blad3 KOLK', {
      views: [{ state: "frozen", ySplit: 5 }],
    });

    // Add new row
    titleRow = worksheet3.addRow(['Kolken']);
    titleRow.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    titleRow.height = 23;
    worksheet3.mergeCells('A1:G1');
    worksheet3.mergeCells('L1:P1');
    titleRow.getCell('L').value = 'Bedrijf: ' + companyName;
    titleRow.getCell('S').value = 'Berekening fundering/omhulling:';

    if (dataList.slokkerProjectList.length !== 0) {
      let locationRow = worksheet3.addRow([
        dataList.aannemerProjectNr + ' - ' + dataList.rbProjectNaam +
        ' - ' + dataList.rbGemeente
      ]);
      locationRow.font = {
        name: 'Arial',
        family: 4,
        size: 13,
        bold: true,
      };
      locationRow.height = 20;
      locationRow.getCell('S').value = 'Buis vert: x' + buisVertMult + ', Bocht: x' + bochtMult +
        ", Y-Stuk: x" + yStukMult + ", Indrukmof: x" + mofMult;

    }
    worksheet3.mergeCells('A2:G2');
    //CHECK VOOR NIET GEBRUIKTE VARIABELEN
    notUsedVariableCount = 0;
    if(!dataList.bochtenInGraden){
      notUsedVariableCount++;
    }
    if (!dataList.slokkerSettings.mof) {
      notUsedVariableCount++;
    }
    if (!dataList.slokkerSettings.krimpmof) {
      notUsedVariableCount++;
    }
    if (!dataList.slokkerSettings.koppelstuk) {
      notUsedVariableCount++;
    }
    if (!dataList.slokkerSettings.stop) {
      notUsedVariableCount++;
    }
    if (!dataList.slokkerSettings.andere) {
      notUsedVariableCount++;
    }
    if(!dataList.slokkerSettings.infiltratieKlok){
      notUsedVariableCount++;
    }
    kolommen = ['I','J','K', 'L', 'M', 'N', 'O','P', 'Q'];
    let indexEindStukken = 6 - notUsedVariableCount;
    let eindStukken = kolommen[indexEindStukken];
    let funOmhKolom = kolommen[indexEindStukken + 2];
    /*
    let eindVoorPutje = 'U';
    let startPutjeEnSoortPutje = "W";
    let eindSoortPutje = "Z";
    let beginPutKader = "AA";
    let eindPutKader = "AC";
    let beginNaPutje = "AD"
    let eindBuisNaPut = "AF";
    let stukkenNaPut = "AG";
    let eindNaPut = "AI";
    let indexEndVoorPutje = 5 - notUsedVariableCount;
    eindVoorPutje = kolommen[indexEndVoorPutje];

    let indexStartPutjeEnSoortPutje = 7 - notUsedVariableCount;
    startPutjeEnSoortPutje = kolommen[indexStartPutjeEnSoortPutje];

    let indexEindSoortPutje = 10 - notUsedVariableCount;
    eindSoortPutje = kolommen[indexEindSoortPutje];

    let indexBeginPutKader = 11 - notUsedVariableCount;
    beginPutKader = kolommen[indexBeginPutKader];

    let indexEindPutKader = 13 - notUsedVariableCount;
    eindPutKader = kolommen[indexEindPutKader];

    let indexBeginNaPutje = 14 - notUsedVariableCount;
    beginNaPutje = kolommen[indexBeginNaPutje];

    let indexEindBuisNaPut = 16 - notUsedVariableCount;
    eindBuisNaPut = kolommen[indexEindBuisNaPut];

    let indexStukkenNaPut = 17 - notUsedVariableCount;
    stukkenNaPut = kolommen[indexStukkenNaPut]

    let indexEindPut = 19 - notUsedVariableCount;
    eindNaPut = kolommen[indexEindPut]
    console.log(notUsedVariableCount)
*/

    postenRow = worksheet3.addRow(['Postnummers','', this.PostNumberNullToString(slokkerPostNumbers.buis),
      this.PostNumberNullToString(slokkerPostNumbers.indrukmof), this.PostNumberNullToString(slokkerPostNumbers.ytStuk), this.PostNumberNullToString(slokkerPostNumbers.tBuis), this.PostNumberNullToString(slokkerPostNumbers.flexAan),
      this.PostNumberNullToString(slokkerPostNumbers.reductie)]);
    worksheet3.mergeCells('A3:B3');
    postenRow.font = { name: 'Arial', family: 4, size: 12 };
    postenRow.alignment = {horizontal:'center'}
    indexCount = 0;
    if(!dataList.bochtenInGraden){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.bocht);
      indexCount++;
    } else {
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.bocht45);
      indexCount++;
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.bocht90);
      indexCount++;
    }
    if(dataList.slokkerSettings.mof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.mof);
      indexCount++;
    }
    if(dataList.slokkerSettings.krimpmof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.krimpmof);
      indexCount++;
    }
    if(dataList.slokkerSettings.koppelstuk){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.koppelstuk);
      indexCount++;
    }
    if(dataList.slokkerSettings.stop){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.stop);
      indexCount++;
    }
    if(dataList.slokkerSettings.andere){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.andere);
      indexCount++;
    }
    if(dataList.slokkerSettings.infiltratieKlok){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.infiltratieKolk);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.funOmh);
    indexCount++;
    postenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });


    stukkenRow = worksheet3.addRow(['Straat', 'Kolk nr.','Buis','Indrukmof', 'Y/T-stuk', 'T-buis', 'Flex. aansl.', 'Reductie']);
    stukkenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    stukkenRow.alignment = {horizontal:'center'}
    indexCount = 0;
    if(!dataList.bochtenInGraden){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht';
      indexCount++;
    } else {
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 45°';
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 90°';
      indexCount++;
    }
    if(dataList.slokkerSettings.mof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Mof';
      indexCount++;
    }
    if(dataList.slokkerSettings.krimpmof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Krimpmof';
      indexCount++;
    }
    if(dataList.slokkerSettings.koppelstuk){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Koppelstuk';
      indexCount++;
    }
    if(dataList.slokkerSettings.stop){
      stukkenRow.getCell(kolommen[indexCount]).value ='Stop';
      indexCount++;
    }
    if(dataList.slokkerSettings.andere){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Andere';
      indexCount++;
    }
    if(dataList.slokkerSettings.infiltratieKlok){
      stukkenRow.getCell(kolommen[indexCount]).value = "Infiltratiekolk";
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value = 'Fun/omh';
    indexCount++;
    stukkenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEDFF' },
        bgColor: { argb: '000080' },
      };
    });


    let buisCount = 0;
    let bochtCount = 0;
    let bocht45Count = 0;
    let bocht90Count = 0;
    indrukmofCount = 0;
    let ytStukCount = 0;
    tBuisCount = 0;
    flexAanCount = 0;
    let reductieCount = 0;
    mofCount = 0;
    krimpmofCount = 0;
    koppelstukCount = 0;
    stopCount = 0;
    andereCount = 0;
    let infiltratieKolkCount = 0;
    funOmhCount = 0;
    totalRowCount = 0;
    for (let data of dataList.slokkerProjectList) {
      totalRowCount++;
      let slokker = data;
      let flexAansluiting = 0;
      let indrukmof = 0;
      let infiltratieKolk = 0;
      let mof = 0;
      let tBuis = 0;
      let ytStuk = 0;
      switch (slokker.slokker.tBuisStuk) {
        case 'aanboring':
          indrukmofCount++;
          indrukmof = 1;
          break;
        case 'T-Buis':
          tBuisCount++;
          tBuis = 1;
          break;
        case 'T-Stuk':
          ytStuk = 1;
          ytStukCount++;
          break;
        case 'Y-Stuk':
          ytStuk = 1;
          ytStukCount++;
          break;
        case 'flexAan':
          flexAansluiting = 1;
          flexAanCount++;
          break;
      }
      buisCount += this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2);
      if(!dataList.bochtenInGraden){
        bochtCount += this.NullToZero(slokker.slokker.bocht) + this.NullToZero(slokker.slokker.bocht2);
      } else {
        bocht45Count += this.NullToZero(slokker.slokker.gradenBocht45) + this.NullToZero(slokker.slokker.gradenBocht45Fase2);
        bocht90Count +=  this.NullToZero(slokker.slokker.gradenBocht90) + this.NullToZero(slokker.slokker.gradenBocht90Fase2);
      }
      reductieCount += this.NullToZero(slokker.slokker.reductie);
      ytStukCount += this.NullToZero(slokker.slokker.Y);
      ytStuk += this.NullToZero(slokker.slokker.Y);
      mofCount += this.NullToZero(slokker.slokker.mof);
      krimpmofCount += this.NullToZero(slokker.slokker.krimpmof);
      koppelstukCount += this.NullToZero(slokker.slokker.koppelstuk);
      stopCount += this.NullToZero(slokker.slokker.stop);
      if(slokker.slokker.andere != null && slokker.slokker.andere.trim() !== ''){
        andereCount++;
      }
      if(dataList.slokkerSettings.infiltratieKlok && slokker.slokker.infiltratieKlok){
        infiltratieKolkCount++;
        infiltratieKolk = 1;
      }

      let funOmh = 0;
      if(!dataList.bochtenInGraden){
        funOmh =
          (this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2)) +
          ((this.NullToZero(slokker.slokker.bocht) + this.NullToZero(slokker.slokker.bocht2)) * bochtMult) +
            (ytStuk * yStukMult) +
            (this.NullToZero(indrukmof) * mofMult);
      } else {
        funOmh =
          (this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2)) +
          ((this.NullToZero(slokker.slokker.gradenBocht45) + this.NullToZero(slokker.slokker.gradenBocht45Fase2) +
            this.NullToZero(slokker.slokker.gradenBocht90) + this.NullToZero(slokker.slokker.gradenBocht90Fase2)) * bochtMult) +
            (ytStuk * yStukMult) +
            (this.NullToZero(indrukmof) * mofMult);
      }


      funOmhCount += +funOmh;
      let funOmhString = +(funOmh.toFixed(2));

      let dataRow3 = worksheet3.addRow([
        slokker.street,
        slokker.index,
        this.ConvertNumberToEmptyString(this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2)),
        this.ConvertNumberToEmptyString(indrukmof),
        this.ConvertNumberToEmptyString(ytStuk),
        this.ConvertNumberToEmptyString(tBuis),
        this.ConvertNumberToEmptyString(flexAansluiting),
        this.ConvertNumberToEmptyString(slokker.slokker.reductie)
      ]);
      dataRow3.font = { name: 'Arial', family: 4, size: 12};
      indexCount = 0;
      if(!dataList.bochtenInGraden){
        dataRow3.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(slokker.slokker.bocht) + this.NullToZero(slokker.slokker.bocht2));
        indexCount++;
      } else {
        dataRow3.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(slokker.slokker.gradenBocht45) + this.NullToZero(slokker.slokker.gradenBocht45Fase2));
        indexCount++;
        dataRow3.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(this.NullToZero(slokker.slokker.gradenBocht90) + this.NullToZero(slokker.slokker.gradenBocht90Fase2));
        indexCount++;
      }
      if(dataList.slokkerSettings.mof){
        dataRow3.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(slokker.slokker.mof);
        indexCount++;
      }
      if(dataList.slokkerSettings.krimpmof){
        dataRow3.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(slokker.slokker.krimpmof);
        indexCount++;
      }
      if(dataList.slokkerSettings.koppelstuk){
        dataRow3.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(slokker.slokker.koppelstuk);
        indexCount++;
      }
      if(dataList.slokkerSettings.stop){
        dataRow3.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(slokker.slokker.stop);
        indexCount++;
      }
      if(dataList.slokkerSettings.andere){
        dataRow3.getCell(kolommen[indexCount]).value = slokker.slokker.andere;
        indexCount++;
      }
      if(dataList.slokkerSettings.infiltratieKlok){
        dataRow3.getCell(kolommen[indexCount]).value = this.ConvertNumberToEmptyString(infiltratieKolk);
        indexCount++;
      }
      dataRow3.getCell(kolommen[indexCount]).value = funOmhString;
      indexCount++;
    }
    buisCount = +buisCount.toFixed(2);
    bochtCount = +bochtCount.toFixed(2);
    bocht45Count = +bocht45Count.toFixed(2);
    bocht90Count = +bocht90Count.toFixed(2);
    indrukmofCount = +indrukmofCount.toFixed(2);
    ytStukCount = +ytStukCount.toFixed(2);
    tBuisCount = +tBuisCount.toFixed(2);
    flexAanCount = +flexAanCount.toFixed(2);
    reductieCount = +reductieCount.toFixed(2);
    mofCount = +mofCount.toFixed(2);
    krimpmofCount = +krimpmofCount.toFixed(2);
    koppelstukCount = +koppelstukCount.toFixed(2);
    stopCount = +stopCount.toFixed(2);
    andereCount = +andereCount.toFixed(2);
    infiltratieKolkCount = +infiltratieKolkCount.toFixed(2);
    funOmhCount = +funOmhCount.toFixed(2);


    counter = 0;
    totaalExtraPreviousTotalen = 0;
    if(dataList.totalenMeetstaatKolk != null && dataList.totalenMeetstaatKolk.length !== 0){
      totaalExtraPreviousTotalen = dataList.totalenMeetstaatKolk.length;

      for(let vorige of dataList.totalenMeetstaatKolk){
        counter++;
        let vorigeTotalenRow = worksheet3.addRow([(counter === dataList.totalenMeetstaatKolk.length ? 'Laatste vorige totalen' : 'Vorige totalen'),
          new Date(vorige.date).toLocaleDateString(), vorige.buis, vorige.indrukmof,
          vorige.ytStuk, vorige.tBuis, vorige.flexAan, vorige.reductie]);
        vorigeTotalenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
        vorigeTotalenRow.height = 18;
        vorigeTotalenRow.alignment = { vertical: 'middle', horizontal: 'center' };
        indexCount = 0;

        if(!dataList.bochtenInGraden){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.bocht;
          indexCount++;
        } else {
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gradenBocht45;
          indexCount++;
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.gradenBocht90;
          indexCount++;
        }
        if(dataList.slokkerSettings.mof){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.mof;
          indexCount++;
        }
        if(dataList.slokkerSettings.krimpmof){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.krimpmof;
          indexCount++;
        }
        if(dataList.slokkerSettings.koppelstuk){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.koppelstuk;
          indexCount++;
        }
        if(dataList.slokkerSettings.stop){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.stop;
          indexCount++;
        }
        if(dataList.slokkerSettings.andere){
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.andere;
          indexCount++;
        }
        if(dataList.slokkerSettings.infiltratieKlok) {
          vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.infiltratieKolk;
          indexCount++;
        }

        vorigeTotalenRow.getCell(kolommen[indexCount]).value = vorige.funOmh;
        indexCount++;
        if(counter === dataList.totalenMeetstaatKolk.length){
          vorigeTotalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '44c7dbFF' },
              bgColor: { argb: '44db58FF' },
            };
            cell.border = {
              top: { style: 'medium' },
              left: { style: 'medium' },
              bottom: { style: 'medium' },
              right: { style: 'medium' },
            };
          });
        } else {
          vorigeTotalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }
      }
    }

    totaalKolommen = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI','AJ', 'AK', 'AL'];

    if(totaalExtraPreviousTotalen > 0) {
      let latestTotalen = dataList.totalenMeetstaatKolk[dataList.totalenMeetstaatKolk.length - 1];
      let verschilTotalenRow = worksheet3.addRow(['VERSCHIL totalen', '']);
      verschilTotalenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
      verschilTotalenRow.height = 18;
      verschilTotalenRow.alignment = { vertical: 'middle', horizontal: 'center' };
      indexCount = 0;
      let verschilRow = 5 + totaalExtraPreviousTotalen + totalRowCount;
      let column = 'C';
      for(let i = 0; i < 6; i++){
        column = totaalKolommen[i];
        verschilTotalenRow.getCell(totaalKolommen[i]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(!dataList.bochtenInGraden){
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      } else {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if (dataList.slokkerSettings.mof) {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if (dataList.slokkerSettings.krimpmof) {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if (dataList.slokkerSettings.koppelstuk) {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if (dataList.slokkerSettings.stop) {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if (dataList.slokkerSettings.andere) {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      if(dataList.slokkerSettings.infiltratieKlok) {
        column = totaalKolommen[indexCount];
        verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
        indexCount++;
      }
      column = totaalKolommen[indexCount];
      verschilTotalenRow.getCell(totaalKolommen[indexCount]).value = { formula: "=(" + column + (verschilRow+1) +  "-" + column + (verschilRow-1) + ')', date1904: false };
      indexCount++;
      verschilTotalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'f2f2f2' },
          bgColor: { argb: 'f2f2f2' },
        };
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
      });
    }

    totalenRow = worksheet3.addRow(['Huidige totalen', '', '']);
    totalenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    totalenRow.height = 18;
    totalenRow.alignment = { vertical: 'middle', horizontal: 'center' };
    indexCount = 0;
    eindKolomNewData = 4 + totalRowCount;
    row = "C";
    for(let i = 0; i < 6; i++){
      row = totaalKolommen[i];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "5:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }

    if(!dataList.bochtenInGraden){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "5:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    } else {
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "5:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "5:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.slokkerSettings.mof){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "5:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.slokkerSettings.krimpmof){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "5:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.slokkerSettings.koppelstuk){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "5:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.slokkerSettings.stop){
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "5:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    if(dataList.slokkerSettings.andere){
      nonEmptyCount = 0;
      const startRow = 5;
      const endRow = eindKolomNewData; // The end row number
      for (let i = startRow; i <= endRow; i++) {
        let cellValue = worksheet3.getCell(`${row}${i}`).value;
        // Check if the cell is not null/undefined, and is not an empty string
        if (cellValue !== null && cellValue !== undefined && cellValue.toString().trim() !== '') {
          nonEmptyCount++;
        }
      }
      totalenRow.getCell(totaalKolommen[indexCount]).value = nonEmptyCount;
      indexCount++;
    }
    if(dataList.slokkerSettings.infiltratieKlok) {
      row = totaalKolommen[indexCount];
      totalenRow.getCell(row).value = { formula: "=SUM(" + row + "5:" + row + eindKolomNewData + ')', date1904: false };
      indexCount++;
    }
    row = totaalKolommen[indexCount];
    totalenRow.getCell(row).value = { formula: "=SUM(" + row + "5:" + row + eindKolomNewData + ')', date1904: false };
    indexCount++;
    totalenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF21' },
        bgColor: { argb: 'FFFF21' },
      };
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    worksheet3.columns.forEach(function (column, i) {
      let maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        if(!allStrings.find(x => x === cell.value)){
          let columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength ) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 4;
    });
    stukkenRow = worksheet3.addRow(['Straat', 'Kolk nr.','Buis','Indrukmof', 'Y/T-stuk', 'T-buis', 'Flex. aansl.', 'Reductie']);
    stukkenRow.font = { name: 'Arial', family: 4, size: 13, bold: true };
    stukkenRow.alignment = {horizontal:'center'}
    indexCount = 0;
    if(!dataList.bochtenInGraden){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht';
      indexCount++;
    } else {
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 45°';
      indexCount++;
      stukkenRow.getCell(kolommen[indexCount]).value = 'Bocht 90°';
      indexCount++;
    }
    if(dataList.slokkerSettings.mof){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Mof'
      indexCount++;
    }
    if(dataList.slokkerSettings.krimpmof){
      stukkenRow.getCell(kolommen[indexCount]).value ='Krimpmof'
      indexCount++;
    }
    if(dataList.slokkerSettings.koppelstuk){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Koppelstuk'
      indexCount++;
    }
    if(dataList.slokkerSettings.stop){
      stukkenRow.getCell(kolommen[indexCount]).value ='Stop'
      indexCount++;
    }
    if(dataList.slokkerSettings.andere){
      stukkenRow.getCell(kolommen[indexCount]).value = 'Andere'
      indexCount++;
    }
    if(dataList.slokkerSettings.infiltratieKlok) {
      stukkenRow.getCell(kolommen[indexCount]).value = "Infiltratiekolk";
      indexCount++;
    }
    stukkenRow.getCell(kolommen[indexCount]).value ='Fun/omh'
    indexCount++;
    stukkenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEDFF' },
        bgColor: { argb: '000080' },
      };
    });

    postenRow = worksheet3.addRow(['Postnummers','', this.PostNumberNullToString(slokkerPostNumbers.buis),
      this.PostNumberNullToString(slokkerPostNumbers.indrukmof), this.PostNumberNullToString(slokkerPostNumbers.ytStuk), this.PostNumberNullToString(slokkerPostNumbers.tBuis), this.PostNumberNullToString(slokkerPostNumbers.flexAan),
      this.PostNumberNullToString(slokkerPostNumbers.reductie)]);
    let postenRowIndex = 8 + totaalExtraPreviousTotalen + totalRowCount;
    console.log(postenRowIndex)
   worksheet3.mergeCells('A' + postenRowIndex + ':B' + postenRowIndex);
    postenRow.font = { name: 'Arial', family: 4, size: 12 };
    postenRow.alignment = {horizontal:'center'}
    indexCount = 0;
    if(!dataList.bochtenInGraden){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.bocht);
      indexCount++;
    } else {
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.bocht45);
      indexCount++;
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.bocht90);
      indexCount++;
    }
    if(dataList.slokkerSettings.mof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.mof);
      indexCount++;
    }
    if(dataList.slokkerSettings.krimpmof){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.krimpmof);
      indexCount++;
    }
    if(dataList.slokkerSettings.koppelstuk){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.koppelstuk);
      indexCount++;
    }
    if(dataList.slokkerSettings.stop){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.stop);
      indexCount++;
    }
    if(dataList.slokkerSettings.andere){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.andere);
      indexCount++;
    }
    if(dataList.slokkerSettings.infiltratieKlok){
      postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.infiltratieKolk);
      indexCount++;
    }
    postenRow.getCell(kolommen[indexCount]).value = this.PostNumberNullToString(slokkerPostNumbers.funOmh);
    postenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });

    worksheet3.pageSetup = {
      orientation: 'landscape',
      paperSize: 9, // 1 = Letter, 9 = A4
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      printArea: 'A1:' + kolommen[indexCount] + (10 + totaalExtraPreviousTotalen + totalRowCount), // Define print area
      margins: {
        left: 0.2, right: 0.2,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
      }
    };
    worksheet3.properties.showGridLines = true;
    worksheet3.views = [
      { zoomScale: 77 }
    ];


    if (logoURL != null) {
      this.getBase64ImageFromUrl(logoURL)
        .then(result => {
          let base64 = result as string;
          let logo = workbook.addImage({
            base64: base64,
            extension: 'png',
          });
          worksheet.addImage(logo, 'K1:M2');
          worksheet2.addImage(logo, 'K1:M2');
          worksheet3.addImage(logo, 'S7:U9');
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            fs.saveAs(blob, companyName + '-' + dataList.rbProjectNr + "-" + dataList.rbProjectNaam + "-" + dataList.rbGemeente + " MEETSTAAT.xlsx");
          });
        })
        .catch(err => console.error(err));
    } else {
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        fs.saveAs(blob, companyName + '-' + dataList.rbProjectNr + "-" + dataList.rbProjectNaam + "-" + dataList.rbGemeente + " MEETSTAAT.xlsx");
      });
    }

    if(isVordering){
      //SAVE MEETSTAAT TOTALEN
      let totalenMeetstaatKolk = new SlokkerTotaalMeetstaat(indrukmofCount,tBuisCount,ytStukCount,flexAanCount,buisCount,bochtCount,reductieCount,funOmhCount,mofCount,
        krimpmofCount,koppelstukCount,stopCount,andereCount,infiltratieKolkCount, bocht45Count, bocht90Count);
      console.log(totalenMeetstaatDWA)
      dataList.totalenMeetstaatDWA = [];
      dataList.totalenMeetstaatKolk = [];
      dataList.totalenMeetstaatRWA = [];
      dataList.totalenMeetstaatKolk.push(totalenMeetstaatKolk);
      dataList.totalenMeetstaatDWA.push(totalenMeetstaatDWA);
      dataList.totalenMeetstaatRWA.push(totalenMeetstaatRWA);
      this.apiService.updateTotalenMeetstaat(dataList).subscribe(x => {
        console.log('updated totalenMeetstaatDWA')
      })
    }
  }


  NullToString(check: string) {
    if (check == null) {
      return '';
    } else {
      return check;
    }
  }
  PostNumberNullToString(check: string) {
    if (check == null) {
      return '';
    } else {
      return check;
    }
  }
  NullToZero(number) {
    if (number == null) {
      return 0;
    } else {
      return number;
    }
  }

  convertBuisStuk(input) {
    if (input != null && (input === 'T-Stuk' || input === 'Y-Stuk')) {
      return 1;
    } else {
      return 0;
    }
  }

  ConvertNumberToEmptyString(input: number) {
    if (input == null || input === 0) {
      return '';
    } else {
      return input;
    }
  }

  BoolToString(bool: boolean) {
    if (bool == null || bool === false) {
      return '';
    } else {
      return 'ja';
    }
  }

  checkHasDWA(dwa: Waterafvoer) {
    if ((dwa.buisVoorHor == null || dwa.buisVoorHor === 0 || dwa.buisVoorHor.toString() === '')
      && (dwa.buisVoorVert == null || dwa.buisVoorVert === 0 || dwa.buisVoorVert.toString() === '')
      && (dwa.bochtVoor == null || dwa.bochtVoor === 0 || dwa.bochtVoor.toString() === '')
      && (dwa.reductieVoor == null || dwa.reductieVoor === 0 || dwa.reductieVoor.toString() === '')
      && (dwa.buisVoorHor2 == null || dwa.buisVoorHor2 === 0 || dwa.buisVoorHor2.toString() === '')
      && (dwa.buisVoorVert2 == null || dwa.buisVoorVert2 === 0 || dwa.buisVoorVert2.toString() === '')
      && (dwa.bochtVoor2 == null || dwa.bochtVoor2 === 0 || dwa.bochtVoor2.toString() === '')
      && (dwa.reductieVoor2 == null || dwa.reductieVoor2 === 0 || dwa.reductieVoor2.toString() === '')
      && (dwa.buisAchter == null || dwa.buisAchter === 0 || dwa.buisAchter.toString() === '')
      && (dwa.bochtAchter == null || dwa.bochtAchter === 0 || dwa.bochtAchter.toString() === '')
      && (dwa.reductieAchter == null || dwa.reductieAchter === 0 || dwa.reductieAchter.toString() === '')
      && (dwa.YAchter == null || dwa.YAchter === 0 || dwa.YAchter.toString() === '') &&
      (!dwa.gradenBochtVoor45 || dwa.gradenBochtVoor45 === 0 || dwa.gradenBochtVoor45.toString() === '') &&
      (!dwa.gradenBochtVoor90 || dwa.gradenBochtVoor90 === 0 || dwa.gradenBochtVoor90.toString() === '') &&
      (!dwa.gradenBocht2Voor45 || dwa.gradenBocht2Voor45 === 0 || dwa.gradenBocht2Voor45.toString() === '') &&
      (!dwa.gradenBocht2Voor90 || dwa.gradenBocht2Voor90 === 0 || dwa.gradenBocht2Voor90.toString() === '') &&
      (!dwa.gradenBochtAchter45 || dwa.gradenBochtAchter45 === 0 || dwa.gradenBochtAchter45.toString() === '') &&
      (!dwa.gradenBochtAchter90 || dwa.gradenBochtAchter90 === 0 || dwa.gradenBochtAchter90.toString() === '')) {
      return false;
    } else {
      return true;
    }
  }


  checkHasRWA(rwa: Waterafvoer) {
    if ((rwa.buisVoorHor == null || rwa.buisVoorHor === 0 || rwa.buisVoorHor.toString() === '')
      && (rwa.buisVoorVert == null || rwa.buisVoorVert === 0 || rwa.buisVoorVert.toString() === '')
      && (rwa.bochtVoor == null || rwa.bochtVoor === 0 || rwa.bochtVoor.toString() === '')
      && (rwa.reductieVoor == null || rwa.reductieVoor === 0 || rwa.reductieVoor.toString() === '')
      && (rwa.buisVoorHor2 == null || rwa.buisVoorHor2 === 0 || rwa.buisVoorHor2.toString() === '')
      && (rwa.buisVoorVert2 == null || rwa.buisVoorVert2 === 0 || rwa.buisVoorVert2.toString() === '')
      && (rwa.bochtVoor2 == null || rwa.bochtVoor2 === 0 || rwa.bochtVoor2.toString() === '')
      && (rwa.reductieVoor2 == null || rwa.reductieVoor2 === 0 || rwa.reductieVoor2.toString() === '')
      && (rwa.buisAchter == null || rwa.buisAchter === 0 || rwa.buisAchter.toString() === '')
      && (rwa.bochtAchter == null || rwa.bochtAchter === 0 || rwa.bochtAchter.toString() === '')
      && (rwa.reductieAchter == null || rwa.reductieAchter === 0 || rwa.reductieAchter.toString() === '')
      && (rwa.YAchter == null || rwa.YAchter === 0 || rwa.YAchter.toString() === '') &&
      (!rwa.gradenBochtVoor45 || rwa.gradenBochtVoor45 === 0 || rwa.gradenBochtVoor45.toString() === '') &&
      (!rwa.gradenBochtVoor90 || rwa.gradenBochtVoor90 === 0 || rwa.gradenBochtVoor90.toString() === '') &&
      (!rwa.gradenBocht2Voor45 || rwa.gradenBocht2Voor45 === 0 || rwa.gradenBocht2Voor45.toString() === '') &&
      (!rwa.gradenBocht2Voor90 || rwa.gradenBocht2Voor90 === 0 || rwa.gradenBocht2Voor90.toString() === '') &&
      (!rwa.gradenBochtAchter45 || rwa.gradenBochtAchter45 === 0 || rwa.gradenBochtAchter45.toString() === '') &&
      (!rwa.gradenBochtAchter90 || rwa.gradenBochtAchter90 === 0 || rwa.gradenBochtAchter90.toString() === '')) {
      return false;
    } else {
      return true;
    }
  }
}
