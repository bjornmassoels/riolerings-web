import { Injectable, ElementRef } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import {Group} from "../models/groups";
import {Postnumbers} from "../models/postnumbers";
import {SlokkerPostnumbers} from "../models/slokker-postnumbers";
import {ApiService} from "./api.service";
import {Waterafvoer} from "../models/waterafvoer";
@Injectable()
export class ExcelService {
  constructor(private apiService: ApiService) {}

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }
  generateExcel(title: string, dataList: Group, logoURL: string, companyName: string){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Algemene gegevens');
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
    titleRow.getCell('B').
    worksheet.mergeCells('A1:B1');
    let emptyRow = worksheet.addRow([""]);
    worksheet.columns.forEach(function (column, i) {
      if(i === 1){
        column.width = 70;
      } else if (i === 0) {
        column.width = 36;
      } else if(i === 4){
        column.width = 36;
      }
    });

    // RIOOLBEHEERDER
    let rbRow = worksheet.addRow(['Rioolbeheerder']);
    rbRow.font = { name: 'Arial', family: 4, size: 14 , bold: true, underline: true};
    rbRow.getCell('A').value = 'Rioolbeheerder';
    let rbRow2 = worksheet.addRow(['Naam']);
    rbRow2.getCell('A').value = 'Naam rioolbeheerder:';
    rbRow2.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ADD8E6' },
      bgColor: { argb: '000080' },
    };
    rbRow2.getCell('B').value = " " + dataList.rbNaam;
    rbRow2.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });
    let rbRow3 = worksheet.addRow(['Projectnummer']);
    rbRow3.getCell('A').value = 'Projectnummer:';
    rbRow3.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ADD8E6' },
      bgColor: { argb: '000080' },
    };
    rbRow3.getCell('B').value = " " + dataList.rbProjectNr;
    rbRow3.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });
    let rbRow4 = worksheet.addRow(['Projectnaam']);
    rbRow4.getCell('A').value = 'Projectnaam:';
    rbRow4.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ADD8E6' },
      bgColor: { argb: '000080' },
    };
    rbRow4.getCell('B').value = " " + dataList.rbProjectNaam;
    rbRow4.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });
    let rbRow5 = worksheet.addRow(['Gemeente']);
    rbRow5.getCell('A').value = 'Gemeente:';
    rbRow5.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ADD8E6' },
      bgColor: { argb: '000080' },
    };
    rbRow5.getCell('B').value = " " + dataList.rbGemeente;
    rbRow5.getCell('E').value = 'gemeentecode fiche:   ' + dataList.gemeenteCode;
    rbRow5.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });
    //BOUWHEER
    let emptyRow2 = worksheet.addRow([""]);
    let bhRow = worksheet.addRow(['Bouwheer']);
    bhRow.font = { name: 'Arial', family: 4, size: 14 , bold: true, underline: true};
    bhRow.getCell('A').value = 'Bouwheer';
    let bhRow2 = worksheet.addRow(['Naam bouwheer']);
    bhRow2.getCell('A').value = 'Naam bouwheer:';
    bhRow2.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ADD8E6' },
      bgColor: { argb: '000080' },
    };
    bhRow2.getCell('B').value = " " + dataList.bhNaam;
    bhRow2.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });
    bhRow2.getCell('E').value = 'Bedrijfsnaam : ';
    bhRow2.getCell('E').font = { name: 'Arial', family: 4, size: 14};
    bhRow2.getCell('H').value = companyName;
    bhRow2.getCell('H').font = { name: 'Arial', family: 4, size: 14, bold: true};
    let bhRow3 = worksheet.addRow(['Projectnummer']);
    bhRow3.getCell('A').value = 'Projectnummer:';
    bhRow3.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ADD8E6' },
      bgColor: { argb: '000080' },
    };
    bhRow3.getCell('B').value = " " + dataList.bhProjectNr;
    bhRow3.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });
    let bhRow4 = worksheet.addRow(['Projectnaam']);
    bhRow4.font = { name: 'Arial', family: 4, size: 14};
    bhRow4.getCell('A').value = 'Projectnaam:';
    bhRow4.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ADD8E6' },
      bgColor: { argb: '000080' },
    };
    bhRow4.getCell('B').value = " " + dataList.bhProjectNaam;
    bhRow4.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });

    //AANNEMER
    let emptyRow4 = worksheet.addRow([""]);
    let aanRow = worksheet.addRow(['Aannemer']);
    aanRow.font = { name: 'Arial', family: 4, size: 14 , bold: true, underline: true};
    aanRow.getCell('A').value = 'Aannemer';
    let aanRow2 = worksheet.addRow(['Projectnummer']);
    aanRow2.getCell('A').value = 'Projectnummer:';
    aanRow2.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' },
      bgColor: { argb: 'FFFF00' },
    };
    aanRow2.getCell('B').value = " " + dataList.aannemerProjectNr;
    aanRow2.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });
    let aanRow3 = worksheet.addRow(['naam aannemer:']);
    aanRow3.font = { name: 'Arial', family: 4, size: 14};
    aanRow3.getCell('A').value = 'Naam aannemer:';
    aanRow3.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' },
      bgColor: { argb: 'FFFF00' },
    };
    aanRow3.getCell('B').value = " " + dataList.aannemerNaam;
    aanRow3.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });
    let aanRow4 = worksheet.addRow(['Werfleider']);
    aanRow4.font = { name: 'Arial', family: 4, size: 14};
    aanRow4.getCell('A').value = 'Werfleider:';
    aanRow4.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' },
      bgColor: { argb: 'FFFF00' },
    };
    aanRow4.getCell('B').value = " " + dataList.aannemerWerfleider;
    aanRow4.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });

    //MEDEOPDRACHTGEVER
    let emptyRow3 = worksheet.addRow([""]);
    let moRow = worksheet.addRow(['Medeopdrachtgever']);
    moRow.font = { name: 'Arial', family: 4, size: 14 , bold: true, underline: true};
    moRow.getCell('A').value = 'Medeopdrachtgever';
    let moRow2 = worksheet.addRow(['naam medeopdrachtgever']);
    moRow2.getCell('A').value = 'Naam medeopdrachtgever:';
    moRow2.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ADD8E6' },
      bgColor: { argb: '000080' },
    };
    moRow2.getCell('B').value = " " +  dataList.mogNaam;
    moRow2.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });
    let moRow3 = worksheet.addRow(['Projectnummer']);
    moRow3.getCell('A').value = 'Projectnummer:';
    moRow3.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ADD8E6' },
      bgColor: { argb: '000080' },
    };
    moRow3.getCell('B').value = " " + dataList.mogProjectNr;
    moRow3.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });
    let moRow4 = worksheet.addRow(['Projectnaam']);
    moRow4.getCell('A').value = 'Projectnaam:';
    moRow4.getCell('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ADD8E6' },
      bgColor: { argb: '000080' },
    };
    moRow4.getCell('B').value = " " + dataList.mogProjectNaam;
    moRow4.eachCell((cell, i) => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14};
    });


    if(dataList.secondMogOn){
      //MEDEOPDRACHTGEVER
      let emptyRow3 = worksheet.addRow([""]);
      let moRow = worksheet.addRow(['Extra Medeopdrachtgever 2']);
      moRow.font = { name: 'Arial', family: 4, size: 14 , bold: true, underline: true};
      moRow.getCell('A').value = 'Medeopdrachtgever 2';
      let moRow2 = worksheet.addRow(['naam medeopdrachtgever']);
      moRow2.getCell('A').value = 'Naam medeopdrachtgever:';
      moRow2.getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
        bgColor: { argb: 'FFFF00' },
      };
      moRow2.getCell('B').value = " " + dataList.mogNaam1;
      moRow2.eachCell((cell, i) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        };
        cell.font = { name: 'Arial', family: 4, size: 14};
      });
      let moRow3 = worksheet.addRow(['Projectnummer']);
      moRow3.getCell('A').value = 'Projectnummer:';
      moRow3.getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
        bgColor: { argb: 'FFFF00' },
      };
      moRow3.getCell('B').value = " " + dataList.mogProjectNr1;
      moRow3.eachCell((cell, i) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        };
        cell.font = { name: 'Arial', family: 4, size: 14};
      });
      let moRow4 = worksheet.addRow(['Projectnaam']);
      moRow4.getCell('A').value = 'Projectnaam:';
      moRow4.getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
        bgColor: { argb: 'FFFF00' },
      };
      moRow4.getCell('B').value = " " + dataList.mogProjectNaam1;
      moRow4.eachCell((cell, i) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        };
        cell.font = { name: 'Arial', family: 4, size: 14};
      });

    }
    if(dataList.thirdMogOn){
      //MEDEOPDRACHTGEVER
      let emptyRow3 = worksheet.addRow([""]);
      let moRow = worksheet.addRow(['Extra Medeopdrachtgever 3']);
      moRow.font = { name: 'Arial', family: 4, size: 14 , bold: true, underline: true};
      moRow.getCell('A').value = 'Medeopdrachtgever 3';
      let moRow2 = worksheet.addRow(['naam medeopdrachtgever']);
      moRow2.getCell('A').value = 'Naam medeopdrachtgever:';
      moRow2.getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
        bgColor: { argb: 'FFFF00' },
      };
      moRow2.getCell('B').value = " " + dataList.mogNaam2;
      moRow2.eachCell((cell, i) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        };
        cell.font = { name: 'Arial', family: 4, size: 14};
      });
      let moRow3 = worksheet.addRow(['Projectnummer']);
      moRow3.getCell('A').value = 'Projectnummer:';
      moRow3.getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
        bgColor: { argb: 'FFFF00' },
      };
      moRow3.getCell('B').value = " " + dataList.mogProjectNr2;
      moRow3.eachCell((cell, i) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        };
        cell.font = { name: 'Arial', family: 4, size: 14};
      });
      let moRow4 = worksheet.addRow(['Projectnaam']);
      moRow4.getCell('A').value = 'Projectnaam:';
      moRow4.getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
        bgColor: { argb: 'FFFF00' },
      };
      moRow4.getCell('B').value = " " + dataList.mogProjectNaam2;
      moRow4.eachCell((cell, i) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        };
        cell.font = { name: 'Arial', family: 4, size: 14};
      });

    }

    //page project HA

    let worksheet2 = workbook.addWorksheet('Project HA', {
      views: [{state: "frozen", ySplit: 3  }, {state: "frozen", ySplit: 4  }],
    });
    // Add new row
    let titleRow2 = worksheet2.addRow(['Aansluitingen bestaande woningen']);
    titleRow2.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    titleRow2.height = 32;
    worksheet2.mergeCells('A1:C1');
    let emptyRow5 = worksheet2.addRow([""]);
    let infoRow = worksheet2.addRow([""]);
    worksheet2.mergeCells('H3:J3');
    infoRow.getCell('H').value = "lambert coördinaten - deksel HA-putje";
    infoRow.getCell('H').border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    infoRow.getCell('H').font = { name: 'Arial', family: 4, size: 11, bold: true};
    infoRow.getCell('H').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet2.mergeCells('K3:U3');
    infoRow.getCell('K').value = "HOEVEELHEDEN aansluiting";
    infoRow.getCell('K').border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    infoRow.getCell('K').font = { name: 'Arial', family: 4, size: 11, bold: true};
    infoRow.getCell('K').alignment = { vertical: 'middle', horizontal: 'center' };

    let headers = ['Straat','Huisnr','Equipmentnr. riolering','aard water\n (RWA/DWA/\nGEM)', 'soort\n(HA,WA)', 'diameter\n(mm)', 'materiaal',
      'X-coördinaat', 'Y-coördinaat', 'Z-coördinaat', 'Mof\n(st)', 'Buis\n(m)', 'Bocht\n(st)', 'Y/T-stuk\n(st)', 'Krimpmof\n(st)', 'Koppelstuk\n(st)', 'Reductie\n(st)',
      'Stop\n(st)', 'Andere', 'diameter\nHA-putje of\nT-stuk\n(mm)', 'Terugslag-\nklep in HA-\nputje', 'naamgeving fiche'];

    //Add Header Row
    let headerRow = worksheet2.addRow(headers);

    // Cell Style : Fill and Border
    headerRow.height = 55;
    headerRow.eachCell((cell, number) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A3866A' },
        bgColor: { argb: 'C4A484' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true};
    });
    // Set font, size and style in title row.
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' , wrapText: true};
    headerRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    // Blank Row
    worksheet2.columns.forEach(function (column, i) {
      if (i === 0) {
        column.width = 34;
      } else if (i === 1) {
        column.width = 10;
      } else if (i === 6) {
        column.width = 11;
      } else if (i === 4 || i === 5) {
        column.width = 12;
      } else if (i === 7 || i === 8 || i === 9 || i === 5) {
        column.width = 15;
      } else if (i === 21) {
        column.width = 90;
      } else if (i === 10 || i === 11 || i === 12 || i === 17) {
        column.width = 9;
      }  else if(i === 2){
        column.width = 27;
      } else {
        column.width = 13;
      }
    });
    let mofCountDWA = 0;
    let ytStukCountDWA = 0;
    let buisCountDWA = 0;
    let bochtCountDWA = 0;
    let reductieCountDWA = 0;
    let krimpmofCountDWA = 0;
    let koppelstukCountDWA = 0;
    let stopCountDWA = 0;
    let mofCountRWA = 0;
    let ytStukCountRWA = 0;
    let buisCountRWA = 0;
    let bochtCountRWA = 0;
    let reductieCountRWA = 0;
    let krimpmofCountRWA = 0;
    let koppelstukCountRWA = 0;
    let stopCountRWA = 0;
    let mofCountGEM = 0;
    let ytStukCountGEM = 0;
    let buisCountGEM = 0;
    let bochtCountGEM = 0;
    let reductieCountGEM= 0;
    let krimpmofCountGEM = 0;
    let koppelstukCountGEM = 0;
    let stopCountGEM = 0;
    let index = 0;

    for (let data of dataList.projectList) {
      let project = data;
      let hasRWA = true;
      if(project.regenWaterAfvoer != null && !project.isGemengd) {
        if ((project.regenWaterAfvoer.isWachtaansluiting == null || project.regenWaterAfvoer.isWachtaansluiting === false) &&
          (project.isWachtAansluiting == null || project.isWachtAansluiting === false)){
          if (this.checkHasRWA(project.regenWaterAfvoer)) {
            if (dataList.heeftPloegen == null || dataList.heeftPloegen === false) {
              mofCountRWA += this.NullToZero(project.regenWaterAfvoer.mof);
              ytStukCountRWA += this.convertBuisStuk(project.regenWaterAfvoer.tBuisStuk) + this.NullToZero(project.regenWaterAfvoer.YAchter);
              buisCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert)
                + this.NullToZero(project.regenWaterAfvoer.buisAchter);
              let bochtenCount = 0;
              if(!dataList.bochtenInGraden){
                bochtenCount += this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtAchter);
              } else {
                bochtenCount += this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter45)
                + this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter90);
              }
              bochtCountRWA += bochtenCount;
              reductieCountRWA += this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieAchter);
              krimpmofCountRWA += this.NullToZero(project.regenWaterAfvoer.krimpmof);
              koppelstukCountRWA += this.NullToZero(project.regenWaterAfvoer.koppelstuk);
              stopCountRWA += this.NullToZero(project.regenWaterAfvoer.stop);

              let tStuk = 0;
              if (project.regenWaterAfvoer.soortPutje === 't-stuk') {
                tStuk += 1;
                ytStukCountRWA++;
              }
              let dataRow = worksheet2.addRow([
                project?.street,
                project?.huisNr,
                project.equipNrRiolering,
                "RWA",
                "HA",
                this.NullToString(project.regenWaterAfvoer.diameter === 'andere' ? project.regenWaterAfvoer.diameterAndere : project.regenWaterAfvoer.diameter),
                this.NullToString(project.regenWaterAfvoer.buisType),
                this.NullToString(project.regenWaterAfvoer.xCoord),
                this.NullToString(project.regenWaterAfvoer.yCoord),
                this.NullToString(project.regenWaterAfvoer.zCoord),
                this.NullToZero(project.regenWaterAfvoer.mof),
                this.NullToZero(project.regenWaterAfvoer.buisVoorHor) +
                this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisAchter),
                bochtenCount,
                this.convertBuisStuk(project.regenWaterAfvoer.tBuisStuk) + this.NullToZero(project.regenWaterAfvoer.YAchter) + tStuk,
                this.NullToZero(project.regenWaterAfvoer.krimpmof),
                this.NullToZero(project.regenWaterAfvoer.koppelstuk),
                this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieAchter),
                this.NullToZero(project.regenWaterAfvoer.stop),
                this.NullToString(project.regenWaterAfvoer.andere),
                this.NullToZero(project.regenWaterAfvoer.diameterPut),
                this.BoolToString(project.regenWaterAfvoer.terugslagklep)
              ]);

              dataRow.alignment = {vertical: 'middle', horizontal: 'center'};
              dataRow.eachCell({includeEmpty: true}, (cell, number) => {
                cell.border = {
                  top: {style: 'thin'},
                  left: {style: 'thin'},
                  bottom: {style: 'thin'},
                  right: {style: 'thin'},
                };
              });
              dataRow.getCell('A').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'left'};
              dataRow.getCell('B').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'left'};
              dataRow.getCell('C').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'left'};
              dataRow.getCell('F').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('G').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('H').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('I').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('J').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('K').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('L').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('M').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('N').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('O').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('P').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('Q').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('R').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('S').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('T').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('U').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
            } else {
              mofCountRWA += this.NullToZero(project.regenWaterAfvoer.mof);
              ytStukCountRWA += this.convertBuisStuk(project.regenWaterAfvoer.tBuisStuk) + this.NullToZero(project.regenWaterAfvoer.YAchter);
              buisCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + +this.NullToZero(project.regenWaterAfvoer.buisVoorVert2)
                + this.NullToZero(project.regenWaterAfvoer.buisAchter);
              let bochtenCount = 0;
              if(!dataList.bochtenInGraden){
                bochtenCount += this.NullToZero(project.regenWaterAfvoer.bochtVoor) +  this.NullToZero(project.regenWaterAfvoer.bochtVoor2) + this.NullToZero(project.regenWaterAfvoer.bochtAchter);
              } else {
                bochtenCount += this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter45)
                  + this.NullToZero(project.regenWaterAfvoer.gradenBocht2Voor45) + this.NullToZero(project.regenWaterAfvoer.gradenBocht2Voor90)+
                  + this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter90);
              }
              bochtCountRWA += bochtenCount;
              reductieCountRWA += this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2) + this.NullToZero(project.regenWaterAfvoer.reductieAchter);
              krimpmofCountRWA += this.NullToZero(project.regenWaterAfvoer.krimpmof);
              koppelstukCountRWA += this.NullToZero(project.regenWaterAfvoer.koppelstuk);
              stopCountRWA += this.NullToZero(project.regenWaterAfvoer.stop);

              let tStuk = 0;
              if (project.regenWaterAfvoer.soortPutje === 't-stuk') {
                tStuk += 1;
                ytStukCountRWA++;
              }
              let dataRow = worksheet2.addRow([
                project?.street,
                project?.huisNr,
                project.equipNrRiolering,
                "RWA",
                "HA",
                this.NullToString(project.regenWaterAfvoer.diameter === 'andere' ? project.regenWaterAfvoer.diameterAndere : project.regenWaterAfvoer.diameter),
                this.NullToString(project.regenWaterAfvoer.buisType),
                this.NullToString(project.regenWaterAfvoer.xCoord),
                this.NullToString(project.regenWaterAfvoer.yCoord),
                this.NullToString(project.regenWaterAfvoer.zCoord),
                this.NullToZero(project.regenWaterAfvoer.mof),
                this.NullToZero(project.regenWaterAfvoer.buisVoorHor) +
                this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2) +
                this.NullToZero(project.regenWaterAfvoer.buisVoorVert2) + this.NullToZero(project.regenWaterAfvoer.buisAchter),
                bochtenCount,
                this.convertBuisStuk(project.regenWaterAfvoer.tBuisStuk) + this.NullToZero(project.regenWaterAfvoer.YAchter) + tStuk,
                this.NullToZero(project.regenWaterAfvoer.krimpmof),
                this.NullToZero(project.regenWaterAfvoer.koppelstuk),
                this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2)
                + this.NullToZero(project.regenWaterAfvoer.reductieAchter),
                this.NullToZero(project.regenWaterAfvoer.stop),
                this.NullToString(project.regenWaterAfvoer.andere),
                this.NullToZero(project.regenWaterAfvoer.diameterPut),
                this.BoolToString(project.regenWaterAfvoer.terugslagklep)
              ]);

              dataRow.alignment = {vertical: 'middle', horizontal: 'center'};
              dataRow.eachCell({includeEmpty: true}, (cell, number) => {
                cell.border = {
                  top: {style: 'thin'},
                  left: {style: 'thin'},
                  bottom: {style: 'thin'},
                  right: {style: 'thin'},
                };
              });
              dataRow.getCell('A').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'left'};
              dataRow.getCell('B').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'left'};
              dataRow.getCell('C').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'left'};
              dataRow.getCell('F').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('G').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('H').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('I').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('J').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('K').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('L').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('M').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('N').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('O').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('P').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('Q').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('R').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('S').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('T').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('U').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
            }
          } else {
              hasRWA = false;
          }
        } else {
          hasRWA = false;
        }
      }
      if(project.droogWaterAfvoer != null && !project.isGemengd) {
        if ((project.droogWaterAfvoer.isWachtaansluiting == null || project.droogWaterAfvoer.isWachtaansluiting === false) &&
          (project.isWachtAansluiting == null || project.isWachtAansluiting === false)){
          if (this.checkHasDWA(project.droogWaterAfvoer)) {
            if (dataList.heeftPloegen == null || dataList.heeftPloegen === false) {
              mofCountDWA += this.NullToZero(project.droogWaterAfvoer.mof);
              ytStukCountDWA += this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) + this.NullToZero(project.droogWaterAfvoer.YAchter);
              buisCountDWA += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert)
                + this.NullToZero(project.droogWaterAfvoer.buisAchter);
              let bochtenCount = 0;
              if(!dataList.bochtenInGraden){
                bochtenCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtAchter);
              } else {
                bochtenCount += this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter45)
                  + this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter90);
              }
              bochtCountDWA += bochtenCount;
              reductieCountDWA += this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieAchter);
              krimpmofCountDWA += this.NullToZero(project.droogWaterAfvoer.krimpmof);
              koppelstukCountDWA += this.NullToZero(project.droogWaterAfvoer.koppelstuk);
              stopCountDWA += this.NullToZero(project.droogWaterAfvoer.stop);

              let tStuk = 0;
              if (project.droogWaterAfvoer.soortPutje === 't-stuk') {
                tStuk += 1;
                ytStukCountDWA++;
              }
              let dataRow = worksheet2.addRow([
                project?.street,
                project?.huisNr,
                project.equipNrRiolering,
                "DWA",
                "HA",
                this.NullToString(project.droogWaterAfvoer.diameter === 'andere' ? project.droogWaterAfvoer.diameterAndere : project.droogWaterAfvoer.diameter),
                this.NullToString(project.droogWaterAfvoer.buisType),
                this.NullToString(project.droogWaterAfvoer.xCoord),
                this.NullToString(project.droogWaterAfvoer.yCoord),
                this.NullToString(project.droogWaterAfvoer.zCoord),
                this.NullToZero(project.droogWaterAfvoer.mof),
                this.NullToZero(project.droogWaterAfvoer.buisVoorHor) +
                this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisAchter),
                bochtenCount,
                this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) + this.NullToZero(project.droogWaterAfvoer.YAchter) + tStuk,
                this.NullToZero(project.droogWaterAfvoer.krimpmof),
                this.NullToZero(project.droogWaterAfvoer.koppelstuk),
                this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieAchter),
                this.NullToZero(project.droogWaterAfvoer.stop),
                this.NullToString(project.droogWaterAfvoer.andere),
                this.NullToZero(project.droogWaterAfvoer.diameterPut),
                this.BoolToString(project.droogWaterAfvoer.terugslagklep),
              ]);
              if(!hasRWA){
                let emptyRow = worksheet2.addRow([
                  project?.street,
                  project?.huisNr,
                  project.equipNrRiolering,
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                ]);
                emptyRow.alignment = {vertical: 'middle', horizontal: 'center'};
                emptyRow.getCell('V').value = project.naamFiche;
                emptyRow.eachCell({includeEmpty: true}, (cell, number) => {
                  cell.border = {
                    top: {style: 'thin'},
                    left: {style: 'thin'},
                    bottom: {style: 'thin'},
                    right: {style: 'thin'},
                  };
                });
                emptyRow.getCell('A').fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {argb: 'ADD8E6'},
                  bgColor: {argb: '44c7db'},
                };
                emptyRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
                emptyRow.getCell('B').fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {argb: 'ADD8E6'},
                  bgColor: {argb: '44c7db'},
                };
                emptyRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
                emptyRow.getCell('C').fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {argb: 'ADD8E6'},
                  bgColor: {argb: '44c7db'},
                };
                emptyRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
              }
              worksheet2.mergeCells('A' + (index + 5) + ':A' + (index + 6));
              worksheet2.mergeCells('B' + (index + 5) + ':B' + (index + 6));
              worksheet2.mergeCells('C' + (index + 5) + ':C' + (index + 6));
              worksheet2.mergeCells('V' + (index + 5) + ':V' + (index + 6));

              dataRow.getCell('V').value = project.naamFiche;
              dataRow.getCell('A').value = project.street;
              dataRow.getCell('B').value = project.huisNr;
              dataRow.getCell('C').value = project.equipNrRiolering;
              dataRow.alignment = {vertical: 'middle', horizontal: 'center'};
              dataRow.eachCell({includeEmpty: true}, (cell, number) => {
                cell.border = {
                  top: {style: 'thin'},
                  left: {style: 'thin'},
                  bottom: {style: 'thin'},
                  right: {style: 'thin'},
                };
              });
              dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
              dataRow.getCell('A').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
              dataRow.getCell('B').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
              dataRow.getCell('C').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'left'};
              dataRow.getCell('F').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('G').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('H').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('I').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('J').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('K').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('L').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('M').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('N').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('O').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('P').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('Q').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('R').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('S').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('T').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('U').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              index += 2;
            } else {
              mofCountDWA += this.NullToZero(project.droogWaterAfvoer.mof);
              ytStukCountDWA += (this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) + this.NullToZero(project.droogWaterAfvoer.YAchter));
              buisCountDWA += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)
                + this.NullToZero(project.droogWaterAfvoer.buisAchter);
              let bochtenCount = 0;
              if(!dataList.bochtenInGraden){
                bochtenCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor) +  this.NullToZero(project.droogWaterAfvoer.bochtVoor2) + this.NullToZero(project.droogWaterAfvoer.bochtAchter);
              } else {
                bochtenCount += this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter45)
                  + this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor45) + this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor90)+
                + this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter90);
              }
              bochtCountDWA += bochtenCount;
              reductieCountDWA += this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2) + this.NullToZero(project.droogWaterAfvoer.reductieAchter);
              krimpmofCountDWA += this.NullToZero(project.droogWaterAfvoer.krimpmof);
              koppelstukCountDWA += this.NullToZero(project.droogWaterAfvoer.koppelstuk);
              stopCountDWA += this.NullToZero(project.droogWaterAfvoer.stop);
              let tStuk = 0;
              if (project.droogWaterAfvoer.soortPutje === 't-stuk') {
                tStuk += 1;
                ytStukCountDWA++;
              }
              let dataRow = worksheet2.addRow([
                project?.street,
                project?.huisNr,
                project.equipNrRiolering,
                "DWA",
                "HA",
                this.NullToString(project.droogWaterAfvoer.diameter === 'andere' ? project.droogWaterAfvoer.diameterAndere : project.droogWaterAfvoer.diameter),
                this.NullToString(project.droogWaterAfvoer.buisType),
                this.NullToString(project.droogWaterAfvoer.xCoord),
                this.NullToString(project.droogWaterAfvoer.yCoord),
                this.NullToString(project.droogWaterAfvoer.zCoord),
                this.NullToZero(project.droogWaterAfvoer.mof),
                this.NullToZero(project.droogWaterAfvoer.buisVoorHor) +
                this.NullToZero(project.droogWaterAfvoer.buisVoorVert) +
                this.NullToZero(project.droogWaterAfvoer.buisVoorHor2) +
                this.NullToZero(project.droogWaterAfvoer.buisVoorVert2) + this.NullToZero(project.droogWaterAfvoer.buisAchter),
                bochtenCount,
                this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) + this.NullToZero(project.droogWaterAfvoer.YAchter) + tStuk,
                this.NullToZero(project.droogWaterAfvoer.krimpmof),
                this.NullToZero(project.droogWaterAfvoer.koppelstuk),
                this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2) + this.NullToZero(project.droogWaterAfvoer.reductieAchter),
                this.NullToZero(project.droogWaterAfvoer.stop),
                this.NullToString(project.droogWaterAfvoer.andere),
                this.NullToZero(project.droogWaterAfvoer.diameterPut),
                this.BoolToString(project.droogWaterAfvoer.terugslagklep),
              ]);
              if(!hasRWA){
                let emptyRow = worksheet2.addRow([
                  project?.street,
                  project?.huisNr,
                  project.equipNrRiolering,
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                ]);
                emptyRow.alignment = {vertical: 'middle', horizontal: 'center'};
                emptyRow.getCell('V').value = project.naamFiche;
                emptyRow.eachCell({includeEmpty: true}, (cell, number) => {
                  cell.border = {
                    top: {style: 'thin'},
                    left: {style: 'thin'},
                    bottom: {style: 'thin'},
                    right: {style: 'thin'},
                  };
                });
                emptyRow.getCell('A').fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {argb: 'ADD8E6'},
                  bgColor: {argb: '44c7db'},
                };
                emptyRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
                emptyRow.getCell('B').fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {argb: 'ADD8E6'},
                  bgColor: {argb: '44c7db'},
                };
                emptyRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
                emptyRow.getCell('C').fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {argb: 'ADD8E6'},
                  bgColor: {argb: '44c7db'},
                };
                emptyRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
              }
              worksheet2.mergeCells('V' + (index + 5) + ':V' + (index + 6));
              worksheet2.mergeCells('A' + (index + 5) + ':A' + (index + 6));
              worksheet2.mergeCells('B' + (index + 5) + ':B' + (index + 6));
              worksheet2.mergeCells('C' + (index + 5) + ':C' + (index + 6));
              dataRow.getCell('V').value = project.naamFiche;
              dataRow.getCell('A').value = project.street;
              dataRow.getCell('B').value = project.huisNr;
              dataRow.getCell('C').value = project.equipNrRiolering;
              dataRow.alignment = {vertical: 'middle', horizontal: 'center'};
              dataRow.eachCell({includeEmpty: true}, (cell, number) => {
                cell.border = {
                  top: {style: 'thin'},
                  left: {style: 'thin'},
                  bottom: {style: 'thin'},
                  right: {style: 'thin'},
                };
              });
              dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
              dataRow.getCell('A').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
              dataRow.getCell('B').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
              dataRow.getCell('C').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('F').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('G').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('H').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('I').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('J').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fceea7'},
                bgColor: {argb: '44c7db'},
              };
              dataRow.getCell('K').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('L').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('M').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('N').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('O').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('P').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('Q').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('R').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('S').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('T').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              dataRow.getCell('U').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'fbf8e6'},
                bgColor: {argb: 'fbf8e6'},
              };
              index += 2;
            }
          } else {
            if(hasRWA){
              let emptyRow = worksheet2.addRow([
                project?.street,
                project?.huisNr,
                project.equipNrRiolering,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
              ]);
              worksheet2.mergeCells('A' + (index + 5) + ':A' + (index + 6));
              worksheet2.mergeCells('B' + (index + 5) + ':B' + (index + 6));
              worksheet2.mergeCells('C' + (index + 5) + ':C' + (index + 6));
              worksheet2.mergeCells('V' + (index + 5) + ':V' + (index + 6));

              emptyRow.getCell('V').value = project.naamFiche;
              emptyRow.getCell('A').value = project.street;
              emptyRow.getCell('B').value = project.huisNr;
              emptyRow.getCell('C').value = project.equipNrRiolering;
              emptyRow.alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.eachCell({includeEmpty: true}, (cell, number) => {
                cell.border = {
                  top: {style: 'thin'},
                  left: {style: 'thin'},
                  bottom: {style: 'thin'},
                  right: {style: 'thin'},
                };
              });
              emptyRow.getCell('A').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.getCell('B').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.getCell('C').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
              index += 2;
            }
          }
        }  else {
            if(hasRWA){
              let emptyRow = worksheet2.addRow([
                project?.street,
                project?.huisNr,
                project.equipNrRiolering,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
              ]);
              worksheet2.mergeCells('A' + (index + 5) + ':A' + (index + 6));
              worksheet2.mergeCells('B' + (index + 5) + ':B' + (index + 6));
              worksheet2.mergeCells('C' + (index + 5) + ':C' + (index + 6));
              worksheet2.mergeCells('V' + (index + 5) + ':V' + (index + 6));

              emptyRow.getCell('V').value = project.naamFiche;
              emptyRow.getCell('A').value = project.street;
              emptyRow.getCell('B').value = project.huisNr;
              emptyRow.getCell('C').value = project.equipNrRiolering;
              emptyRow.alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.eachCell({includeEmpty: true}, (cell, number) => {
                cell.border = {
                  top: {style: 'thin'},
                  left: {style: 'thin'},
                  bottom: {style: 'thin'},
                  right: {style: 'thin'},
                };
              });
              emptyRow.getCell('A').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.getCell('B').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.getCell('C').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
              index += 2;
            }
        }
      }
      if(project.droogWaterAfvoer != null && (project.isWachtAansluiting == null || project.isWachtAansluiting === false) &&
        (project.droogWaterAfvoer.isWachtaansluiting == null || project.droogWaterAfvoer.isWachtaansluiting === false) && project.isGemengd){
        if (this.checkHasDWA(project.droogWaterAfvoer)) {
          mofCountGEM +=  this.NullToZero(project.droogWaterAfvoer.mof);
          ytStukCountGEM += this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) + this.NullToZero(project.droogWaterAfvoer.YAchter);
          buisCountGEM += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert)
            + this.NullToZero(project.droogWaterAfvoer.buisAchter);
          let bochtenCount = 0;
          if(!dataList.bochtenInGraden){
            bochtenCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtAchter);
          } else {
            bochtenCount += this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter45)
              + this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter90);
          }
          bochtCountGEM += bochtenCount;
          reductieCountGEM += this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieAchter);
          krimpmofCountGEM += this.NullToZero(project.droogWaterAfvoer.krimpmof);
          koppelstukCountGEM += this.NullToZero(project.droogWaterAfvoer.koppelstuk);
          stopCountGEM += this.NullToZero(project.droogWaterAfvoer.stop);

          let tStuk = 0;
          if(project.droogWaterAfvoer.soortPutje === 't-stuk'){
            tStuk += 1;
            ytStukCountGEM++;
          }
          let dataRow = worksheet2.addRow([
            project?.street,
            project?.huisNr,
            project.equipNrRiolering,
            "GEM",
            "HA",
            this.NullToString(project.droogWaterAfvoer.diameter === 'andere' ? project.droogWaterAfvoer.diameterAndere : project.droogWaterAfvoer.diameter),
            this.NullToString(project.droogWaterAfvoer.buisType),
            this.NullToString(project.droogWaterAfvoer.xCoord),
            this.NullToString(project.droogWaterAfvoer.yCoord),
            this.NullToString(project.droogWaterAfvoer.zCoord),
            this.NullToZero(project.droogWaterAfvoer.mof),
            this.NullToZero(project.droogWaterAfvoer.buisVoorHor) +
            this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisAchter),
            bochtenCount,
            this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) + this.NullToZero(project.droogWaterAfvoer.YAchter) + tStuk,
            this.NullToZero(project.droogWaterAfvoer.krimpmof),
            this.NullToZero(project.droogWaterAfvoer.koppelstuk),
            this.NullToZero(project.droogWaterAfvoer.reductieVoor) +  this.NullToZero(project.droogWaterAfvoer.reductieAchter),
            this.NullToZero(project.droogWaterAfvoer.stop),
            this.NullToString(project.droogWaterAfvoer.andere),
            this.NullToZero(project.droogWaterAfvoer.diameterPut),
            this.BoolToString(project.droogWaterAfvoer.terugslagklep)
          ]);
          dataRow.alignment = {vertical: 'middle', horizontal: 'center'};
          dataRow.getCell('V').value = project.naamFiche;
          dataRow.eachCell({includeEmpty: true}, (cell, number) => {
            cell.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'},
            };
          });
          dataRow.getCell('A').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ADD8E6'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
          dataRow.getCell('B').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ADD8E6'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
          dataRow.getCell('C').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ADD8E6'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
          dataRow.getCell('F').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fceea7'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('G').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fceea7'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('H').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fceea7'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('I').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fceea7'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('J').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fceea7'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('K').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('L').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('M').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('N').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('O').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('P').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('Q').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('R').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('S').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('T').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('U').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
        }
        index++;
      }
    }

    let rwaRow = worksheet2.addRow([ 'Totale hoeveelheden' , 'RWA' , '', '', '', '', '', '', '', '',
        mofCountRWA,buisCountRWA.toFixed(2),bochtCountRWA,ytStukCountRWA,krimpmofCountRWA,koppelstukCountRWA,reductieCountRWA,stopCountRWA
    ]);
    rwaRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '63D1F4' },
        bgColor: { argb: '63D1F4' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14, bold: true};
    });
    rwaRow.alignment = {vertical: 'middle', horizontal: 'center'};
    let dwaRow = worksheet2.addRow([ '' , 'DWA' , '', '', '', '', '', '', '', '',
      mofCountDWA,buisCountDWA.toFixed(2),bochtCountDWA,ytStukCountDWA,krimpmofCountDWA,koppelstukCountDWA,reductieCountDWA,stopCountDWA
    ]);
    dwaRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ff4c4c' },
        bgColor: { argb: 'ff4c4c' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14, bold: true};
    });
    dwaRow.alignment = {vertical: 'middle', horizontal: 'center'};
    let gemRow = worksheet2.addRow([ '' , 'GEM' , '', '', '', '', '', '', '', '',
      mofCountGEM,buisCountGEM.toFixed(2),bochtCountGEM,ytStukCountGEM,krimpmofCountGEM,koppelstukCountGEM,reductieCountGEM,stopCountGEM
    ]);
    gemRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'bdecb6' },
        bgColor: { argb: 'bdecb6' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14, bold: true};
    });
    gemRow.alignment = {vertical: 'middle', horizontal: 'center'};







    //page project WA

    let worksheet3 = workbook.addWorksheet('Project WA', {
      views: [{state: "frozen", ySplit: 3  }, {state: "frozen", ySplit: 4  }],
    });
    // Add new row
    let titleRow3 = worksheet3.addRow(['Wachtaansluitingen voor onbebouwde percelen']);
    titleRow3.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    titleRow3.height = 32;
    worksheet3.mergeCells('A1:E1');
    let emptyRow6 = worksheet3.addRow([""]);
    let infoRow2 = worksheet3.addRow([""]);
    worksheet3.mergeCells('H3:J3');
    infoRow2.getCell('H').value = "lambert coördinaten - deksel HA-putje";
    infoRow2.getCell('H').border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    infoRow2.getCell('H').font = { name: 'Arial', family: 4, size: 11, bold: true};
    infoRow2.getCell('H').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet3.mergeCells('K3:U3');
    infoRow2.getCell('K').value = "HOEVEELHEDEN aansluiting";
    infoRow2.getCell('K').border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    infoRow2.getCell('K').font = { name: 'Arial', family: 4, size: 11, bold: true};
    infoRow2.getCell('K').alignment = { vertical: 'middle', horizontal: 'center' };

    let headers2 = ['Straat\n( + eventueel huisnummer)','Volgnr.','Equipmentnr. riolering','aard water\n (RWA/DWA/\nGEM)', 'soort\n(HA,WA)', 'diameter\n(mm)', 'materiaal',
      'X-coördinaat', 'Y-coördinaat', 'Z-coördinaat', 'Mof\n(st)', 'Buis\n(m)', 'Bocht\n(st)', 'Y/T-stuk\n(st)', 'Krimpmof\n(st)', 'Koppelstuk\n(st)', 'Reductie\n(st)',
      'Stop\n(st)', 'Andere', 'diameter\nHA-putje of\nT-stuk\n(mm)', 'Terugslag-\nklep in HA-\nputje', 'naamgeving fiche'];

    //Add Header Row
    let headerRow2 = worksheet3.addRow(headers2);
    // Cell Style : Fill and Border
    headerRow2.height = 55;
    headerRow2.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A3866A' },
        bgColor: { argb: 'C4A484' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true};
    });
    // Set font, size and style in title row.
    headerRow2.alignment = { vertical: 'middle', horizontal: 'center' , wrapText: true};
    headerRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    // Blank Row
    worksheet3.columns.forEach(function (column, i) {
      if(i === 0){
        column.width = 34;
      } else if (i === 1 ) {
        column.width = 10;
      } else if(i === 6 ){
        column.width = 11;
      } else if( i === 4 || i === 5 ){
        column.width = 12;
      } else if( i === 7 || i === 8 || i === 9 || i === 5){
        column.width = 15;
      } else if( i === 21 ){
        column.width = 90;
      } else if( i === 10 || i === 11 || i === 12 || i === 17 ){
        column.width = 9;
      }  else if(i === 2){
        column.width = 27;
      } else {
        column.width = 13;
      }
    });
    mofCountDWA = 0;
    ytStukCountDWA = 0;
    buisCountDWA = 0;
    bochtCountDWA = 0;
    reductieCountDWA = 0;
    krimpmofCountDWA = 0;
    koppelstukCountDWA = 0;
    stopCountDWA = 0;
    mofCountRWA = 0;
    ytStukCountRWA = 0;
    buisCountRWA = 0;
    bochtCountRWA = 0;
    reductieCountRWA = 0;
    krimpmofCountRWA = 0;
    koppelstukCountRWA = 0;
    stopCountRWA = 0;
    mofCountGEM = 0;
    ytStukCountGEM = 0;
    buisCountGEM = 0;
    bochtCountGEM = 0;
    reductieCountGEM= 0;
    krimpmofCountGEM = 0;
    koppelstukCountGEM = 0;
    stopCountGEM = 0;
    index = 0;
    for (let data of dataList.projectList) {
      let project = data;
      let hasRWA = true;
      if (project.regenWaterAfvoer != null && (project.isWachtAansluiting || project.regenWaterAfvoer.isWachtaansluiting) && !project.isGemengd) {
        if (this.checkHasRWA(project.regenWaterAfvoer)) {
          if (dataList.heeftPloegen == null || dataList.heeftPloegen === false) {
            mofCountRWA += this.NullToZero(project.regenWaterAfvoer.mof);
            ytStukCountRWA += this.convertBuisStuk(project.regenWaterAfvoer.tBuisStuk) + this.NullToZero(project.regenWaterAfvoer.YAchter);
            buisCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert)
              + this.NullToZero(project.regenWaterAfvoer.buisAchter);
            let bochtenCount = 0;
            if(!dataList.bochtenInGraden){
              bochtenCount += this.NullToZero(project.regenWaterAfvoer.bochtVoor) +  this.NullToZero(project.regenWaterAfvoer.bochtAchter);
            } else {
              bochtenCount += this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter45)
              + this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter90);
            }
            bochtCountRWA += bochtenCount;
            reductieCountRWA += this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieAchter);
            krimpmofCountRWA += this.NullToZero(project.regenWaterAfvoer.krimpmof);
            koppelstukCountRWA += this.NullToZero(project.regenWaterAfvoer.koppelstuk);
            stopCountRWA += this.NullToZero(project.regenWaterAfvoer.stop);

            let tStuk = 0;
            if (project.regenWaterAfvoer.soortPutje === 't-stuk') {
              tStuk += 1;
              ytStukCountRWA++;
            }
            let dataRow = worksheet3.addRow([
              project?.street + ' ' + project?.huisNr,
              project.index,
              project.equipNrRiolering,
              "RWA",
              "WA",
              this.NullToString(project.regenWaterAfvoer.diameter === 'andere' ? project.regenWaterAfvoer.diameterAndere : project.regenWaterAfvoer.diameter),
              this.NullToString(project.regenWaterAfvoer.buisType),
              this.NullToString(project.regenWaterAfvoer.xCoord),
              this.NullToString(project.regenWaterAfvoer.yCoord),
              this.NullToString(project.regenWaterAfvoer.zCoord),
              this.NullToZero(project.regenWaterAfvoer.mof),
              this.NullToZero(project.regenWaterAfvoer.buisVoorHor) +
              this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisAchter),
              bochtenCount,
              this.convertBuisStuk(project.regenWaterAfvoer.tBuisStuk) + this.NullToZero(project.regenWaterAfvoer.YAchter) + tStuk,
              this.NullToZero(project.regenWaterAfvoer.krimpmof),
              this.NullToZero(project.regenWaterAfvoer.koppelstuk),
              this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieAchter),
              this.NullToZero(project.regenWaterAfvoer.stop),
              this.NullToString(project.regenWaterAfvoer.andere),
              this.NullToZero(project.regenWaterAfvoer.diameterPut),
              this.BoolToString(project.regenWaterAfvoer.terugslagklep)
            ]);

            dataRow.alignment = {vertical: 'middle', horizontal: 'center'};
            dataRow.eachCell({includeEmpty: true}, (cell, number) => {
              cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'},
              };
            });
            dataRow.getCell('A').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'left'};
            dataRow.getCell('B').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'left'};
            dataRow.getCell('C').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'left'};
            dataRow.getCell('F').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('G').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('H').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('I').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('J').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('K').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('L').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('M').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('N').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('O').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('P').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('Q').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('R').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('S').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('T').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('U').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
          } else {
            mofCountRWA += this.NullToZero(project.regenWaterAfvoer.mof);
            ytStukCountRWA += this.convertBuisStuk(project.regenWaterAfvoer.tBuisStuk) + this.NullToZero(project.regenWaterAfvoer.YAchter);
            buisCountRWA += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + +this.NullToZero(project.regenWaterAfvoer.buisVoorVert2)
              + this.NullToZero(project.regenWaterAfvoer.buisAchter);
            let bochtenCount = 0;
            if(!dataList.bochtenInGraden){
              bochtenCount += this.NullToZero(project.regenWaterAfvoer.bochtVoor) +  this.NullToZero(project.regenWaterAfvoer.bochtVoor2) + this.NullToZero(project.regenWaterAfvoer.bochtAchter);
            } else {
              bochtenCount += this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter45)
                + this.NullToZero(project.regenWaterAfvoer.gradenBocht2Voor45) + this.NullToZero(project.regenWaterAfvoer.gradenBocht2Voor90) +
              + this.NullToZero(project.regenWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.regenWaterAfvoer.gradenBochtAchter90);
            }
            bochtCountRWA += bochtenCount;
            reductieCountRWA += this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2) + this.NullToZero(project.regenWaterAfvoer.reductieAchter);
            krimpmofCountRWA += this.NullToZero(project.regenWaterAfvoer.krimpmof);
            koppelstukCountRWA += this.NullToZero(project.regenWaterAfvoer.koppelstuk);
            stopCountRWA += this.NullToZero(project.regenWaterAfvoer.stop);


            let tStuk = 0;
            if (project.regenWaterAfvoer.soortPutje === 't-stuk') {
              tStuk += 1;
              ytStukCountRWA++;
            }
            let dataRow = worksheet3.addRow([
              project?.street + ' ' + project?.huisNr,
              project.index,
              project.equipNrRiolering,
              "RWA",
              "WA",
              this.NullToString(project.regenWaterAfvoer.diameter === 'andere' ? project.regenWaterAfvoer.diameterAndere : project.regenWaterAfvoer.diameter),
              this.NullToString(project.regenWaterAfvoer.buisType),
              this.NullToString(project.regenWaterAfvoer.xCoord),
              this.NullToString(project.regenWaterAfvoer.yCoord),
              this.NullToString(project.regenWaterAfvoer.zCoord),
              this.NullToZero(project.regenWaterAfvoer.mof),
              this.NullToZero(project.regenWaterAfvoer.buisVoorHor) +
              this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2) +
              this.NullToZero(project.regenWaterAfvoer.buisVoorVert2) + this.NullToZero(project.regenWaterAfvoer.buisAchter),
              bochtenCount,
              this.convertBuisStuk(project.regenWaterAfvoer.tBuisStuk) + this.NullToZero(project.regenWaterAfvoer.YAchter) + tStuk,
              this.NullToZero(project.regenWaterAfvoer.krimpmof),
              this.NullToZero(project.regenWaterAfvoer.koppelstuk),
              this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2)
              + this.NullToZero(project.regenWaterAfvoer.reductieAchter),
              this.NullToZero(project.regenWaterAfvoer.stop),
              this.NullToString(project.regenWaterAfvoer.andere),
              this.NullToZero(project.regenWaterAfvoer.diameterPut),
              this.BoolToString(project.regenWaterAfvoer.terugslagklep)
            ]);

            dataRow.alignment = {vertical: 'middle', horizontal: 'center'};
            dataRow.eachCell({includeEmpty: true}, (cell, number) => {
              cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'},
              };
            });
            dataRow.getCell('A').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'left'};
            dataRow.getCell('B').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'left'};
            dataRow.getCell('C').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'left'};
            dataRow.getCell('F').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('G').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('H').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('I').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('J').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('K').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('L').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('M').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('N').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('O').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('P').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('Q').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('R').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('S').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('T').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('U').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
          }
        } else {
          hasRWA = false;
        }
      } else {
        hasRWA = false;
      }
      if (project.droogWaterAfvoer != null && (project.isWachtAansluiting || project.droogWaterAfvoer.isWachtaansluiting) && !project.isGemengd) {
        if (this.checkHasDWA(project.droogWaterAfvoer)) {
          if(dataList.heeftPloegen == null || dataList.heeftPloegen === false){
            mofCountDWA +=  this.NullToZero(project.droogWaterAfvoer.mof);
            ytStukCountDWA += this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) +  this.NullToZero(project.droogWaterAfvoer.YAchter);
            buisCountDWA += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert)
              + this.NullToZero(project.droogWaterAfvoer.buisAchter);
            let bochtenCount = 0;
            if(!dataList.bochtenInGraden){
              bochtenCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor)  + this.NullToZero(project.droogWaterAfvoer.bochtAchter);
            } else {
              bochtenCount += this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter45)
              + this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter90);
            }
            bochtCountDWA += bochtenCount;
            reductieCountDWA += this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieAchter);
            krimpmofCountDWA += this.NullToZero(project.droogWaterAfvoer.krimpmof);
            koppelstukCountDWA += this.NullToZero(project.droogWaterAfvoer.koppelstuk);
            stopCountDWA += this.NullToZero(project.droogWaterAfvoer.stop);


            let tStuk = 0;
            if(project.droogWaterAfvoer.soortPutje === 't-stuk'){
              tStuk += 1;
              ytStukCountRWA++;
            }
            let dataRow = worksheet3.addRow([
              project?.street + ' ' + project?.huisNr,
              project.index,
              project.equipNrRiolering,
              "DWA",
              'WA',
              this.NullToString(project.droogWaterAfvoer.diameter === 'andere' ? project.droogWaterAfvoer.diameterAndere : project.droogWaterAfvoer.diameter),
              this.NullToString(project.droogWaterAfvoer.buisType),
              this.NullToString(project.droogWaterAfvoer.xCoord),
              this.NullToString(project.droogWaterAfvoer.yCoord),
              this.NullToString(project.droogWaterAfvoer.zCoord),
              this.NullToZero(project.droogWaterAfvoer.mof),
              this.NullToZero(project.droogWaterAfvoer.buisVoorHor) +
              this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisAchter),
              bochtenCount,
              this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) +  this.NullToZero(project.droogWaterAfvoer.YAchter) + tStuk,
              this.NullToZero(project.droogWaterAfvoer.krimpmof),
              this.NullToZero(project.droogWaterAfvoer.koppelstuk),
              this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieAchter),
              this.NullToZero(project.droogWaterAfvoer.stop),
              this.NullToString(project.droogWaterAfvoer.andere),
              this.NullToZero(project.droogWaterAfvoer.diameterPut),
              this.BoolToString(project.droogWaterAfvoer.terugslagklep),
            ]);
            if(!hasRWA){
              let emptyRow = worksheet3.addRow([
                project?.street + ' ' + project?.huisNr,
                project?.index,
                project.equipNrRiolering,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
              ]);
              emptyRow.alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.getCell('V').value = project.naamFiche;
              emptyRow.eachCell({includeEmpty: true}, (cell, number) => {
                cell.border = {
                  top: {style: 'thin'},
                  left: {style: 'thin'},
                  bottom: {style: 'thin'},
                  right: {style: 'thin'},
                };
              });
              emptyRow.getCell('A').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.getCell('B').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.getCell('C').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
            }
            worksheet3.mergeCells('A' + (index + 5) + ':A' + (index + 6));
            worksheet3.mergeCells('B' + (index + 5) + ':B' + (index + 6));
            worksheet3.mergeCells('C' + (index + 5) + ':C' + (index + 6));
            worksheet3.mergeCells('V' + (index + 5) + ':V' + (index + 6));

            dataRow.getCell('V').value = project.naamFiche;
            dataRow.getCell('A').value =  project?.street + ' ' + project?.huisNr;
            dataRow.getCell('B').value = project?.index;
            dataRow.getCell('C').value = dataList.rbProjectNr + '-volgnr' +  project.index;
            dataRow.alignment = {vertical: 'middle', horizontal: 'center'};
            dataRow.eachCell({includeEmpty: true}, (cell, number) => {
              cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'},
              };
            });
            dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
            dataRow.getCell('A').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
            dataRow.getCell('B').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
            dataRow.getCell('C').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('F').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('G').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('H').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('I').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('J').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('K').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('L').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('M').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('N').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('O').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('P').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('Q').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('R').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('S').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('T').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('U').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            index += 2;
          } else {
            mofCountDWA +=  this.NullToZero(project.droogWaterAfvoer.mof);
            ytStukCountDWA += this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) +  this.NullToZero(project.droogWaterAfvoer.YAchter);
            buisCountDWA += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert)
              + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)
              + this.NullToZero(project.droogWaterAfvoer.buisAchter);
            let bochtenCount = 0;
            if(!dataList.bochtenInGraden){
              bochtenCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor)  + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)  + this.NullToZero(project.droogWaterAfvoer.bochtAchter);
            } else {
              bochtenCount += this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter45) +
              this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor45) + this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor90)
                + this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter90);
            }
            bochtCountDWA += bochtenCount;
            reductieCountDWA += this.NullToZero(project.droogWaterAfvoer.reductieVoor) +  this.NullToZero(project.droogWaterAfvoer.reductieVoor2) + this.NullToZero(project.droogWaterAfvoer.reductieAchter);
            krimpmofCountDWA += this.NullToZero(project.droogWaterAfvoer.krimpmof);
            koppelstukCountDWA += this.NullToZero(project.droogWaterAfvoer.koppelstuk);
            stopCountDWA += this.NullToZero(project.droogWaterAfvoer.stop);

            let tStuk = 0;
            if(project.droogWaterAfvoer.soortPutje === 't-stuk'){
              tStuk += 1;
              ytStukCountRWA++;
            }
            let dataRow = worksheet3.addRow([
              project?.street + ' ' + project?.huisNr,
              project.index,
              project.equipNrRiolering,
              "DWA",
              'WA',
              this.NullToString(project.droogWaterAfvoer.diameter === 'andere' ? project.droogWaterAfvoer.diameterAndere : project.droogWaterAfvoer.diameter),
              this.NullToString(project.droogWaterAfvoer.buisType),
              this.NullToString(project.droogWaterAfvoer.xCoord),
              this.NullToString(project.droogWaterAfvoer.yCoord),
              this.NullToString(project.droogWaterAfvoer.zCoord),
              this.NullToZero(project.droogWaterAfvoer.mof),
              this.NullToZero(project.droogWaterAfvoer.buisVoorHor) +
              this.NullToZero(project.droogWaterAfvoer.buisVoorVert) +
              this.NullToZero(project.droogWaterAfvoer.buisVoorHor2) +
              this.NullToZero(project.droogWaterAfvoer.buisVoorVert2) + this.NullToZero(project.droogWaterAfvoer.buisAchter),
              bochtenCount,
              this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) +  this.NullToZero(project.droogWaterAfvoer.YAchter) + tStuk,
              this.NullToZero(project.droogWaterAfvoer.krimpmof),
              this.NullToZero(project.droogWaterAfvoer.koppelstuk),
              this.NullToZero(project.droogWaterAfvoer.reductieVoor) +   this.NullToZero(project.droogWaterAfvoer.reductieVoor2) +   this.NullToZero(project.droogWaterAfvoer.reductieAchter),
              this.NullToZero(project.droogWaterAfvoer.stop),
              this.NullToString(project.droogWaterAfvoer.andere),
              this.NullToZero(project.droogWaterAfvoer.diameterPut),
              this.BoolToString(project.droogWaterAfvoer.terugslagklep),
            ]);
            if(!hasRWA){
              let emptyRow = worksheet3.addRow([
                project?.street + ' ' + project?.huisNr,
                project?.index,
                project.equipNrRiolering,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
              ]);
              emptyRow.alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.getCell('V').value = project.naamFiche;
              emptyRow.eachCell({includeEmpty: true}, (cell, number) => {
                cell.border = {
                  top: {style: 'thin'},
                  left: {style: 'thin'},
                  bottom: {style: 'thin'},
                  right: {style: 'thin'},
                };
              });
              emptyRow.getCell('A').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.getCell('B').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
              emptyRow.getCell('C').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'ADD8E6'},
                bgColor: {argb: '44c7db'},
              };
              emptyRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
            }
            worksheet3.mergeCells('A' + (index + 5) + ':A' + (index + 6));
            worksheet3.mergeCells('B' + (index + 5) + ':B' + (index + 6));
            worksheet3.mergeCells('C' + (index + 5) + ':C' + (index + 6));
            worksheet3.mergeCells('V' + (index + 5) + ':V' + (index + 6));

            dataRow.getCell('V').value = project.naamFiche;
            dataRow.getCell('A').value =  project?.street + ' ' + project?.huisNr;
            dataRow.getCell('B').value = project?.index;
            dataRow.getCell('C').value = dataList.rbProjectNr + '-volgnr' +  project.index;
            dataRow.alignment = {vertical: 'middle', horizontal: 'center'};
            dataRow.eachCell({includeEmpty: true}, (cell, number) => {
              cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'},
              };
            });
            dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
            dataRow.getCell('A').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
            dataRow.getCell('B').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
            dataRow.getCell('C').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('F').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('G').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('H').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('I').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('J').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fceea7'},
              bgColor: {argb: '44c7db'},
            };
            dataRow.getCell('K').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('L').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('M').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('N').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('O').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('P').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('Q').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('R').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('S').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('T').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            dataRow.getCell('U').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'fbf8e6'},
              bgColor: {argb: 'fbf8e6'},
            };
            index += 2 ;
          }
        } else {
          if(hasRWA){
            let emptyRow = worksheet3.addRow([
              project?.street + ' ' + project?.huisNr,
              project?.index,
              project.equipNrRiolering,
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
            ]);
            worksheet3.mergeCells('A' + (index + 5) + ':A' + (index + 6));
            worksheet3.mergeCells('B' + (index + 5) + ':B' + (index + 6));
            worksheet3.mergeCells('C' + (index + 5) + ':C' + (index + 6));
            worksheet3.mergeCells('V' + (index + 5) + ':V' + (index + 6));

            emptyRow.getCell('V').value = project.naamFiche;
            emptyRow.getCell('A').value =  project?.street + ' ' + project?.huisNr;
            emptyRow.getCell('B').value = project?.index;
            emptyRow.getCell('C').value = project.equipNrRiolering;
            emptyRow.alignment = {vertical: 'middle', horizontal: 'center'};
            emptyRow.eachCell({includeEmpty: true}, (cell, number) => {
              cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'},
              };
            });
            emptyRow.getCell('A').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            emptyRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
            emptyRow.getCell('B').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            emptyRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
            emptyRow.getCell('C').fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'ADD8E6'},
              bgColor: {argb: '44c7db'},
            };
            emptyRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
            index += 2;
          }
        }
      } else {
        if(hasRWA && !project.isGemengd){
          let emptyRow = worksheet3.addRow([
            project?.street + ' ' + project?.huisNr,
            project?.index,
            project.equipNrRiolering,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
          ]);
          worksheet3.mergeCells('A' + (index + 5) + ':A' + (index + 6));
          worksheet3.mergeCells('B' + (index + 5) + ':B' + (index + 6));
          worksheet3.mergeCells('C' + (index + 5) + ':C' + (index + 6));
          worksheet3.mergeCells('V' + (index + 5) + ':V' + (index + 6));

          emptyRow.getCell('V').value = project.naamFiche;
          emptyRow.getCell('A').value =  project?.street + ' ' + project?.huisNr;
          emptyRow.getCell('B').value = project?.index;
          emptyRow.getCell('C').value = project.equipNrRiolering;
          emptyRow.alignment = {vertical: 'middle', horizontal: 'center'};
          emptyRow.eachCell({includeEmpty: true}, (cell, number) => {
            cell.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'},
            };
          });
          emptyRow.getCell('A').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ADD8E6'},
            bgColor: {argb: '44c7db'},
          };
          emptyRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
          emptyRow.getCell('B').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ADD8E6'},
            bgColor: {argb: '44c7db'},
          };
          emptyRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
          emptyRow.getCell('C').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ADD8E6'},
            bgColor: {argb: '44c7db'},
          };
          emptyRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
          index += 2;
        }
      }
      if(project.isGemengd){
        if (project.droogWaterAfvoer != null && this.checkHasDWA(project.droogWaterAfvoer) && (project.isWachtAansluiting || project.droogWaterAfvoer.isWachtaansluiting)) {
          mofCountGEM +=  this.NullToZero(project.droogWaterAfvoer.mof);
          ytStukCountGEM += this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) + this.NullToZero(project.droogWaterAfvoer.YAchter);
          let buisCount = 0;
          buisCount += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert)
            + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)
            + this.NullToZero(project.droogWaterAfvoer.buisAchter);
          buisCountGEM += buisCount;
          let bochtenCount = 0;
          if(!dataList.bochtenInGraden){
            bochtenCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor)  + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)  + this.NullToZero(project.droogWaterAfvoer.bochtAchter);
          } else {
            bochtenCount += this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor45) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter45) +
              this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor45) + this.NullToZero(project.droogWaterAfvoer.gradenBocht2Voor90)
              + this.NullToZero(project.droogWaterAfvoer.gradenBochtVoor90) + this.NullToZero(project.droogWaterAfvoer.gradenBochtAchter90);
          }
          bochtCountGEM += bochtenCount;
          reductieCountGEM += this.NullToZero(project.droogWaterAfvoer.reductieVoor) +  this.NullToZero(project.droogWaterAfvoer.reductieVoor2) + this.NullToZero(project.droogWaterAfvoer.reductieAchter);
          krimpmofCountGEM += this.NullToZero(project.droogWaterAfvoer.krimpmof);
          koppelstukCountGEM += this.NullToZero(project.droogWaterAfvoer.koppelstuk);
          stopCountGEM += this.NullToZero(project.droogWaterAfvoer.stop);

          let tStuk = 0;
          if(project.droogWaterAfvoer.soortPutje === 't-stuk'){
            tStuk += 1;
            ytStukCountRWA++;
          }
          let dataRow = worksheet3.addRow([
            project?.street + ' ' + project?.huisNr,
            project?.index,
            project.equipNrRiolering,
            "GEM",
            "WA",
            this.NullToString(project.droogWaterAfvoer.diameter === 'andere' ? project.droogWaterAfvoer.diameterAndere : project.droogWaterAfvoer.diameter),
            this.NullToString(project.droogWaterAfvoer.buisType),
            this.NullToString(project.droogWaterAfvoer.xCoord),
            this.NullToString(project.droogWaterAfvoer.yCoord),
            this.NullToString(project.droogWaterAfvoer.zCoord),
            this.NullToZero(project.droogWaterAfvoer.mof),
            buisCount,
            bochtenCount,
            this.convertBuisStuk(project.droogWaterAfvoer.tBuisStuk) + this.NullToZero(project.droogWaterAfvoer.YAchter) + tStuk,
            this.NullToZero(project.droogWaterAfvoer.krimpmof),
            this.NullToZero(project.droogWaterAfvoer.koppelstuk),
            this.NullToZero(project.droogWaterAfvoer.reductieVoor) + +  this.NullToZero(project.droogWaterAfvoer.reductieVoor2) + this.NullToZero(project.droogWaterAfvoer.reductieAchter),
            this.NullToZero(project.droogWaterAfvoer.stop),
            this.NullToString(project.droogWaterAfvoer.andere),
            this.NullToZero(project.droogWaterAfvoer.diameterPut),
            this.BoolToString(project.droogWaterAfvoer.terugslagklep)
          ]);
          dataRow.alignment = {vertical: 'middle', horizontal: 'center'};
          dataRow.getCell('V').value = project.naamFiche;
          dataRow.getCell('A').value =  project?.street + ' ' + project?.huisNr;
          dataRow.getCell('B').value = project.index;
          dataRow.getCell('C').value = dataList.rbProjectNr + '-volgnr' +  project.index;
          dataRow.eachCell({includeEmpty: true}, (cell, number) => {
            cell.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'},
            };
          });
          dataRow.getCell('A').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ADD8E6'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('B').alignment = {vertical: 'middle', horizontal: 'center'};
          dataRow.getCell('B').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ADD8E6'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('C').alignment = {vertical: 'middle', horizontal: 'center'};
          dataRow.getCell('C').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ADD8E6'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('A').alignment = {vertical: 'middle', horizontal: 'center'};
          dataRow.getCell('F').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fceea7'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('G').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fceea7'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('H').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fceea7'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('I').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fceea7'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('J').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fceea7'},
            bgColor: {argb: '44c7db'},
          };
          dataRow.getCell('K').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('L').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('M').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('N').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('O').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('P').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('Q').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('R').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('S').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('T').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
          dataRow.getCell('U').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'fbf8e6'},
            bgColor: {argb: 'fbf8e6'},
          };
        }
        index++;
      }
    }

    let rwaRow2 = worksheet3.addRow([ 'Totale hoeveelheden' , 'RWA' , '', '', '', '', '', '', '', '',
      mofCountRWA,buisCountRWA.toFixed(2),bochtCountRWA,ytStukCountRWA,krimpmofCountRWA,koppelstukCountRWA,reductieCountRWA,stopCountRWA
    ]);
    rwaRow2.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '63D1F4' },
        bgColor: { argb: '63D1F4' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14, bold: true};
    });
    rwaRow2.alignment = {vertical: 'middle', horizontal: 'center'};
    let dwaRow2 = worksheet3.addRow([ '' , 'DWA' , '', '', '', '', '', '', '', '',
      mofCountDWA,buisCountDWA.toFixed(2),bochtCountDWA,ytStukCountDWA,krimpmofCountDWA,koppelstukCountDWA,reductieCountDWA,stopCountDWA
    ]);
    dwaRow2.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ff4c4c' },
        bgColor: { argb: 'ff4c4c' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14, bold: true};
    });
    dwaRow2.alignment = {vertical: 'middle', horizontal: 'center'};
    let gemRow2 = worksheet3.addRow([ '' , 'GEM' , '', '', '', '', '', '', '', '',
      mofCountGEM,buisCountGEM.toFixed(2),bochtCountGEM,ytStukCountGEM,krimpmofCountGEM,koppelstukCountGEM,reductieCountGEM,stopCountGEM
    ]);
    gemRow2.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'bdecb6' },
        bgColor: { argb: 'bdecb6' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14, bold: true};
    });
    gemRow2.alignment = {vertical: 'middle', horizontal: 'center'};







    //page project kolk

    let worksheet4 = workbook.addWorksheet('Project Kolk', {
      views: [{state: "frozen", ySplit: 3  }, {state: "frozen", ySplit: 4  }],
    });
    // Add new row
    let titleRow4 = worksheet4.addRow(['Kolkaansluitingen']);
    titleRow4.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    titleRow4.height = 32;
    worksheet4.mergeCells('A1:C1');
    let emptyRow7 = worksheet4.addRow([""]);
    let infoRow3 = worksheet4.addRow([""]);
    worksheet4.mergeCells('H3:J3');
    infoRow3.getCell('H').value = "Lambert coördinaten";
    infoRow3.getCell('H').border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    infoRow3.getCell('H').font = { name: 'Arial', family: 4, size: 11, bold: true};
    infoRow3.getCell('H').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet4.mergeCells('K3:S3');
    infoRow3.getCell('K').value = "HOEVEELHEDEN aansluiting";
    infoRow3.getCell('K').border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    infoRow3.getCell('K').font = { name: 'Arial', family: 4, size: 11, bold: true};
    infoRow3.getCell('K').alignment = { vertical: 'middle', horizontal: 'center' };

    let headers3 = ['Straat\n( + eventueel huisnummer)','Volgnr.','Equipmentnr. riolering','aard water\n (RWA/DWA/\nGEM)', 'soort', 'diameter\n(mm)', 'materiaal',
       'X-coördinaat','Y-coördinaat', 'Z-coördinaat', 'Mof\n(st)', 'Buis\n(m)', 'Bocht\n(st)', 'Y/T-stuk\n(st)', 'Krimpmof\n(st)', 'Koppelstuk\n(st)', 'Reductie\n(st)',
      'Stop\n(st)', 'Andere','naamgeving fiche'];

    //Add Header Row
    let headerRow3 = worksheet4.addRow(headers3);
    // Cell Style : Fill and Border
    headerRow3.height = 55;
    headerRow3.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A3866A' },
        bgColor: { argb: 'C4A484' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true};
    });
    // Set font, size and style in title row.
    headerRow3.alignment = { vertical: 'middle', horizontal: 'center' , wrapText: true};
    headerRow3.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    // Blank Row
    worksheet4.columns.forEach(function (column, i) {
      if(i === 0){
        column.width = 34;
      } else if (i === 1 || i === 4 || i === 5) {
        column.width = 10;
      } else if(i === 6 ){
        column.width = 11;
      } else if(i === 3 ){
        column.width = 15;
      } else if( i === 19 ){
        column.width = 110;
      } else if(  i === 10 || i === 11 || i === 12 || i === 17 ){
        column.width = 9;
      } else if( i === 7 || i === 8 || i === 9){
        column.width = 14;
      } else if(i === 2){
        column.width = 35;
      } else {
        column.width = 13;
      }
    });

    mofCountRWA = 0;
    buisCountRWA = 0;
    let yStukCountRWA = 0;
    bochtCountRWA = 0;
    reductieCountRWA = 0;
    krimpmofCountRWA = 0;
    koppelstukCountRWA = 0;
    stopCountRWA = 0;

    index = 0;
    for (let data of dataList.slokkerProjectList) {
      let project = data;
      if (project.slokker != null) {
        buisCountRWA += this.NullToZero(project.slokker.buis) + this.NullToZero(project.slokker.buis2);
        let bochtenCount = 0;
        if(!dataList.bochtenInGraden){
          bochtenCount += this.NullToZero(project.slokker.bocht)  + this.NullToZero(project.slokker.bocht2);
        } else {
          bochtenCount += this.NullToZero(project.slokker.gradenBocht45) + this.NullToZero(project.slokker.gradenBocht45Fase2) +
            this.NullToZero(project.slokker.gradenBocht90) + this.NullToZero(project.slokker.gradenBocht90Fase2);
        }
        bochtCountRWA += bochtenCount;
        reductieCountRWA += this.NullToZero(project.slokker.reductie);
        krimpmofCountRWA += this.NullToZero(project.slokker.krimpmof);
        koppelstukCountRWA += this.NullToZero(project.slokker.koppelstuk);
        stopCountRWA += this.NullToZero(project.slokker.stop);
        yStukCountRWA += this.NullToZero(project.slokker.Y);
        let mof = 0;
        let ytStuk = 0;
        ytStuk = this.NullToZero(project.slokker.Y);
        switch (project.slokker.tBuisStuk) {
          case 'aanboring':
            mofCountRWA++;
            mof = 1;
            break;
          case 'T-Stuk':
            ytStukCountRWA++;
            ytStuk += 1;
            break;
          case 'Y-Stuk':
            ytStukCountRWA++;
            ytStuk += 1;
            break;
        }
        let dataRow2 = worksheet4.addRow([
          project?.street + ' ' + project?.huisNr,
          project.index,
          project.equipNrRiolering,
          "RWA",
          "kolk",
          this.NullToZero(+project.slokker.diameter),
          this.NullToString(project.slokker.buisType),
          this.NullToString(project.slokker.xCoord),
          this.NullToString(project.slokker.yCoord),
          this.NullToString(project.slokker.zCoord),
          this.NullToZero(mof),
          this.NullToZero(project.slokker.buis) + this.NullToZero(project.slokker.buis2),
          bochtenCount,
          this.NullToZero(ytStuk),
          this.NullToZero(project.slokker.krimpmof),
          this.NullToZero(project.slokker.koppelstuk),
          this.NullToZero(project.slokker.reductie),
          this.NullToZero(project.slokker.stop),
          this.NullToString(project.slokker.andere),
          this.NullToString(project.naamFiche)
        ]);
        dataRow2.alignment = {vertical: 'middle', horizontal: 'center'};
        dataRow2.getCell('T').value = 'GEM=' + dataList.gemeenteCode + ' projectnr=' + dataList.rbProjectNr +
          ' adres=' + project.street + ' ko=' + dataList.rbProjectNr + '-kolknr' +  project.index + ' AB-kolk-fiche';
        dataRow2.getCell('C').value = dataList.rbProjectNr + '-kolknr' +  project.index;
        dataRow2.eachCell({includeEmpty: true}, (cell, number) => {
          cell.border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'},
          };
        });
        dataRow2.getCell('A').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'ADD8E6'},
          bgColor: {argb: '44c7db'},
        };
        dataRow2.getCell('B').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'ADD8E6'},
          bgColor: {argb: '44c7db'},
        };
        dataRow2.getCell('C').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'ADD8E6'},
          bgColor: {argb: '44c7db'},
        };
        dataRow2.getCell('F').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fceea7'},
          bgColor: {argb: '44c7db'},
        };
        dataRow2.getCell('G').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fceea7'},
          bgColor: {argb: '44c7db'},
        };
        dataRow2.getCell('H').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fceea7'},
          bgColor: {argb: '44c7db'},
        };
        dataRow2.getCell('I').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fceea7'},
          bgColor: {argb: '44c7db'},
        };
        dataRow2.getCell('J').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fceea7'},
          bgColor: {argb: '44c7db'},
        };
        dataRow2.getCell('K').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fbf8e6'},
          bgColor: {argb: 'fbf8e6'},
        };
        dataRow2.getCell('L').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fbf8e6'},
          bgColor: {argb: 'fbf8e6'},
        };
        dataRow2.getCell('M').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fbf8e6'},
          bgColor: {argb: 'fbf8e6'},
        };
        dataRow2.getCell('N').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fbf8e6'},
          bgColor: {argb: 'fbf8e6'},
        };
        dataRow2.getCell('O').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fbf8e6'},
          bgColor: {argb: 'fbf8e6'},
        };
        dataRow2.getCell('P').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fbf8e6'},
          bgColor: {argb: 'fbf8e6'},
        };
        dataRow2.getCell('Q').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fbf8e6'},
          bgColor: {argb: 'fbf8e6'},
        };
        dataRow2.getCell('R').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fbf8e6'},
          bgColor: {argb: 'fbf8e6'},
        };
        dataRow2.getCell('S').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'fbf8e6'},
          bgColor: {argb: 'fbf8e6'},
        };
      }
    }
    let rwaRow3 = worksheet4.addRow([ 'Totale hoeveelheden' , 'RWA' , '', '', '', '', '','','','',
      mofCountRWA,buisCountRWA.toFixed(2),bochtCountRWA,yStukCountRWA,krimpmofCountRWA,koppelstukCountRWA,reductieCountRWA,stopCountRWA
    ]);
    rwaRow3.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '63D1F4' },
        bgColor: { argb: '63D1F4' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Arial', family: 4, size: 14, bold: true};
    });
    rwaRow3.alignment = {vertical: 'middle', horizontal: 'center'};

    if(logoURL != null){
      this.getBase64ImageFromUrl(logoURL)
        .then(result => {
          let base64 = result as string;
          let logo = workbook.addImage({
            base64: base64,
            extension: 'png',
          });
          worksheet.addImage(logo, 'H12:L23');
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            fs.saveAs(blob, companyName + '-' + dataList.rbProjectNr + "-" + dataList.rbProjectNaam + "-" + dataList.rbGemeente + " VLARIO.xlsx");          });
        })
        .catch(err => console.error(err));
    } else {
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        fs.saveAs(blob, companyName + '-' + dataList.rbProjectNr + "-" + dataList.rbProjectNaam + "-" + dataList.rbGemeente + " VLARIO.xlsx");
      });
    }
  }

  generateExcelDWAzonderDiameter(title: string, headers: string[], dataList: Group, logoURL: string, companyName: string) {
    let workbook = new Workbook();
    let dwaPostNumbers = dataList.dwaPostNumbers;
    if(dwaPostNumbers == null){
      dwaPostNumbers = new Postnumbers();
    }
    let rwaPostNumbers = dataList.rwaPostNumbers;
    if(rwaPostNumbers == null){
      rwaPostNumbers = new Postnumbers();
    }
    let slokkerPostNumbers = dataList.slokkerPostNumbers;
    if(slokkerPostNumbers == null){
      slokkerPostNumbers = new SlokkerPostnumbers();
    }
    let worksheet = workbook.addWorksheet('Blad1 DWA', {
      views: [{state: "frozen", ySplit: 6  }],
    });

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
    titleRow.getCell('N').value = '  bedrijf: ' + companyName;
    if(dataList.projectList.length !== 0){
      let locationRow = worksheet.addRow([
        dataList.rbProjectNr + ' - ' + dataList.rbProjectNaam +
        ' - ' + dataList.rbGemeente
      ]);
      locationRow.font = {
        name: 'Arial',
        family: 4,
        size: 13,
        bold: true,
      };
      locationRow.height = 20;
    }
    worksheet.mergeCells('A2:I2');
    let putjesRow = worksheet.addRow(['VOOR HET PUTJE']);
    putjesRow.font = { name: 'Arial', family: 4, size: 13 };
    putjesRow.height = 18;
    putjesRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A3:O3');
    worksheet.mergeCells('P3:S3');
    putjesRow.getCell('P').value = 'NA HET PUTJE';
    putjesRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    let postenRow = worksheet.addRow(['Postnummers']);
    worksheet.mergeCells('A4:C4');
    postenRow.font = { name: 'Arial', family: 4, size: 11 };
    postenRow.getCell('D').value = this.NullToZero(dwaPostNumbers.mof);
    postenRow.getCell('E').value = this.NullToZero(dwaPostNumbers.tBuis);
    postenRow.getCell('F').value = this.NullToZero(dwaPostNumbers.tStuk);
    postenRow.getCell('G').value = this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow.getCell('H').value = this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow.getCell('I').value = this.NullToZero(dwaPostNumbers.bochtVoor);
    postenRow.getCell('J').value = this.NullToZero(dwaPostNumbers.reductieVoor);
    postenRow.getCell('K').value = this.NullToZero(dwaPostNumbers.yStuk);
    postenRow.getCell('L').value = this.NullToZero(dwaPostNumbers.gietIjzer);
    postenRow.getCell('M').value = this.NullToZero(dwaPostNumbers.betonKader);
    postenRow.getCell('N').value = this.NullToZero(dwaPostNumbers.aluKader);
    postenRow.getCell('O').value = this.NullToZero(dwaPostNumbers.funOmh);
    postenRow.getCell('P').value = this.NullToZero(dwaPostNumbers.buisAchter);
    postenRow.getCell('Q').value = this.NullToZero(dwaPostNumbers.bochtAchter);
    postenRow.getCell('R').value = this.NullToZero(dwaPostNumbers.reductieAchter);
    postenRow.getCell('S').value = this.NullToZero(dwaPostNumbers.YAchter);
    postenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow.alignment = { vertical: 'middle', horizontal: 'center' };

    let soortRow = worksheet.addRow(['Fundering/omhulling']);
    worksheet.mergeCells('A5:C5');
    worksheet.mergeCells('L5:N5');
    soortRow.getCell('L').value = 'putkaders';
    soortRow.font = { name: 'Arial', family: 4, size: 12 };
    soortRow.alignment = { vertical: 'middle', horizontal: 'center' };

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
    soortRow.getCell('D').value = mofMult.toString();
    soortRow.getCell('E').value = '';
    soortRow.getCell('F').value = '';
    soortRow.getCell('G').value = '1';
    soortRow.getCell('H').value = buisVertMult.toString();
    soortRow.getCell('I').value = bochtMult.toString();
    soortRow.getCell('J').value = '';
    soortRow.getCell('K').value = yStukMult.toString();
    soortRow.getCell('O').value = '';
    soortRow.getCell('P').value = '';
    soortRow.getCell('Q').value = '';
    soortRow.getCell('R').value = '';
    soortRow.getCell('S').value = '';

    soortRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    //Add Header Row
    let headerRow = worksheet.addRow(headers);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffcccb' },
        bgColor: { argb: 'ffcccb' }
      };


      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    // Set font, size and style in title row.

    // Blank Row
    worksheet.columns.forEach(function (column, i) {
      let maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell) {
        let columnLength = cell.value?.toString().length;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      if(i === 0){
        column.width = 26;
      } else {
        column.width = 11;
      }

    });
    let mofCount = 0;
    let tBuisCount = 0;
    let tStukCount = 0;
    let yStukCount = 0;
    let buisVoorHorCount = 0;
    let buisVoorVertCount = 0;
    let bochtVoorCount = 0;
    let reductieVoorCount = 0;
    let buisAchterCount = 0;
    let bochtAchterCount = 0;
    let reductieAchterCount = 0;
    let YAchterCount = 0;
    let gietIjzerCount = 0;
    let betonKaderCount = 0;
    let aluKaderCount = 0;
    let funOmhCount = 0;

    for (let data of dataList.projectList) {
      let project = data;
      if(project.droogWaterAfvoer != null && this.checkHasDWA(project.droogWaterAfvoer)) {
        if (dataList.heeftPloegen == null || dataList.heeftPloegen === false) {
          buisVoorHorCount += this.NullToZero(project.droogWaterAfvoer.buisVoorHor);
          buisVoorVertCount += this.NullToZero(project.droogWaterAfvoer.buisVoorVert);
          bochtVoorCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor);
          reductieVoorCount += this.NullToZero(project.droogWaterAfvoer.reductieVoor);
          buisAchterCount += this.NullToZero(project.droogWaterAfvoer.buisAchter);
          reductieAchterCount += this.NullToZero(project.droogWaterAfvoer.reductieAchter);
          bochtAchterCount += this.NullToZero(project.droogWaterAfvoer.bochtAchter);
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
          let mof = 0;
          let tBuis = 0;
          let tStuk = 0;
          let yStuk = 0;
          let flexAansluiting = 0;
          switch (project.droogWaterAfvoer.tBuisStuk) {
            case 'aanboring':
              mofCount++;
              mof = 1;
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
              flexAansluiting++;
              break;
          }
          if(project.droogWaterAfvoer.soortPutje === 't-stuk'){
            tStuk += 1;
            tStukCount++;
          }
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
          let funOmh =
            this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + (this.NullToZero(project.droogWaterAfvoer.buisVoorVert) * buisVertMult) +
            (this.NullToZero(project.droogWaterAfvoer.bochtVoor) * bochtMult) +
            (yStuk * yStukMult) +
            (this.NullToZero(mof) * mofMult);
          funOmhCount += +funOmh;
          let funOmhString = +(funOmh.toFixed(2));

          let dataRow = worksheet.addRow([
            project?.street,
            project?.huisNr,
            project?.index,
            this.ConvertNumberToEmptyString(mof),
            this.ConvertNumberToEmptyString(tBuis),
            this.ConvertNumberToEmptyString(tStuk),
            this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor)),
            this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert)),
            this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtVoor),
            this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieVoor),
            this.ConvertNumberToEmptyString(yStuk),
            this.BoolToString(project.droogWaterAfvoer.gietijzer),
            this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
            this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
            funOmhString,
            this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
            this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
            this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
            this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
          ]);
          dataRow.getCell('O').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ffffe0'},
            bgColor: {argb: 'ffffe0'},
          };
        } else {

          buisVoorHorCount += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
          buisVoorVertCount +=   this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)
          bochtVoorCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2);
          reductieVoorCount += this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2);
          buisAchterCount += this.NullToZero(project.droogWaterAfvoer.buisAchter);
          reductieAchterCount += this.NullToZero(project.droogWaterAfvoer.reductieAchter);
          bochtAchterCount += this.NullToZero(project.droogWaterAfvoer.bochtAchter);
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
          let mof = 0;
          let tBuis = 0;
          let tStuk = 0;
          let yStuk = 0;
          let flexAansluiting = 0;
          switch (project.droogWaterAfvoer.tBuisStuk) {
            case 'aanboring':
              mofCount++;
              mof = 1;
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
              flexAansluiting++;
              break;
          }
          if(project.droogWaterAfvoer.soortPutje === 't-stuk'){
            tStuk += 1;
            tStukCount++;
          }
          let funOmh =
            this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2) +
            (this.NullToZero(project.droogWaterAfvoer.buisVoorVert) * buisVertMult) + (this.NullToZero(project.droogWaterAfvoer.buisVoorVert2) * buisVertMult) +
            ((this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)) * bochtMult) +
            (yStuk * yStukMult) +
            (this.NullToZero(mof) * mofMult);
          funOmhCount += +funOmh;
          let funOmhString = +(funOmh.toFixed(2));

          let dataRow = worksheet.addRow([
            project?.street,
            project?.huisNr,
            project?.index,
            this.ConvertNumberToEmptyString(mof),
            this.ConvertNumberToEmptyString(tBuis),
            this.ConvertNumberToEmptyString(tStuk),
            this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2)),
            this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)),
            this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)),
            this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2)),
            this.ConvertNumberToEmptyString(yStuk),
            this.BoolToString(project.droogWaterAfvoer.gietijzer),
            this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
            this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
            funOmhString,
            this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
            this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
            this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
            this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
          ]);
          dataRow.getCell('O').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ffffe0'},
            bgColor: {argb: 'ffffe0'},
          };
        }
      }
    }
    worksheet.addRow('');
    let totalData = [
      'Totalen',
      '',
      '',
      mofCount + ' st',
      tBuisCount + ' st',
      tStukCount + ' st',
      buisVoorHorCount.toFixed(2) + ' m',
      buisVoorVertCount.toFixed(2) + ' m',
      bochtVoorCount + ' st',
      reductieVoorCount + ' st',
      yStukCount + ' st',
      gietIjzerCount,
      betonKaderCount,
      aluKaderCount,
      funOmhCount.toFixed(2),
      buisAchterCount.toFixed(2) + ' m',
      bochtAchterCount + ' st',
      reductieAchterCount + ' st',
      YAchterCount + ' st',
    ];
    let totalRow = worksheet.addRow(totalData);

    totalRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '44c7dbFF' },
        bgColor: { argb: '44db58FF' },
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    //Add Header Row
    let headerRow4 = worksheet.addRow(headers);
    // Cell Style : Fill and Border
    headerRow4.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffcccb' },
        bgColor: { argb: 'ffcccb' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    let postenRow4 = worksheet.addRow(['Postnummers']);
    //worksheet.mergeCells('A:C');
    postenRow4.font = { name: 'Arial', family: 4, size: 11 };
    postenRow4.getCell('D').value = this.NullToZero(dwaPostNumbers.mof);
    postenRow4.getCell('E').value = this.NullToZero(dwaPostNumbers.tBuis);
    postenRow4.getCell('F').value = this.NullToZero(dwaPostNumbers.tStuk);
    postenRow4.getCell('G').value = this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow4.getCell('H').value = this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow4.getCell('I').value = this.NullToZero(dwaPostNumbers.bochtVoor);
    postenRow4.getCell('J').value = this.NullToZero(dwaPostNumbers.reductieVoor);
    postenRow4.getCell('K').value = this.NullToZero(dwaPostNumbers.yStuk);
    postenRow4.getCell('L').value = this.NullToZero(dwaPostNumbers.gietIjzer);
    postenRow4.getCell('M').value = this.NullToZero(dwaPostNumbers.betonKader);
    postenRow4.getCell('N').value = this.NullToZero(dwaPostNumbers.aluKader);
    postenRow4.getCell('O').value = this.NullToZero(dwaPostNumbers.funOmh);
    postenRow4.getCell('P').value = this.NullToZero(dwaPostNumbers.buisAchter);
    postenRow4.getCell('Q').value = this.NullToZero(dwaPostNumbers.bochtAchter);
    postenRow4.getCell('R').value = this.NullToZero(dwaPostNumbers.reductieAchter);
    postenRow4.getCell('S').value = this.NullToZero(dwaPostNumbers.YAchter);
    postenRow4.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow4.alignment = { vertical: 'middle', horizontal: 'center' };




    //NIEUWE 2DE BLAD
    let worksheet2 = workbook.addWorksheet('Blad2 RWA', {
      views: [{state: "frozen", ySplit: 3  }, {state: "frozen", ySplit: 6  }],
    });
    // Add new row
  let titleRow2 = worksheet2.addRow(['Huis- en wachtaansluitingen RWA']);
    titleRow2.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    titleRow2.height = 23;
    worksheet2.mergeCells('A1:I1');
    worksheet2.mergeCells('N1:U1');
    titleRow2.getCell('N').value = '  bedrijf: ' + companyName;

    if(dataList.projectList.length !== 0){
      let locationRow2 = worksheet2.addRow([
        dataList.rbProjectNr + ' - ' + dataList.rbProjectNaam +
        ' - ' + dataList.rbGemeente
      ]);
      locationRow2.font = {
        name: 'Arial',
        family: 4,
        size: 13,
        bold: true,
      };
      locationRow2.height = 20;
    }
    worksheet2.mergeCells('A2:I2');
    let putjesRow2 = worksheet2.addRow(['VOOR HET PUTJE']);
    putjesRow2.font = { name: 'Arial', family: 4, size: 13 };
    putjesRow2.height = 18;
    putjesRow2.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet2.mergeCells('A3:O3');
    worksheet2.mergeCells('P3:S3');
    putjesRow2.getCell('P').value = 'NA HET PUTJE';
    putjesRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    let postenRow2 = worksheet2.addRow(['Postnummers']);
    worksheet2.mergeCells('A4:C4');
    postenRow2.font = { name: 'Arial', family: 4, size: 11 };
    postenRow2.getCell('D').value = this.NullToZero(rwaPostNumbers.mof);
    postenRow2.getCell('E').value = this.NullToZero(rwaPostNumbers.tBuis);
    postenRow2.getCell('F').value = this.NullToZero(rwaPostNumbers.tStuk);
    postenRow2.getCell('G').value = this.NullToZero(rwaPostNumbers.buisVoorHor);
    postenRow2.getCell('H').value = this.NullToZero(rwaPostNumbers.buisVoorVert);
    postenRow2.getCell('I').value = this.NullToZero(rwaPostNumbers.bochtVoor);
    postenRow2.getCell('J').value = this.NullToZero(rwaPostNumbers.reductieVoor);
    postenRow2.getCell('K').value = this.NullToZero(rwaPostNumbers.yStuk);
    postenRow2.getCell('L').value =  this.NullToZero(rwaPostNumbers.gietIjzer);
    postenRow2.getCell('M').value = this.NullToZero(rwaPostNumbers.betonKader);
    postenRow2.getCell('N').value = this.NullToZero(rwaPostNumbers.aluKader);
    postenRow2.getCell('O').value = this.NullToZero(rwaPostNumbers.funOmh);
    postenRow2.getCell('P').value = this.NullToZero(rwaPostNumbers.buisAchter);
    postenRow2.getCell('Q').value = this.NullToZero(rwaPostNumbers.bochtAchter);
    postenRow2.getCell('R').value = this.NullToZero(rwaPostNumbers.reductieAchter);
    postenRow2.getCell('S').value = this.NullToZero(rwaPostNumbers.YAchter);
    postenRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow2.alignment = { vertical: 'middle', horizontal: 'center' };

    let soortRow2 = worksheet2.addRow(['Fundering/omhulling']);
    worksheet2.mergeCells('A5:C5');
    worksheet2.mergeCells('L5:N5');
    soortRow2.getCell('L').value = 'putkaders';
    soortRow2.font = { name: 'Arial', family: 4, size: 12 };
    soortRow2.alignment = { vertical: 'middle', horizontal: 'center' };

    soortRow2.getCell('D').value = mofMult.toString();
    soortRow2.getCell('E').value = '';
    soortRow2.getCell('F').value = '';
    soortRow2.getCell('G').value = '1';
    soortRow2.getCell('H').value = buisVertMult.toString();
    soortRow2.getCell('I').value = bochtMult.toString();
    soortRow2.getCell('J').value = '';
    soortRow2.getCell('K').value = yStukMult.toString();
    soortRow2.getCell('O').value = '';
    soortRow2.getCell('P').value = '';
    soortRow2.getCell('Q').value = '';
    soortRow2.getCell('R').value = '';
    soortRow2.getCell('S').value = '';

    soortRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    //Add Header Row
    let headerRow2 = worksheet2.addRow(headers);
    // Cell Style : Fill and Border
    headerRow2.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffedFF' },
        bgColor: { argb: 'FFFF6600' }
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    // Set font, size and style in title row.

    // Blank Row
    worksheet2.columns.forEach(function (column, i) {
      let maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell) {
        let columnLength = cell.value?.toString().length;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      if(i === 0){
        column.width = 26;
      } else {
        column.width = 11;
      }

    });
    mofCount = 0;
    tBuisCount = 0;
    tStukCount = 0;
    yStukCount = 0;
    buisVoorHorCount = 0;
    buisVoorVertCount = 0;
    bochtVoorCount = 0;
    reductieVoorCount = 0;
    buisAchterCount = 0;
    bochtAchterCount = 0;
    reductieAchterCount = 0;
    YAchterCount = 0;
    gietIjzerCount = 0;
    betonKaderCount = 0;
    aluKaderCount = 0;

    funOmhCount = 0;
    for (let data of dataList.projectList) {
      let project = data;
      if (project.regenWaterAfvoer != null && this.checkHasRWA(project.regenWaterAfvoer)) {
        if (dataList.heeftPloegen == null || dataList.heeftPloegen === false) {
          buisVoorHorCount += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) ;
          buisVoorVertCount += this.NullToZero(project.regenWaterAfvoer.buisVoorVert) ;
          bochtVoorCount += this.NullToZero(project.regenWaterAfvoer.bochtVoor);
          reductieVoorCount += this.NullToZero(project.regenWaterAfvoer.reductieVoor);
          buisAchterCount += this.NullToZero(project.regenWaterAfvoer.buisAchter);
          reductieAchterCount += this.NullToZero(project.regenWaterAfvoer.reductieAchter);
          bochtAchterCount += this.NullToZero(project.regenWaterAfvoer.bochtAchter);
          YAchterCount += this.NullToZero(project.regenWaterAfvoer.YAchter);

          if (project.regenWaterAfvoer.alukader != null && project.regenWaterAfvoer.alukader === true && !project.regenWaterAfvoer.gietijzer) {
            aluKaderCount++;
          }
          if (project.regenWaterAfvoer.betonkader != null && project.regenWaterAfvoer.betonkader === true && project.regenWaterAfvoer.gietijzer ) {
            betonKaderCount++;
          }
          if (project.regenWaterAfvoer.gietijzer != null && project.regenWaterAfvoer.gietijzer === true) {
            gietIjzerCount++;
          }
          let mof = 0;
          let tBuis = 0;
          let tStuk = 0;
          let yStuk = 0;
          let flexAansluiting = 0;
          switch (project.regenWaterAfvoer.tBuisStuk) {
            case 'aanboring':
              mofCount++;
              mof = 1;
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
              flexAansluiting++;
              break;
          }
          if(project.regenWaterAfvoer.soortPutje === 't-stuk'){
            tStuk += 1;
            tStukCount++;
          }
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
          let funOmh =
            this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + (this.NullToZero(project.regenWaterAfvoer.buisVoorVert) * buisVertMult) +
            (this.NullToZero(project.regenWaterAfvoer.bochtVoor) * bochtMult) +
            (yStuk * yStukMult) +
            (this.NullToZero(mof) * mofMult);
          funOmhCount += +funOmh;
          let funOmhString = +(funOmh.toFixed(2));

          let dataRow2 = worksheet2.addRow([
            project?.street,
            project?.huisNr,
            project?.index,
            this.ConvertNumberToEmptyString(mof),
            this.ConvertNumberToEmptyString(tBuis),
            this.ConvertNumberToEmptyString(tStuk),
            this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorHor)),
            this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorVert)),
            this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtVoor),
            this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieVoor),
            this.ConvertNumberToEmptyString(yStuk),
            this.BoolToString(project.regenWaterAfvoer.gietijzer),
            this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false),
            this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false),
            funOmhString,
            this.ConvertNumberToEmptyString(project.regenWaterAfvoer.buisAchter),
            this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtAchter),
            this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter),
            this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter),
          ]);
          dataRow2.getCell('O').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ffffe0'},
            bgColor: {argb: 'ffffe0'},
          };
        } else {
          buisVoorHorCount += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
          buisVoorVertCount += this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
          bochtVoorCount += this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2);
          reductieVoorCount += this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2);
          buisAchterCount += this.NullToZero(project.regenWaterAfvoer.buisAchter);
          reductieAchterCount += this.NullToZero(project.regenWaterAfvoer.reductieAchter);
          bochtAchterCount += this.NullToZero(project.regenWaterAfvoer.bochtAchter);
          YAchterCount += this.NullToZero(project.regenWaterAfvoer.YAchter);

          if (project.regenWaterAfvoer.alukader != null && project.regenWaterAfvoer.alukader === true && !project.regenWaterAfvoer.gietijzer) {
            aluKaderCount++;
          }
          if (project.regenWaterAfvoer.betonkader != null && project.regenWaterAfvoer.betonkader === true && project.regenWaterAfvoer.gietijzer ) {
            betonKaderCount++;
          }
          if (project.regenWaterAfvoer.gietijzer != null && project.regenWaterAfvoer.gietijzer === true) {
            gietIjzerCount++;
          }
          let mof = 0;
          let tBuis = 0;
          let tStuk = 0;
          let yStuk = 0;
          let flexAansluiting = 0;
          switch (project.regenWaterAfvoer.tBuisStuk) {
            case 'aanboring':
              mofCount++;
              mof = 1;
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
              flexAansluiting++;
              break;
          }
          if(project.regenWaterAfvoer.soortPutje === 't-stuk'){
            tStuk += 1;
            tStukCount++;
          }
          let funOmh =
            this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2) +
            (this.NullToZero(project.regenWaterAfvoer.buisVoorVert) * buisVertMult) + (this.NullToZero(project.regenWaterAfvoer.buisVoorVert2) * buisVertMult) +
            ((this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2))) * bochtMult +
            (yStuk * yStukMult) +
            (this.NullToZero(mof) * mofMult);

          funOmhCount += +funOmh;

          let funOmhString = +(funOmh.toFixed(2));

          let dataRow2 = worksheet2.addRow([
            project?.street,
            project?.huisNr,
            project?.index,
            this.ConvertNumberToEmptyString(mof),
            this.ConvertNumberToEmptyString(tBuis),
            this.ConvertNumberToEmptyString(tStuk),
            this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2)),
            this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2)),

            this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2)),
            this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2)),
            this.ConvertNumberToEmptyString(yStuk),
            this.BoolToString(project.regenWaterAfvoer.gietijzer),
            this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false),
            this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false),
            funOmhString,
            this.ConvertNumberToEmptyString(project.regenWaterAfvoer.buisAchter),
            this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtAchter),
            this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter),
            this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter),
          ]);
          dataRow2.getCell('O').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ffffe0'},
            bgColor: {argb: 'ffffe0'},
          };
        }
      }
    }
    worksheet2.addRow('');
    let totalData2 = [
      'Totalen',
      '',
      '',
      mofCount + ' st',
      tBuisCount + ' st',
      tStukCount + ' st',
      buisVoorHorCount.toFixed(2) + ' m',
      buisVoorVertCount.toFixed(2) + ' m',
      bochtVoorCount + ' st',
      reductieVoorCount + ' st',
      yStukCount + ' st',
      gietIjzerCount,
      betonKaderCount,
      aluKaderCount,
      funOmhCount.toFixed(2),
      buisAchterCount.toFixed(2) + ' m',
      bochtAchterCount + ' st',
      reductieAchterCount + ' st',
      YAchterCount + ' st',
    ];
    let totalRow2 = worksheet2.addRow(totalData2);

    totalRow2.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '44c7dbFF' },
        bgColor: { argb: '44db58FF' },
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    //Add Header Row
    let headerRow5 = worksheet2.addRow(headers);
    // Cell Style : Fill and Border
    headerRow5.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffedFF' },
        bgColor: { argb: 'FFFF6600' }
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    let postenRow5 = worksheet2.addRow(['Postnummers']);
    postenRow5.font = { name: 'Arial', family: 4, size: 11 };
    postenRow5.getCell('D').value = this.NullToZero(rwaPostNumbers.mof);
    postenRow5.getCell('E').value = this.NullToZero(rwaPostNumbers.tBuis);
    postenRow5.getCell('F').value = this.NullToZero(rwaPostNumbers.tStuk);
    postenRow5.getCell('G').value = this.NullToZero(rwaPostNumbers.buisVoorHor);
    postenRow5.getCell('H').value = this.NullToZero(rwaPostNumbers.buisVoorVert);
    postenRow5.getCell('I').value = this.NullToZero(rwaPostNumbers.bochtVoor);
    postenRow5.getCell('J').value = this.NullToZero(rwaPostNumbers.reductieVoor);
    postenRow5.getCell('K').value = this.NullToZero(rwaPostNumbers.yStuk);
    postenRow5.getCell('L').value =  this.NullToZero(rwaPostNumbers.gietIjzer);
    postenRow5.getCell('M').value = this.NullToZero(rwaPostNumbers.betonKader);
    postenRow5.getCell('N').value = this.NullToZero(rwaPostNumbers.aluKader);
    postenRow5.getCell('O').value = this.NullToZero(rwaPostNumbers.funOmh);
    postenRow5.getCell('P').value = this.NullToZero(rwaPostNumbers.buisAchter);
    postenRow5.getCell('Q').value = this.NullToZero(rwaPostNumbers.bochtAchter);
    postenRow5.getCell('R').value = this.NullToZero(rwaPostNumbers.reductieAchter);
    postenRow5.getCell('S').value = this.NullToZero(rwaPostNumbers.YAchter);
    postenRow5.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow5.alignment = { vertical: 'middle', horizontal: 'center' };

    //3rd page kolken
    let worksheet3 = workbook.addWorksheet('Blad3 kolken', {
      views: [{state: "frozen", ySplit: 4  }],
    });
    // Add new row
    let titleRow3 = worksheet3.addRow(['Kolken']);
    titleRow3.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    worksheet3.mergeCells('A1:H1');
    titleRow3.height = 23;
    if(dataList.slokkerProjectList.length !== 0){
      let locationRow3 = worksheet3.addRow([
        dataList.rbProjectNr + ' - ' + dataList.rbProjectNaam +
      ' - ' + dataList.rbGemeente
      ]);
      locationRow3.font = {
        name: 'Arial',
        family: 4,
        size: 13,
        bold: true,
      };
      locationRow3.height = 20;
      worksheet3.mergeCells('A2:H2');
    }

    let postenRow3 = worksheet3.addRow(['Postnummers']);
    worksheet3.mergeCells('A3:B3');
    postenRow3.font = { name: 'Arial', family: 4, size: 12 };
    postenRow3.getCell('C').value = this.NullToZero(slokkerPostNumbers.mof);
    postenRow3.getCell('D').value = this.NullToZero(slokkerPostNumbers.tBuis);
    postenRow3.getCell('E').value = this.NullToZero(slokkerPostNumbers.ytStuk);
    postenRow3.getCell('F').value = this.NullToZero(slokkerPostNumbers.buis);
    postenRow3.getCell('G').value = this.NullToZero(slokkerPostNumbers.bocht);
    postenRow3.getCell('H').value = this.NullToZero(slokkerPostNumbers.reductie);
    postenRow3.getCell('I').value = this.NullToZero(slokkerPostNumbers.funOmh);
    postenRow3.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow3.alignment = { vertical: 'middle', horizontal: 'center' };

    let slokkerHeaders = ['Straat', 'Kolk nr.', 'Mof', 'T-Buis', 'Y/T-Stuk', 'Buis', 'Bocht', 'Reductie', 'Fun/omh'];
    //Add Header Row
    let headerRow3 = worksheet3.addRow(slokkerHeaders);
    headerRow3.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffedFF' },
        bgColor: { argb: 'FFFF6600' }
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    mofCount = 0;
    tBuisCount = 0;
    funOmhCount = 0;
    let ytStukCount = 0;
    let bochtCount = 0;
    let buisCount = 0;
    let reductieCount = 0;
    for (let data of dataList.slokkerProjectList) {
      let slokker = data;

      let mof = 0;
      let tBuis = 0;
      let ytStuk = 0;
      switch (slokker.slokker.tBuisStuk) {
        case 'aanboring':
          mofCount++;
          mof = 1;
          break;
        case 'T-Buis':
          tBuisCount++;
          tBuis = 1;
          break;
        case 'T-Stuk':
          ytStuk += 1;
          ytStukCount++;
          break;
        case 'Y-Stuk':
          ytStuk += 1;
          ytStukCount++;
          break;
      }
      bochtCount += this.NullToZero(slokker.slokker.bocht) + this.NullToZero(slokker.slokker.bocht2);
      buisCount += this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2);
      reductieCount += this.NullToZero(slokker.slokker.reductie);
      ytStukCount += this.NullToZero(slokker.slokker.Y);
      ytStuk += this.NullToZero(slokker.slokker.Y);

      let funOmh =
        (this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2)) +
        (((this.NullToZero(slokker.slokker.bocht) + this.NullToZero(slokker.slokker.bocht2)) * bochtMult) +
        (ytStuk * yStukMult) +
        (this.NullToZero(mof) * mofMult));

      funOmhCount += +funOmh;
      let funOmhString = +(funOmh.toFixed(2));

      let dataRow3 = worksheet3.addRow([
        slokker.street,
        slokker.index,
        this.ConvertNumberToEmptyString(mof),
        this.ConvertNumberToEmptyString(tBuis),
        this.ConvertNumberToEmptyString(ytStuk),
        this.ConvertNumberToEmptyString(this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2)),
        this.ConvertNumberToEmptyString(this.NullToZero(slokker.slokker.bocht) + this.NullToZero(slokker.slokker.bocht2)),
        this.ConvertNumberToEmptyString(slokker.slokker.reductie),
        this.ConvertNumberToEmptyString(funOmhString)
      ]);
      dataRow3.getCell('I').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'ffffe0'},
        bgColor: {argb: 'ffffe0'},
      };
    }
    worksheet3.addRow('');
    //total row

    // Blank Row
    worksheet3.columns.forEach(function (column, i) {
      let maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell) {
        let columnLength = cell.value?.toString().length;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      if(i === 0){
        column.width = 30;
      } else {
        column.width = 13;
      }
    });
    let totalData3 = [
      'Totalen',
      '',
      mofCount + ' st',
      tBuisCount + ' st',
      ytStukCount + ' st',
      buisCount.toFixed(2) + ' m',
      bochtCount + ' st',
      reductieCount + ' st',
      funOmhCount.toFixed(2)
    ];
    let totalRow3 = worksheet3.addRow(totalData3);

    totalRow3.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '44c7dbFF' },
        bgColor: { argb: '44db58FF' },
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    //Add Header Row
    let headerRow6 = worksheet3.addRow(slokkerHeaders);
    headerRow6.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffedFF' },
        bgColor: { argb: 'FFFF6600' }
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    let postenRow6 = worksheet3.addRow(['Postnummers']);

    postenRow6.font = { name: 'Arial', family: 4, size: 12 };
    postenRow6.getCell('C').value = this.NullToZero(slokkerPostNumbers.mof);
    postenRow6.getCell('D').value = this.NullToZero(slokkerPostNumbers.tBuis);
    postenRow6.getCell('E').value = this.NullToZero(slokkerPostNumbers.ytStuk);
    postenRow6.getCell('F').value = this.NullToZero(slokkerPostNumbers.buis);
    postenRow6.getCell('G').value = this.NullToZero(slokkerPostNumbers.bocht);
    postenRow6.getCell('H').value = this.NullToZero(slokkerPostNumbers.reductie);
    postenRow6.getCell('I').value = this.NullToZero(slokkerPostNumbers.funOmh);

    postenRow6.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow6.alignment = { vertical: 'middle', horizontal: 'center' };

    if(logoURL != null){
      this.getBase64ImageFromUrl(logoURL)
        .then(result => {
          let base64 = result as string;
          let logo = workbook.addImage({
            base64: base64,
            extension: 'png',
          });
          worksheet.addImage(logo, 'K1:M2');
          worksheet2.addImage(logo, 'K1:M2');
          worksheet3.addImage(logo, 'J1:L3');
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            fs.saveAs(blob, companyName + '-' + dataList.rbProjectNr + "-" + dataList.rbProjectNaam + "-" + dataList.rbGemeente + " MEETSTAAT.xlsx");          });
        })
        .catch(err => console.error(err));
    } else {
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        fs.saveAs(blob, companyName + '-' + dataList.rbProjectNr + "-" + dataList.rbProjectNaam + "-" + dataList.rbGemeente + " MEETSTAAT.xlsx");      });
    }
  }

  generateExcelDWAmetDiameter(title: string, headers: string[], dataList: Group, logoURL: string, companyName: string) {
    let workbook = new Workbook();
    let dwaPostNumbers = dataList.dwaPostNumbers;
    if(dwaPostNumbers == null){
      dwaPostNumbers = new Postnumbers();
    }
    let rwaPostNumbers = dataList.rwaPostNumbers;
    if(rwaPostNumbers == null){
      rwaPostNumbers = new Postnumbers();
    }
    let slokkerPostNumbers = dataList.slokkerPostNumbers;
    if(slokkerPostNumbers == null){
      slokkerPostNumbers = new SlokkerPostnumbers();
    }
    let worksheet = workbook.addWorksheet('Blad1 DWA', {
      views: [{state: "frozen", ySplit: 3  }, {state: "frozen", ySplit: 6  }],
    });
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
    titleRow.getCell('N').value = '  bedrijf: ' + companyName;
    if(dataList.projectList.length !== 0){
      let locationRow = worksheet.addRow([
        dataList.rbProjectNr + ' - ' + dataList.rbProjectNaam +
        ' - ' + dataList.rbGemeente
      ]);
      locationRow.font = {
        name: 'Arial',
        family: 4,
        size: 13,
        bold: true,
      };
      locationRow.height = 20;
    }
    worksheet.mergeCells('A2:I2');
    let putjesRow = worksheet.addRow(['VOOR HET PUTJE']);
    putjesRow.font = { name: 'Arial', family: 4, size: 13 };
    putjesRow.height = 18;
    putjesRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A3:W3');
    worksheet.mergeCells('X3:AA3');
    putjesRow.getCell('X').value = 'NA HET PUTJE';
    putjesRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    let postenRow = worksheet.addRow(['Postnummers']);
    worksheet.mergeCells('A4:C4');
    postenRow.font = { name: 'Arial', family: 4, size: 11 };
    postenRow.getCell('D').value = this.NullToZero(dwaPostNumbers.mof);
    postenRow.getCell('E').value = this.NullToZero(dwaPostNumbers.tBuis);
    postenRow.getCell('F').value = this.NullToZero(dwaPostNumbers.tStuk);
    postenRow.getCell('G').value = this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow.getCell('H').value =  this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow.getCell('I').value =  this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow.getCell('J').value = this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow.getCell('K').value =  this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow.getCell('L').value = this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow.getCell('M').value =  this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow.getCell('N').value = this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow.getCell('O').value =  this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow.getCell('P').value = this.NullToZero(dwaPostNumbers.buisVoorVert);

    postenRow.getCell('Q').value = this.NullToZero(dwaPostNumbers.bochtVoor);
    postenRow.getCell('R').value = this.NullToZero(dwaPostNumbers.reductieVoor);
    postenRow.getCell('S').value = this.NullToZero(dwaPostNumbers.yStuk);
    postenRow.getCell('T').value = this.NullToZero(dwaPostNumbers.gietIjzer);
    postenRow.getCell('U').value = this.NullToZero(dwaPostNumbers.betonKader);
    postenRow.getCell('V').value = this.NullToZero(dwaPostNumbers.aluKader);
    postenRow.getCell('W').value = this.NullToZero(dwaPostNumbers.funOmh);
    postenRow.getCell('X').value = this.NullToZero(dwaPostNumbers.buisAchter);
    postenRow.getCell('Y').value = this.NullToZero(dwaPostNumbers.bochtAchter);
    postenRow.getCell('Z').value = this.NullToZero(dwaPostNumbers.reductieAchter);
    postenRow.getCell('AA').value = this.NullToZero(dwaPostNumbers.YAchter);
    postenRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow.alignment = { vertical: 'middle', horizontal: 'center' };

    let soortRow = worksheet.addRow(['Fundering/omhulling']);
    worksheet.mergeCells('A5:C5');
    worksheet.mergeCells('T5:V5');
    soortRow.getCell('T').value = 'putkaders';
    soortRow.font = { name: 'Arial', family: 4, size: 12 };
    soortRow.alignment = { vertical: 'middle', horizontal: 'center' };

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
    soortRow.getCell('D').value = mofMult.toString();
    soortRow.getCell('E').value = '';
    soortRow.getCell('F').value = '';
    soortRow.getCell('G').value = '1';
    soortRow.getCell('H').value = buisVertMult.toString();
    soortRow.getCell('I').value = '1';
    soortRow.getCell('J').value = buisVertMult.toString();
    soortRow.getCell('K').value = '1';
    soortRow.getCell('L').value = buisVertMult.toString();
    soortRow.getCell('M').value = '1';
    soortRow.getCell('N').value = buisVertMult.toString();
    soortRow.getCell('O').value = '1';
    soortRow.getCell('P').value = buisVertMult.toString();

    soortRow.getCell('Q').value = bochtMult.toString();
    soortRow.getCell('R').value = '';
    soortRow.getCell('S').value = yStukMult.toString();
    soortRow.getCell('W').value = '';
    soortRow.getCell('X').value = '';
    soortRow.getCell('Y').value = '';
    soortRow.getCell('Z').value = '';
    soortRow.getCell('AA').value = '';


    soortRow.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    //Add Header Row
    let headerRow = worksheet.addRow(headers);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffcccb' },
        bgColor: { argb: 'ffcccb' }
      };


      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    // Set font, size and style in title row.

    // Blank Row
    worksheet.columns.forEach(function (column, i) {
      let maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell) {
        let columnLength = cell.value?.toString().length;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      if(i === 0){
        column.width = 26;
      } else if(i >= 6 && i <= 13) {
        column.width = 14;
      }else if(i >= 14 && i <= 15) {
        column.width = 18;
      } else {
        column.width = 11;
      }

    });
    let mofCount = 0;
    let tBuisCount = 0;
    let tStukCount = 0;
    let yStukCount = 0;
    let buisVoorHorCount125 = 0;
    let buisVoorVertCount125 = 0;
    let buisVoorHorCount150 = 0;
    let buisVoorVertCount150 = 0;
    let buisVoorHorCount160 = 0;
    let buisVoorVertCount160 = 0;
    let buisVoorHorCount200 = 0;
    let buisVoorVertCount200 = 0;
    let buisAndereHorCount = 0;
    let buisAndereVertCount = 0;
    let bochtVoorCount = 0;
    let reductieVoorCount = 0;
    let buisAchterCount = 0;
    let bochtAchterCount = 0;
    let reductieAchterCount = 0;
    let YAchterCount = 0;
    let gietIjzerCount = 0;
    let betonKaderCount = 0;
    let aluKaderCount = 0;
    let funOmhCount = 0;

    for (let data of dataList.projectList) {
      let project = data;
      if(project.droogWaterAfvoer != null && this.checkHasDWA(project.droogWaterAfvoer)) {
        if (dataList.heeftPloegen == null || dataList.heeftPloegen === false) {
          if( project.droogWaterAfvoer.diameter == null || +project.droogWaterAfvoer.diameter === 125){
            buisVoorHorCount125 += this.NullToZero(project.droogWaterAfvoer.buisVoorHor);
            buisVoorVertCount125 += this.NullToZero(project.droogWaterAfvoer.buisVoorVert);
          } else if(+project.droogWaterAfvoer.diameter === 150){
            buisVoorHorCount150 += this.NullToZero(project.droogWaterAfvoer.buisVoorHor);
            buisVoorVertCount150 += this.NullToZero(project.droogWaterAfvoer.buisVoorVert);
          } else if(+project.droogWaterAfvoer.diameter === 160){
            buisVoorHorCount160 += this.NullToZero(project.droogWaterAfvoer.buisVoorHor);
            buisVoorVertCount160 += this.NullToZero(project.droogWaterAfvoer.buisVoorVert);
          } else if(+project.droogWaterAfvoer.diameter === 200){
            buisVoorHorCount200 += this.NullToZero(project.droogWaterAfvoer.buisVoorHor);
            buisVoorVertCount200 += this.NullToZero(project.droogWaterAfvoer.buisVoorVert);
          } else if(project.droogWaterAfvoer.diameter === 'andere' || project.droogWaterAfvoer.diameter === 'onbekend'){
            buisAndereHorCount +=  this.NullToZero(project.droogWaterAfvoer.buisVoorHor);
            buisAndereVertCount += this.NullToZero(project.droogWaterAfvoer.buisVoorVert);
          }

          bochtVoorCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor);
          reductieVoorCount += this.NullToZero(project.droogWaterAfvoer.reductieVoor);
          buisAchterCount += this.NullToZero(project.droogWaterAfvoer.buisAchter);
          reductieAchterCount += this.NullToZero(project.droogWaterAfvoer.reductieAchter);
          bochtAchterCount += this.NullToZero(project.droogWaterAfvoer.bochtAchter);
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
          let mof = 0;
          let tBuis = 0;
          let tStuk = 0;
          let yStuk = 0;
          let flexAansluiting = 0;
          switch (project.droogWaterAfvoer.tBuisStuk) {
            case 'aanboring':
              mofCount++;
              mof = 1;
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
              flexAansluiting++;
              break;
          }
          if(project.droogWaterAfvoer.soortPutje === 't-stuk'){
            tStuk += 1;
            tStukCount++;
          }
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
          let funOmh =
            this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + (this.NullToZero(project.droogWaterAfvoer.buisVoorVert) * buisVertMult) +
            (this.NullToZero(project.droogWaterAfvoer.bochtVoor) * bochtMult) +
            (yStuk * yStukMult) +
            (this.NullToZero(mof) * mofMult);
          funOmhCount += +funOmh;
          let funOmhString = +(funOmh.toFixed(2));
          let dataRow;
          if(project.droogWaterAfvoer.diameter == null || +project.droogWaterAfvoer.diameter === 125 ){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert)),
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          } else if(+project.droogWaterAfvoer.diameter === 150){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert)),
              '',
              '',
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          } else if(+project.droogWaterAfvoer.diameter === 160){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert)),
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          } else if(+project.droogWaterAfvoer.diameter === 200){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert)),
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          } else if(project.droogWaterAfvoer.diameter === 'onbekend'){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor)) + ' (onb. mm)',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert)) + ' (onb. mm)',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          } else if(project.droogWaterAfvoer.diameter === 'andere'){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor)) + (project.droogWaterAfvoer.diameterAndere !== '' ?  ' ('  +project.droogWaterAfvoer.diameterAndere +'mm)' : ''),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert))  + (project.droogWaterAfvoer.diameterAndere !== '' ? ' (' +  project.droogWaterAfvoer.diameterAndere +'mm)' : ''),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          }

          dataRow.getCell('W').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ffffe0'},
            bgColor: {argb: 'ffffe0'},
          };
        } else {
          if( project.droogWaterAfvoer.diameter == null || +project.droogWaterAfvoer.diameter === 125){
            buisVoorHorCount125 += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
            buisVoorVertCount125 += this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
          } else if(+project.droogWaterAfvoer.diameter === 150 ){
            buisVoorHorCount150 += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
            buisVoorVertCount150 += this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
          } else if(+project.droogWaterAfvoer.diameter === 160 ){
            buisVoorHorCount160 += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
            buisVoorVertCount160 += this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
          } else if(+project.droogWaterAfvoer.diameter === 200 ){
            buisVoorHorCount200 += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
            buisVoorVertCount200 += this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
          } else if(project.droogWaterAfvoer.diameter === 'andere' || project.droogWaterAfvoer.diameter === 'onbekend'){
            buisAndereHorCount += this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2);
            buisAndereVertCount += this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2);
          }

          bochtVoorCount += this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2);
          reductieVoorCount += this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2);
          buisAchterCount += this.NullToZero(project.droogWaterAfvoer.buisAchter);
          reductieAchterCount += this.NullToZero(project.droogWaterAfvoer.reductieAchter);
          bochtAchterCount += this.NullToZero(project.droogWaterAfvoer.bochtAchter);
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
          let mof = 0;
          let tBuis = 0;
          let tStuk = 0;
          let yStuk = 0;
          let flexAansluiting = 0;
          switch (project.droogWaterAfvoer.tBuisStuk) {
            case 'aanboring':
              mofCount++;
              mof = 1;
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
              flexAansluiting++;
              break;
          }
          if(project.droogWaterAfvoer.soortPutje === 't-stuk'){
            tStuk += 1;
            tStukCount++;
          }
          let funOmh =
            this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2) +
            (this.NullToZero(project.droogWaterAfvoer.buisVoorVert) * buisVertMult) + (this.NullToZero(project.droogWaterAfvoer.buisVoorVert2) * buisVertMult) +
            ((this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)) * bochtMult) +
            (yStuk * yStukMult) +
            (this.NullToZero(mof) * mofMult);
          funOmhCount += +funOmh;
          let funOmhString = +(funOmh.toFixed(2));
          let dataRow;
          if(project.droogWaterAfvoer.diameter == null || +project.droogWaterAfvoer.diameter === 125 ){
             dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
               project?.index,
               this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)),
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          } else if(+project.droogWaterAfvoer.diameter === 150){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)),
              '',
              '',
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          } else if(+project.droogWaterAfvoer.diameter === 160){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)),
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          } else if(+project.droogWaterAfvoer.diameter === 200){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)),
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          } else if(project.droogWaterAfvoer.diameter === 'onbekend'){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2)) + ' (onb. mm)',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)) + ' (onb. mm)',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          } else if(project.droogWaterAfvoer.diameter === 'andere'){
            dataRow = worksheet.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorHor) + this.NullToZero(project.droogWaterAfvoer.buisVoorHor2)) + (project.droogWaterAfvoer.diameterAndere !== '' ?  ' ('  +project.droogWaterAfvoer.diameterAndere +'mm)' : ''),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.buisVoorVert) + this.NullToZero(project.droogWaterAfvoer.buisVoorVert2)) + (project.droogWaterAfvoer.diameterAndere !== '' ?  ' ('  +project.droogWaterAfvoer.diameterAndere +'mm)' : ''),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.bochtVoor) + this.NullToZero(project.droogWaterAfvoer.bochtVoor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.droogWaterAfvoer.reductieVoor) + this.NullToZero(project.droogWaterAfvoer.reductieVoor2)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.droogWaterAfvoer.gietijzer),
              this.BoolToString(project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.betonkader : false),
              this.BoolToString(!project.droogWaterAfvoer.gietijzer ? project.droogWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.droogWaterAfvoer.YAchter),
            ]);
          }

          dataRow.getCell('W').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ffffe0'},
            bgColor: {argb: 'ffffe0'},
          };
        }
      }
    }
    worksheet.addRow('');
    let totalData = [
      'Totalen',
      '',
      '',
      mofCount + ' st',
      tBuisCount + ' st',
      tStukCount + ' st',
      buisVoorHorCount125.toFixed(2) + ' m',
      buisVoorVertCount125.toFixed(2) + ' m',
      buisVoorHorCount150.toFixed(2) + ' m',
      buisVoorVertCount150.toFixed(2) + ' m',
      buisVoorHorCount160.toFixed(2) + ' m',
      buisVoorVertCount160.toFixed(2) + ' m',
      buisVoorHorCount200.toFixed(2) + ' m',
      buisVoorVertCount200.toFixed(2) + ' m',
      buisAndereHorCount.toFixed(2) + ' m',
      buisAndereVertCount.toFixed(2) + ' m',
      bochtVoorCount + ' st',
      reductieVoorCount + ' st',
      yStukCount + ' st',
      gietIjzerCount,
      betonKaderCount,
      aluKaderCount,
      funOmhCount.toFixed(2),
      buisAchterCount.toFixed(2) + ' m',
      bochtAchterCount + ' st',
      reductieAchterCount + ' st',
      YAchterCount + ' st',
    ];
    let totalRow = worksheet.addRow(totalData);

    totalRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '44c7dbFF' },
        bgColor: { argb: '44db58FF' },
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    //Add Header Row
    let headerRow4 = worksheet.addRow(headers);
    // Cell Style : Fill and Border
    headerRow4.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffcccb' },
        bgColor: { argb: 'ffcccb' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    let postenRow4 = worksheet.addRow(['Postnummers']);
    //worksheet.mergeCells('A:C');
    postenRow4.font = { name: 'Arial', family: 4, size: 11 };
    postenRow4.getCell('D').value = this.NullToZero(dwaPostNumbers.mof);
    postenRow4.getCell('E').value = this.NullToZero(dwaPostNumbers.tBuis);
    postenRow4.getCell('F').value = this.NullToZero(dwaPostNumbers.tStuk);
    postenRow4.getCell('G').value = this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow4.getCell('H').value =  this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow4.getCell('I').value =  this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow4.getCell('J').value = this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow4.getCell('K').value =  this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow4.getCell('L').value = this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow4.getCell('M').value =  this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow4.getCell('N').value = this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow4.getCell('O').value =  this.NullToZero(dwaPostNumbers.buisVoorHor);
    postenRow4.getCell('P').value = this.NullToZero(dwaPostNumbers.buisVoorVert);
    postenRow4.getCell('Q').value = this.NullToZero(dwaPostNumbers.bochtVoor);
    postenRow4.getCell('R').value = this.NullToZero(dwaPostNumbers.reductieVoor);
    postenRow4.getCell('S').value = this.NullToZero(dwaPostNumbers.yStuk);
    postenRow4.getCell('T').value = this.NullToZero(dwaPostNumbers.gietIjzer);
    postenRow4.getCell('U').value = this.NullToZero(dwaPostNumbers.betonKader);
    postenRow4.getCell('V').value = this.NullToZero(dwaPostNumbers.aluKader);
    postenRow4.getCell('W').value = this.NullToZero(dwaPostNumbers.funOmh);;
    postenRow4.getCell('X').value = this.NullToZero(dwaPostNumbers.buisAchter);
    postenRow4.getCell('Y').value = this.NullToZero(dwaPostNumbers.bochtAchter);
    postenRow4.getCell('Z').value = this.NullToZero(dwaPostNumbers.reductieAchter);
    postenRow4.getCell('AA').value = this.NullToZero(dwaPostNumbers.YAchter);
    postenRow4.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow4.alignment = { vertical: 'middle', horizontal: 'center' };




    //NIEUWE 2DE BLAD

    let worksheet2 = workbook.addWorksheet('Blad2 RWA', {
      views: [{state: "frozen", ySplit: 3  }, {state: "frozen", ySplit: 6  }],
    });
    let titleRow2 = worksheet2.addRow(['Huis- en wachtaansluitingen RWA']);
    titleRow2.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    titleRow2.height = 23;
    worksheet2.mergeCells('A1:I1');
    worksheet2.mergeCells('N1:U1');
    titleRow2.getCell('N').value = '  bedrijf: ' + companyName;

    if(dataList.projectList.length !== 0){
      let locationRow2 = worksheet2.addRow([
        dataList.rbProjectNr + ' - ' + dataList.rbProjectNaam +
        ' - ' + dataList.rbGemeente
      ]);
      locationRow2.font = {
        name: 'Arial',
        family: 4,
        size: 13,
        bold: true,
      };
      locationRow2.height = 20;
    }
    worksheet2.mergeCells('A2:I2');
    let putjesRow2 = worksheet2.addRow(['VOOR HET PUTJE']);
    putjesRow2.font = { name: 'Arial', family: 4, size: 13 };
    putjesRow2.height = 18;
    putjesRow2.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet2.mergeCells('A3:S3');
    worksheet2.mergeCells('T3:W3');
    putjesRow2.getCell('T').value = 'NA HET PUTJE';
    putjesRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    let postenRow2 = worksheet2.addRow(['Postnummers']);
    worksheet2.mergeCells('A4:C4');
    postenRow2.font = { name: 'Arial', family: 4, size: 11 };
    postenRow2.getCell('D').value = this.NullToZero(rwaPostNumbers.mof);
    postenRow2.getCell('E').value = this.NullToZero(rwaPostNumbers.tBuis);
    postenRow2.getCell('F').value = this.NullToZero(rwaPostNumbers.tStuk);
    postenRow2.getCell('G').value = this.NullToZero(rwaPostNumbers.buisVoorHor);
    postenRow2.getCell('H').value =  this.NullToZero(rwaPostNumbers.buisVoorVert);
    postenRow2.getCell('I').value =  this.NullToZero(rwaPostNumbers.buisVoorHor);
    postenRow2.getCell('J').value = this.NullToZero(rwaPostNumbers.buisVoorVert);
    postenRow2.getCell('K').value =  this.NullToZero(rwaPostNumbers.buisVoorHor);
    postenRow2.getCell('L').value = this.NullToZero(rwaPostNumbers.buisVoorVert);
    postenRow2.getCell('M').value = this.NullToZero(rwaPostNumbers.bochtVoor);
    postenRow2.getCell('N').value = this.NullToZero(rwaPostNumbers.reductieVoor);
    postenRow2.getCell('O').value = this.NullToZero(rwaPostNumbers.yStuk);
    postenRow2.getCell('P').value = this.NullToZero(rwaPostNumbers.gietIjzer);
    postenRow2.getCell('Q').value = this.NullToZero(rwaPostNumbers.betonKader);
    postenRow2.getCell('R').value = this.NullToZero(rwaPostNumbers.aluKader);
    postenRow2.getCell('S').value = this.NullToZero(rwaPostNumbers.funOmh);
    postenRow2.getCell('T').value = this.NullToZero(rwaPostNumbers.buisAchter);
    postenRow2.getCell('U').value = this.NullToZero(rwaPostNumbers.bochtAchter);
    postenRow2.getCell('V').value = this.NullToZero(rwaPostNumbers.reductieAchter);
    postenRow2.getCell('W').value = this.NullToZero(rwaPostNumbers.YAchter);
    postenRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow2.alignment = { vertical: 'middle', horizontal: 'center' };

    let soortRow2 = worksheet2.addRow(['Fundering/omhulling']);
    worksheet2.mergeCells('A5:C5');
    worksheet2.mergeCells('P5:R5');
    soortRow2.getCell('P').value = 'putkaders';
    soortRow2.font = { name: 'Arial', family: 4, size: 12 };
    soortRow2.alignment = { vertical: 'middle', horizontal: 'center' };

    soortRow2.getCell('D').value = mofMult.toString();
    soortRow2.getCell('E').value = '';
    soortRow2.getCell('F').value = '';
    soortRow2.getCell('G').value = '1';
    soortRow2.getCell('H').value = buisVertMult.toString();
    soortRow2.getCell('I').value = '1';
    soortRow2.getCell('J').value = buisVertMult.toString();
    soortRow2.getCell('K').value = '1';
    soortRow2.getCell('L').value = buisVertMult.toString();
    soortRow2.getCell('M').value = bochtMult.toString();
    soortRow2.getCell('N').value = '';
    soortRow2.getCell('O').value = yStukMult.toString();
    soortRow2.getCell('S').value = '';
    soortRow2.getCell('T').value = '';
    soortRow2.getCell('U').value = '';
    soortRow2.getCell('V').value = '';
    soortRow2.getCell('W').value = '';

    soortRow2.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    //Add Header Row
    let headers2 = [
      'Straat',
      'Huisnr.',
      'Volgnr.',
      'Mof',
      'T-buis',
      'T-stuk',
      'Buis hor 160',
      'Buis vert 160',
      'Buis hor 200',
      'Buis vert 200',
      'Andere buis hor',
      'Andere buis vert',
      'Bocht',
      'Reductie',
      'Y-stuk',
      'Gietijzer',
      'Beton',
      'Alu',
      'Fun/omh',
      'Buis',
      'Bocht',
      'Reductie',
      'Y-stuk',
    ];
    let headerRow2 = worksheet2.addRow(headers2);
    // Cell Style : Fill and Border
    headerRow2.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffedFF' },
        bgColor: { argb: 'FFFF6600' }
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    // Set font, size and style in title row.

    // Blank Row
    worksheet2.columns.forEach(function (column, i) {
      let maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell) {
        let columnLength = cell.value?.toString().length;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      if(i === 0){
        column.width = 26;
      } else if(i >= 6 && i <= 9){
        column.width = 14;
      } else if(i >= 10 && i <= 11) {
        column.width = 18;
      } else {
        column.width = 11;
      }

    });
    mofCount = 0;
    tBuisCount = 0;
    tStukCount = 0;
    yStukCount = 0;
    buisVoorHorCount160 = 0;
    buisVoorVertCount160 = 0;
    buisVoorHorCount200 = 0;
    buisVoorVertCount200 = 0;
    buisAndereHorCount = 0;
    buisAndereVertCount = 0;
    bochtVoorCount = 0;
    reductieVoorCount = 0;
    buisAchterCount = 0;
    bochtAchterCount = 0;
    reductieAchterCount = 0;
    YAchterCount = 0;
    gietIjzerCount = 0;
    betonKaderCount = 0;
    aluKaderCount = 0;

    funOmhCount = 0;
    for (let data of dataList.projectList) {
      let project = data;
      if (project.regenWaterAfvoer != null && this.checkHasRWA(project.regenWaterAfvoer)) {
        if (dataList.heeftPloegen == null || dataList.heeftPloegen === false) {
         if( project.regenWaterAfvoer.diameter == null || +project.regenWaterAfvoer.diameter === 160){
            buisVoorHorCount160 += this.NullToZero(project.regenWaterAfvoer.buisVoorHor);
            buisVoorVertCount160 += this.NullToZero(project.regenWaterAfvoer.buisVoorVert);
          } else if(+project.regenWaterAfvoer.diameter === 200){
            buisVoorHorCount200 += this.NullToZero(project.regenWaterAfvoer.buisVoorHor);
            buisVoorVertCount200 += this.NullToZero(project.regenWaterAfvoer.buisVoorVert);
          } else if( project.regenWaterAfvoer.diameter === 'andere' || project.regenWaterAfvoer.diameter === 'onbekend'){
            buisAndereHorCount += this.NullToZero(project.regenWaterAfvoer.buisVoorHor);
            buisAndereVertCount +=  this.NullToZero(project.regenWaterAfvoer.buisVoorVert);
         }

          bochtVoorCount += this.NullToZero(project.regenWaterAfvoer.bochtVoor);
          reductieVoorCount += this.NullToZero(project.regenWaterAfvoer.reductieVoor);
          buisAchterCount += this.NullToZero(project.regenWaterAfvoer.buisAchter);
          reductieAchterCount += this.NullToZero(project.regenWaterAfvoer.reductieAchter);
          bochtAchterCount += this.NullToZero(project.regenWaterAfvoer.bochtAchter);
          YAchterCount += this.NullToZero(project.regenWaterAfvoer.YAchter);

          if (project.regenWaterAfvoer.alukader != null && project.regenWaterAfvoer.alukader === true && !project.regenWaterAfvoer.gietijzer) {
            aluKaderCount++;
          }
          if (project.regenWaterAfvoer.betonkader != null && project.regenWaterAfvoer.betonkader === true && project.regenWaterAfvoer.gietijzer ) {
            betonKaderCount++;
          }
          if (project.regenWaterAfvoer.gietijzer != null && project.regenWaterAfvoer.gietijzer === true) {
            gietIjzerCount++;
          }
          let mof = 0;
          let tBuis = 0;
          let tStuk = 0;
          let yStuk = 0;
          let flexAansluiting = 0;
          switch (project.regenWaterAfvoer.tBuisStuk) {
            case 'aanboring':
              mofCount++;
              mof = 1;
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
              flexAansluiting++;
              break;
          }
          if(project.regenWaterAfvoer.soortPutje === 't-stuk'){
            tStuk += 1;
            tStukCount++;
          }
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
          let funOmh =
            this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + (this.NullToZero(project.regenWaterAfvoer.buisVoorVert) * buisVertMult) +
            (this.NullToZero(project.regenWaterAfvoer.bochtVoor) * bochtMult) +
            (yStuk * yStukMult) +
            (this.NullToZero(mof) * mofMult);
          funOmhCount += +funOmh;
          let funOmhString = +(funOmh.toFixed(2));
          let dataRow2;
          if( project.regenWaterAfvoer.diameter == null || +project.regenWaterAfvoer.diameter === 160){
            dataRow2 = worksheet2.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorHor)),
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorVert)),
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtVoor),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieVoor),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.regenWaterAfvoer.gietijzer),
              this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false),
              this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter),
            ]);
          } else if(+project.regenWaterAfvoer.diameter === 200){
            dataRow2 = worksheet2.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorHor)),
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorVert)),
              '',
              '',
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtVoor),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieVoor),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.regenWaterAfvoer.gietijzer),
              this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false),
              this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter),
            ]);
          } else if(project.regenWaterAfvoer.diameter === 'onbekend'){
            dataRow2 = worksheet2.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.buisVoorHor)) + ' (onb. mm)',
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.buisVoorVert)) + ' (onb. mm)',
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtVoor),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieVoor),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.regenWaterAfvoer.gietijzer),
              this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false),
              this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter),
            ]);
          } else if(project.regenWaterAfvoer.diameter === 'andere'){
            dataRow2 = worksheet2.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.buisVoorHor)) + (project.regenWaterAfvoer.diameterAndere !== '' ?  ' ('  +project.regenWaterAfvoer.diameterAndere +'mm)' : ''),
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.buisVoorVert)) + (project.regenWaterAfvoer.diameterAndere !== '' ?  ' ('  +project.regenWaterAfvoer.diameterAndere +'mm)' : ''),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtVoor),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieVoor),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.regenWaterAfvoer.gietijzer),
              this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false),
              this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter),
            ]);
          }

          dataRow2.getCell('S').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ffffe0'},
            bgColor: {argb: 'ffffe0'},
          };
        } else {
          if( project.regenWaterAfvoer.diameter == null || +project.regenWaterAfvoer.diameter === 160){
            buisVoorHorCount160 += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
            buisVoorVertCount160 += this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
          } else if(+project.regenWaterAfvoer.diameter === 200){
            buisVoorHorCount200 += this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
            buisVoorVertCount200 += this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
          }  else if( project.regenWaterAfvoer.diameter === 'andere' || project.regenWaterAfvoer.diameter === 'onbekend'){
            buisAndereHorCount +=  this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2);
            buisAndereVertCount +=  this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2);
          }
          bochtVoorCount += this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2);
          reductieVoorCount += this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2);
          buisAchterCount += this.NullToZero(project.regenWaterAfvoer.buisAchter);
          reductieAchterCount += this.NullToZero(project.regenWaterAfvoer.reductieAchter);
          bochtAchterCount += this.NullToZero(project.regenWaterAfvoer.bochtAchter);
          YAchterCount += this.NullToZero(project.regenWaterAfvoer.YAchter);

          if (project.regenWaterAfvoer.alukader != null && project.regenWaterAfvoer.alukader === true && !project.regenWaterAfvoer.gietijzer) {
            aluKaderCount++;
          }
          if (project.regenWaterAfvoer.betonkader != null && project.regenWaterAfvoer.betonkader === true && project.regenWaterAfvoer.gietijzer ) {
            betonKaderCount++;
          }
          if (project.regenWaterAfvoer.gietijzer != null && project.regenWaterAfvoer.gietijzer === true) {
            gietIjzerCount++;
          }
          let mof = 0;
          let tBuis = 0;
          let tStuk = 0;
          let yStuk = 0;
          let flexAansluiting = 0;
          switch (project.regenWaterAfvoer.tBuisStuk) {
            case 'aanboring':
              mofCount++;
              mof = 1;
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
              flexAansluiting++;
              break;
          }
          if(project.regenWaterAfvoer.soortPutje === 't-stuk'){
            tStuk += 1;
            tStukCount++;
          }
          let funOmh =
            this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2) +
            (this.NullToZero(project.regenWaterAfvoer.buisVoorVert) * buisVertMult) + (this.NullToZero(project.regenWaterAfvoer.buisVoorVert2) * buisVertMult) +
            ((this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2))) * bochtMult +
            (yStuk * yStukMult) +
            (this.NullToZero(mof) * mofMult);

          funOmhCount += +funOmh;

          let funOmhString = +(funOmh.toFixed(2));

          let dataRow2;
          if( project.regenWaterAfvoer.diameter == null || +project.regenWaterAfvoer.diameter === 160){
            dataRow2 = worksheet2.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2)),
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2)),
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.regenWaterAfvoer.gietijzer),
              this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false),
              this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter),
            ]);
          } else if(+project.regenWaterAfvoer.diameter === 200){
            dataRow2 = worksheet2.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2)),
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2)),
              '',
              '',
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.regenWaterAfvoer.gietijzer),
              this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false),
              this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter),
            ]);
          } else if(project.regenWaterAfvoer.diameter === 'onbekend'){
            dataRow2 = worksheet2.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2)) + ' (onb. mm)',
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2)) + ' (onb. mm)',
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.regenWaterAfvoer.gietijzer),
              this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false),
              this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter),
            ]);
          } else if(project.regenWaterAfvoer.diameter === 'andere'){
            dataRow2 = worksheet2.addRow([
              project?.street,
              project?.huisNr,
              project?.index,
              this.ConvertNumberToEmptyString(mof),
              this.ConvertNumberToEmptyString(tBuis),
              this.ConvertNumberToEmptyString(tStuk),
              '',
              '',
              '',
              '',
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorHor) + this.NullToZero(project.regenWaterAfvoer.buisVoorHor2)) + (project.regenWaterAfvoer.diameterAndere !== '' ?  ' ('  +project.regenWaterAfvoer.diameterAndere +'mm)' : ''),
              this.ConvertNumberToEmptyString( this.NullToZero(project.regenWaterAfvoer.buisVoorVert) + this.NullToZero(project.regenWaterAfvoer.buisVoorVert2)) + (project.regenWaterAfvoer.diameterAndere !== '' ?  ' ('  +project.regenWaterAfvoer.diameterAndere +'mm)' : ''),
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.bochtVoor) + this.NullToZero(project.regenWaterAfvoer.bochtVoor2)),
              this.ConvertNumberToEmptyString(this.NullToZero(project.regenWaterAfvoer.reductieVoor) + this.NullToZero(project.regenWaterAfvoer.reductieVoor2)),
              this.ConvertNumberToEmptyString(yStuk),
              this.BoolToString(project.regenWaterAfvoer.gietijzer),
              this.BoolToString(project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.betonkader : false),
              this.BoolToString(!project.regenWaterAfvoer.gietijzer ? project.regenWaterAfvoer.alukader : false),
              funOmhString,
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.buisAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.bochtAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.reductieAchter),
              this.ConvertNumberToEmptyString(project.regenWaterAfvoer.YAchter),
            ]);
          }
          dataRow2.getCell('S').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'ffffe0'},
            bgColor: {argb: 'ffffe0'},
          };
        }
      }
    }
    worksheet2.addRow('');
    let totalData2 = [
      'Totalen',
      '',
      '',
      mofCount + ' st',
      tBuisCount + ' st',
      tStukCount + ' st',
      buisVoorHorCount160.toFixed(2) + ' m',
      buisVoorVertCount160.toFixed(2) + ' m',
      buisVoorHorCount200.toFixed(2) + ' m',
      buisVoorVertCount200.toFixed(2) + ' m',
      buisAndereHorCount.toFixed(2) + ' m',
      buisAndereVertCount.toFixed(2) + ' m',
      bochtVoorCount + ' st',
      reductieVoorCount + ' st',
      yStukCount + ' st',
      gietIjzerCount,
      betonKaderCount,
      aluKaderCount,
      funOmhCount.toFixed(2),
      buisAchterCount.toFixed(2) + ' m',
      bochtAchterCount + ' st',
      reductieAchterCount + ' st',
      YAchterCount + ' st',
    ];
    let totalRow2 = worksheet2.addRow(totalData2);

    totalRow2.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '44c7dbFF' },
        bgColor: { argb: '44db58FF' },
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    //Add Header Row
    let headerRow5 = worksheet2.addRow(headers2);
    // Cell Style : Fill and Border
    headerRow5.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffedFF' },
        bgColor: { argb: 'FFFF6600' }
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    let postenRow5 = worksheet2.addRow(['Postnummers']);
    postenRow5.font = { name: 'Arial', family: 4, size: 11 };
    postenRow5.getCell('D').value = this.NullToZero(rwaPostNumbers.mof);
    postenRow5.getCell('E').value = this.NullToZero(rwaPostNumbers.tBuis);
    postenRow5.getCell('F').value = this.NullToZero(rwaPostNumbers.tStuk);
    postenRow5.getCell('G').value = this.NullToZero(rwaPostNumbers.buisVoorHor);
    postenRow5.getCell('H').value = this.NullToZero(rwaPostNumbers.buisVoorVert);
    postenRow5.getCell('I').value = this.NullToZero(rwaPostNumbers.buisVoorHor);
    postenRow5.getCell('J').value = this.NullToZero(rwaPostNumbers.buisVoorVert);
    postenRow5.getCell('K').value = this.NullToZero(rwaPostNumbers.buisVoorHor);
    postenRow5.getCell('L').value = this.NullToZero(rwaPostNumbers.buisVoorVert);
    postenRow5.getCell('M').value = this.NullToZero(rwaPostNumbers.bochtVoor);
    postenRow5.getCell('N').value = this.NullToZero(rwaPostNumbers.reductieVoor);
    postenRow5.getCell('O').value = this.NullToZero(rwaPostNumbers.yStuk);
    postenRow5.getCell('P').value =  this.NullToZero(rwaPostNumbers.gietIjzer);
    postenRow5.getCell('Q').value = this.NullToZero(rwaPostNumbers.betonKader);
    postenRow5.getCell('R').value = this.NullToZero(rwaPostNumbers.aluKader);
    postenRow5.getCell('S').value = this.NullToZero(rwaPostNumbers.funOmh);
    postenRow5.getCell('T').value = this.NullToZero(rwaPostNumbers.buisAchter);
    postenRow5.getCell('U').value = this.NullToZero(rwaPostNumbers.bochtAchter);
    postenRow5.getCell('V').value = this.NullToZero(rwaPostNumbers.reductieAchter);
    postenRow5.getCell('W').value = this.NullToZero(rwaPostNumbers.YAchter);
    postenRow5.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow5.alignment = { vertical: 'middle', horizontal: 'center' };

    //3rd page kolken
    let worksheet3 = workbook.addWorksheet('Blad3 kolken', {
      views: [{state: "frozen", ySplit: 4  }],
    });
    // Add new row
    let titleRow3 = worksheet3.addRow(['Kolken']);
    titleRow3.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    worksheet3.mergeCells('A1:H1');
    titleRow3.height = 23;
    if(dataList.slokkerProjectList.length !== 0){
      let locationRow3 = worksheet3.addRow([
        dataList.rbProjectNr + ' - ' + dataList.rbProjectNaam +
        ' - ' + dataList.rbGemeente
      ]);
      locationRow3.font = {
        name: 'Arial',
        family: 4,
        size: 13,
        bold: true,
      };
      locationRow3.height = 20;
      worksheet3.mergeCells('A2:H2');
    }

    let postenRow3 = worksheet3.addRow(['Postnummers']);
    worksheet3.mergeCells('A3:B3');
    postenRow3.font = { name: 'Arial', family: 4, size: 12 };
    postenRow3.getCell('C').value = this.NullToZero(slokkerPostNumbers.mof);
    postenRow3.getCell('D').value = this.NullToZero(slokkerPostNumbers.tBuis);
    postenRow3.getCell('E').value = this.NullToZero(slokkerPostNumbers.ytStuk);
    postenRow3.getCell('F').value = this.NullToZero(slokkerPostNumbers.buis);
    postenRow3.getCell('G').value = this.NullToZero(slokkerPostNumbers.buis);
    postenRow3.getCell('H').value = this.NullToZero(slokkerPostNumbers.bocht);
    postenRow3.getCell('I').value = this.NullToZero(slokkerPostNumbers.reductie);
    postenRow3.getCell('J').value = this.NullToZero(slokkerPostNumbers.funOmh);
    postenRow3.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow3.alignment = { vertical: 'middle', horizontal: 'center' };

    let slokkerHeaders = ['Straat', 'Kolk nr.', 'Mof', 'T-Buis', 'Y/T-Stuk', 'Buis 160', 'Buis 200', 'Bocht', 'Reductie', 'Fun/omh'];
    //Add Header Row
    let headerRow3 = worksheet3.addRow(slokkerHeaders);
    headerRow3.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffedFF' },
        bgColor: { argb: 'FFFF6600' }
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    mofCount = 0;
    tBuisCount = 0;
    funOmhCount = 0;
    let ytStukCount = 0;
    let bochtCount = 0;
    let buisCount160 = 0;
    let buisCount200 = 0;
    let reductieCount = 0;
    for (let data of dataList.slokkerProjectList) {
      let slokker = data;

      let mof = 0;
      let tBuis = 0;
      let ytStuk = 0;
      switch (slokker.slokker.tBuisStuk) {
        case 'aanboring':
          mofCount++;
          mof = 1;
          break;
        case 'T-Buis':
          tBuisCount++;
          tBuis = 1;
          break;
        case 'T-Stuk':
          ytStuk += 1;
          ytStukCount++;
          break;
        case 'Y-Stuk':
          ytStuk += 1;
          ytStukCount++;
          break;
      }
      bochtCount += this.NullToZero(slokker.slokker.bocht) + this.NullToZero(slokker.slokker.bocht2);
      if( slokker.slokker.diameter != null && +slokker.slokker.diameter === 200){
        buisCount200 += this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2);
      } else {
        buisCount160 += this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2);
      }

      reductieCount += this.NullToZero(slokker.slokker.reductie);
      ytStukCount += this.NullToZero(slokker.slokker.Y);
      ytStuk += this.NullToZero(slokker.slokker.Y);

      let funOmh =
        (this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2)) +
        (((this.NullToZero(slokker.slokker.bocht) + this.NullToZero(slokker.slokker.bocht2)) * bochtMult) +
          (ytStuk * yStukMult) +
          (this.NullToZero(mof) * mofMult));
      let funOmhString = +(funOmh.toFixed(2));

      funOmhCount += +funOmh;
      let dataRow3;
      if( slokker.slokker.diameter != null && +slokker.slokker.diameter === 200){
        dataRow3 = worksheet3.addRow([
          slokker.street,
          slokker.index,
          this.ConvertNumberToEmptyString(mof),
          this.ConvertNumberToEmptyString(tBuis),
          this.ConvertNumberToEmptyString(ytStuk),
          '',
          this.ConvertNumberToEmptyString(this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2)),
          this.ConvertNumberToEmptyString(this.NullToZero(slokker.slokker.bocht) + this.NullToZero(slokker.slokker.bocht2)),
          this.ConvertNumberToEmptyString(slokker.slokker.reductie),
          this.ConvertNumberToEmptyString(funOmhString)
        ]);
      } else {
        dataRow3 = worksheet3.addRow([
          slokker.street,
          slokker.index,
          this.ConvertNumberToEmptyString(mof),
          this.ConvertNumberToEmptyString(tBuis),
          this.ConvertNumberToEmptyString(ytStuk),
          this.ConvertNumberToEmptyString(this.NullToZero(slokker.slokker.buis) + this.NullToZero(slokker.slokker.buis2)),
          '',
          this.ConvertNumberToEmptyString(this.NullToZero(slokker.slokker.bocht) + this.NullToZero(slokker.slokker.bocht2)),
          this.ConvertNumberToEmptyString(slokker.slokker.reductie),
          this.ConvertNumberToEmptyString(funOmhString)
        ]);
      }

      dataRow3.getCell('J').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'ffffe0'},
        bgColor: {argb: 'ffffe0'},
      };
    }
    worksheet3.addRow('');
    //total row

    // Blank Row
    worksheet3.columns.forEach(function (column, i) {
      let maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell) {
        let columnLength = cell.value?.toString().length;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      if(i === 0){
        column.width = 30;
      } else {
        column.width = 13;
      }
    });
    let totalData3 = [
      'Totalen',
      '',
      mofCount + ' st',
      tBuisCount + ' st',
      ytStukCount + ' st',
      buisCount160.toFixed(2) + ' m',
      buisCount200.toFixed(2) + ' m',
      bochtCount + ' st',
      reductieCount + ' st',
      funOmhCount.toFixed(2)
    ];
    let totalRow3 = worksheet3.addRow(totalData3);

    totalRow3.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '44c7dbFF' },
        bgColor: { argb: '44db58FF' },
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    //Add Header Row
    let headerRow6 = worksheet3.addRow(slokkerHeaders);
    headerRow6.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffedFF' },
        bgColor: { argb: 'FFFF6600' }
      };
      cell.font = { name: 'Arial', family: 4, size: 11, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    let postenRow6 = worksheet3.addRow(['Postnummers']);

    postenRow6.font = { name: 'Arial', family: 4, size: 12 };
    postenRow6.getCell('C').value = this.NullToZero(slokkerPostNumbers.mof);
    postenRow6.getCell('D').value = this.NullToZero(slokkerPostNumbers.tBuis);
    postenRow6.getCell('E').value = this.NullToZero(slokkerPostNumbers.ytStuk);
    postenRow6.getCell('F').value = this.NullToZero(slokkerPostNumbers.buis);
    postenRow6.getCell('G').value = this.NullToZero(slokkerPostNumbers.buis);
    postenRow6.getCell('H').value = this.NullToZero(slokkerPostNumbers.bocht);
    postenRow6.getCell('I').value = this.NullToZero(slokkerPostNumbers.reductie);
    postenRow6.getCell('J').value = this.NullToZero(slokkerPostNumbers.funOmh);
    postenRow6.eachCell({ includeEmpty: true }, (cell, number) => {
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      };
    });
    postenRow6.alignment = { vertical: 'middle', horizontal: 'center' };

    if(logoURL != null){
      this.getBase64ImageFromUrl(logoURL)
        .then(result => {
          let base64 = result as string;
          let logo = workbook.addImage({
            base64: base64,
            extension: 'png',
          });
          worksheet.addImage(logo, 'K1:M2');
          worksheet2.addImage(logo, 'K1:M2');
          worksheet3.addImage(logo, 'K1:M3');
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            fs.saveAs(blob, companyName + '-' + dataList.rbProjectNr + "-" + dataList.rbProjectNaam + "-" + dataList.rbGemeente + " MEETSTAAT.xlsx");          });
        })
        .catch(err => console.error(err));
    } else {
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        fs.saveAs(blob, companyName + '-' + dataList.rbProjectNr + "-" + dataList.rbProjectNaam + "-" + dataList.rbGemeente + " MEETSTAAT.xlsx");      });
    }


  }

  NullToString(check: string) {
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
