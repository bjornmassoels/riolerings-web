import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import {SlokkerProjects} from "../models/slokker-projects";
import {Group} from "../models/groups";
import {User} from "../models/user";
import { Company } from 'models/company';
import {Meerwerk} from "../models/meerwerk";

@Injectable({
  providedIn: 'root',
})
export class FormService {
  filterStartDatumStartString: string;
  filterStartDatumEndString: string;
  get currentSlokkerProjects(): SlokkerProjects[] {
    return this._currentSlokkerProjects;
  }

  set currentSlokkerProjects(value: SlokkerProjects[]) {
    this._currentSlokkerProjects = value;
  }
  selectedUser: User;
  previousGroupIndex: number;
  private _currentSlokkerProjects: SlokkerProjects[];
  get currentWachtAansluitingen(): Project[] {
    return this._currentWachtAansluitingen;
  }

  set currentWachtAansluitingen(value: Project[]) {
    this._currentWachtAansluitingen = value;
  }
  get currentSlokkerProject(): SlokkerProjects {
    return this._currentSlokkerProject;
  }

  set currentSlokkerProject(value: SlokkerProjects) {
    this._currentSlokkerProject = value;
  }
  get isUpdated(): boolean {
    return this._isUpdated;
  }

  set isUpdated(value: boolean) {
    this._isUpdated = value;
  }
  get workerName(): String {
    return this._workerName;
  }

  set workerName(value: String) {
    this._workerName = value;
  }
  get workerHours(): number {
    return this._workerHours;
  }

  set workerHours(value: number) {
    this._workerHours = value;
  }
  get allUsers(): User[] {
    return this._allUsers;
  }

  set allUsers(value: User[]) {
    this._allUsers = value;
  }
  get currentProjects(): Project[] {
    return this._currentProjects;
  }

  set currentProjects(value: Project[]) {
    this._currentProjects = value;
  }
  get deleteUser(): User {
    return this._deleteUser;
  }

  set deleteUser(value: User) {
    this._deleteUser = value;
  }
  get deleteSlokkerProject(): SlokkerProjects {
    return this._deleteSlokkerProject;
  }

  set deleteSlokkerProject(value: SlokkerProjects) {
    this._deleteSlokkerProject = value;
  }
  public deleteMeerwerk: Meerwerk;
  public _chosenPhoto : string;
  public _preventNavigation: boolean = false;

  public _isSlokker: boolean;
  public _chosenProject: Project;
  public _chosenSlokkerProject: SlokkerProjects;

  public _allProjects: Project[];

  public _allGroups: Group[];
  public _chosenGroup: Group;
  public _cancel: boolean = false;
  public _company: Company;
  isVordering: boolean;
  isDelete: boolean;
  isNewExcel: boolean;
  isComingFromCreateGroup: boolean;
  public currentMeerwerk: Meerwerk;
  private _currentProject: Project;
  private _currentGroup: Group;
  private _currentProjects: Project[];
  private _currentSlokkerProject: SlokkerProjects;
  private _allUsers: User[];
  private _previousPage: string[] = [];
  private _lastProjects: Project[] = [];
  private _PreloadProject: Project;
  private _deleteUser: User;
  private _workerName: String;
  private _workerHours: number;
  private _preloadSlokkerProject: SlokkerProjects;
  private _deleteSlokkerProject: SlokkerProjects;
  private _isUpdated: boolean;
  private _currentWachtAansluitingen: Project[];
  public isMeetstaatDiameter: boolean;
  previousIndex: number;
  previousFilter: string;
  previousStreet: string
  get currentGroup(): Group {
    return this._currentGroup;
  }

  set currentGroup(value: Group) {
    this._currentGroup = value;
  }
  get preloadSlokkerProject(): SlokkerProjects {
    return this._preloadSlokkerProject;
  }


  set preloadSlokkerProject(value: SlokkerProjects) {
    this._preloadSlokkerProject = value;
  }

  get PreloadProject(): Project {
    return this._PreloadProject;
  }

  set PreloadProject(value: Project) {
    this._PreloadProject = value;
  }
  get lastProjects(): Project[] {
    return this._lastProjects;
  }

  set lastProjects(value: Project[]) {
    this._lastProjects = value;
  }
  get previousPage(): string[] {
    return this._previousPage;
  }

  set previousPage(value: string[]) {
    this._previousPage = value;
  }
  get currentProject(): Project {
    return this._currentProject;
  }

  set currentProject(value: Project) {
    this._currentProject = value;
  }

  constructor() {}
}
