import { Project } from './project';
import { Company } from './company';
import { Group } from "./groups";

export class User {
  public _id: string;
  public id: string;
  public email: string;
  public name: string;
  public projects: Project[];
  public company_id: Company;

  public voornaam: string;
  public achternaam: string;
  public password: string;
  public password2: string;
  public gebruikersnaam: string;
  public bedrijfsnaam: string;
  public straat: string;
  public huisnummer: number;
  public gemeente: string;
  public aantal_werknemers: number;
  public isAdmin: boolean;
  public isAttached: boolean;
  public groups: Group[];
  public  role: string;
  versionNumber: string;

  public functieNaam: string;
  public code: string;
  public taal: string;
  constructor(
  ) {
  }
}
