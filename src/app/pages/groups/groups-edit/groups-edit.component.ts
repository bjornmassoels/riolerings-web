import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormArray } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../../../models/groups';
import { User } from 'models/user';
import {FormService} from "../../../../services/form.service";
import {
  GroupsViewDeleteDialogComponent
} from '../groups-view/groups-view-delete-dialog/groups-view-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HasChangedPopupComponent } from '../../has-changed-popup/has-changed-popup.component';

@Component({
  selector: 'ngx-categories-add',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['../../styles/add-form.scss', './groups-edit.component.scss'],
})
export class GroupsEditComponent implements OnInit {
  addForm: UntypedFormGroup;
  public isLoaded: boolean = false;
  _id: string;
  group: Group;

  gemeentes: string[] = ['Aalst', 'Aalter', 'Aarschot', 'Aartselaar', 'Affligem', 'Alken', 'Alveringem', 'Antwerpen', 'Anzegem', 'Ardooie', 'Arendonk', 'As', 'Asse', 'Assenede', 'Avelgem', 'Baarle-Hertog', 'Balen', 'Beernem', 'Beerse', 'Beersel', 'Begijnendijk', 'Bekkevoort', 'Beringen', 'Berlaar', 'Berlare', 'Bertem', 'Bever', 'Beveren', 'Bierbeek', 'Bilzen', 'Blankenberge', 'Bocholt', 'Boechout', 'Bonheiden', 'Boom', 'Boortmeerbeek', 'Borgloon', 'Bornem', 'Borsbeek', 'Boutersem', 'Brakel', 'Brasschaat', 'Brecht', 'Bredene', 'Bree', 'Brugge', 'Buggenhout', 'Damme', 'De Haan', 'De Panne', 'De Pinte', 'Deerlijk', 'Deinze', 'Denderleeuw', 'Dendermonde', 'Dentergem', 'Dessel', 'Destelbergen', 'Diepenbeek', 'Diest', 'Diksmuide', 'Dilbeek', 'Dilsen-Stokkem', 'Drogenbos', 'Duffel', 'Edegem', 'Eeklo', 'Erpe-Mere', 'Essen', 'Evergem', 'Galmaarden', 'Gavere', 'Geel', 'Geetbets', 'Genk', 'Gent', 'Geraardsbergen', 'Gingelom', 'Gistel', 'Glabbeek', 'Gooik', 'Grimbergen', 'Grobbendonk', 'Haacht', 'Haaltert', 'Halen', 'Halle', 'Ham', 'Hamme', 'Hamont-Achel', 'Harelbeke', 'Hasselt', 'Hechtel-Eksel', 'Heers', 'Heist-op-den-Berg', 'Hemiksem', 'Herent', 'Herentals', 'Herenthout', 'Herk-de-Stad', 'Herne', 'Herselt', 'Herstappe', 'Herzele', 'Heusden-Zolder', 'Heuvelland', 'Hoegaarden', 'Hoeilaart', 'Hoeselt', 'Holsbeek', 'Hooglede', 'Hoogstraten', 'Horebeke', 'Houthalen-Helchteren', 'Houthulst', 'Hove', 'Huldenberg', 'Hulshout', 'Ichtegem', 'Ieper', 'Ingelmunster', 'Izegem', 'Jabbeke', 'Kalmthout', 'Kampenhout', 'Kapellen', 'Kapelle-op-den-Bos', 'Kaprijke', 'Kasterlee', 'Keerbergen', 'Kinrooi', 'Kluisbergen', 'Knokke-Heist', 'Koekelare', 'Koksijde', 'Kontich', 'Kortemark', 'Kortenaken', 'Kortenberg', 'Kortessem', 'Kortrijk', 'Kraainem', 'Kruibeke', 'Kruisem', 'Kuurne', 'Laakdal', 'Laarne', 'Lanaken', 'Landen','Langemark-Poelkapelle', 'Lebbeke', 'Lede', 'Ledegem', 'Lendelede', 'Lennik', 'Leopoldsburg','Leuven', 'Lichtervelde', 'Liedekerke', 'Lier', 'Lierde', 'Lievegem', 'Lille', 'Linkebeek', 'Lint', 'Linter', 'Lochristi', 'Lokeren', 'Lommel', 'Londerzeel', 'Lo-Reninge', 'Lubbeek', 'Lummen', 'Maarkedal', 'Maaseik', 'Maasmechelen', 'Machelen', 'Maldegem', 'Malle', 'Mechelen', 'Meerhout', 'Meise', 'Melle', 'Menen', 'Merchtem', 'Merelbeke', 'Merksplas', 'Mesen', 'Meulebeke', 'Middelkerke', 'Moerbeke', 'Mol', 'Moorslede', 'Mortsel', 'Nazareth', 'Niel', 'Nieuwerkerken', 'Nieuwpoort', 'Nijlen', 'Ninove', 'Olen', 'Oostende', 'Oosterzele', 'Oostkamp', 'Oostrozebeke', 'Opwijk', 'Oudenaarde', 'Oudenburg', 'Oud-Heverlee', 'Oudsbergen', 'Oud-Turnhout', 'Overijse', 'Peer', 'Pelt', 'Pepingen', 'Pittem', 'Poperinge', 'Putte', 'Puurs-Sint-Amands', 'Ranst', 'Ravels', 'Retie', 'Riemst', 'Rijkevorsel', 'Roeselare', 'Ronse', 'Roosdaal', 'Rotselaar', 'Ruiselede', 'Rumst', 'Schelle', 'Scherpenheuvel-Zichem', 'Schilde', 'Schoten', 'Sint-Genesius-Rode', 'Sint-Gillis-Waas', 'Sint-Katelijne-Waver','Sint-Laureins', 'Sint-Lievens-Houtem', 'Sint-Martens-Latem', 'Sint-Niklaas', 'Sint-Pieters-Leeuw', 'Sint-Truiden', 'Spiere-Helkijn','Stabroek', 'Staden', 'Steenokkerzeel', 'Stekene', 'Temse', 'Ternat', 'Tervuren', 'Tessenderlo', 'Tielt', 'Tielt-Winge', 'Tienen', 'Tongeren', 'Torhout', 'Tremelo', 'Turnhout', 'Veurne', 'Vilvoorde', 'Vleteren', 'Voeren', 'Vorselaar', 'Vosselaar', 'Waasmunster', 'Wachtebeke', 'Waregem', 'Wellen', 'Wemmel', 'Wervik', 'Westerlo','Wetteren', 'Wevelgem', 'Wezembeek-Oppem', 'Wichelen', 'Wielsbeke', 'Wijnegem', 'Willebroek', 'Wingene', 'Wommelgem', 'Wortegem-Petegem','Wuustwezel', 'Zandhoven', 'Zaventem', 'Zedelgem', 'Zele', 'Zelzate', 'Zemst', 'Zoersel', 'Zonhoven', 'Zonnebeke', 'Zottegem', 'Zoutleeuw' ,'Zuienkerke', 'Zulte', 'Zutendaal', 'Zwalm', 'Zwevegem', 'Zwijndrecht'];
  gemeenteCodes: string[] = [
    'Aalst',
    'Aalter',
    'ARS',
    'AA',
    'Affligem',
    'AL',
    'Alveringem',
    'Antwerpen',
    'ANZ',
    'ARD',
    'Arendonk',
    'AS',
    'Asse',
    'ASN',
    'Avelgem',
    'Baarle-Hertog',
    'BA',
    'Beernem',
    'BS',
    'Beersel',
    'BD',
    'BK',
    'BE',
    'BE',
    'BER',
    'BL',
    'BB',
    'BEV',
    'BIE',
    'BIL',
    'Blankenberge',
    'BT',
    'Boechout',
    'BH',
    'BO',
    'BM',
    'BO',
    'Bornem',
    'BB',
    'BV',
    'Brakel',
    'BR',
    'BT',
    'BRE',
    'BR',
    'Brugge',
    'Buggenhout',
    'Damme',
    'De Haan',
    'De Panne',
    'De Pinte',
    'Deerlijk',
    'Deinze',
    'DEN',
    'Dendermonde',
    'Dentergem',
    'DS',
    'Destelbergen',
    'DP',
    'Diest',
    'Diksmuide',
    'Dilbeek',
    'DI',
    'Drogenbos',
    'DF',
    'Edegem',
    'EEK',
    'Erpe-Mere',
    'ES',
    'EVE',
    'GA',
    'Gavere',
    'Geel',
    'GE',
    'GK',
    'Gent',
    'GER',
    'GI',
    'GS',
    'GL',
    'GO',
    'GRI',
    'GB',
    'Haacht',
    'HAA',
    'HL',
    'Halle',
    'HM',
    'Hamme',
    'HAM',
    'HK',
    'HT',
    'HE',
    'HS',
    'HB',
    'HM',
    'Herent',
    'Herentals',
    'HH',
    'HD',
    'HR',
    'HS',
    'HP',
    'HRZ',
    'HZO',
    'HEU',
    'HW',
    'Hoeilaart',
    'HO',
    'Holsbeek',
    'HG',
    'HO',
    'Horebeke',
    'HH',
    'HU',
    'Hove',
    'UL',
    'HU',
    'IG',
    'Ieper',
    'IM',
    'IZ',
    'Jabbeke',
    'KH',
    'Kampenhout',
    'KP',
    'KAP',
    'KPR',
    'Kasterlee',
    'KEE',
    'KI',
    'Kluisbergen',
    'Knokke-Heist',
    'K',
    'Koksijde',
    'Kontich',
    'KM',
    'KT',
    'Kortenberg',
    'KO',
    'KOR',
    'KRN',
    'KRU',
    'Kruisem',
    'KUU',
    'LA',
    'LRN',
    'LA',
    'LN',
    'LP',
    'Lebbeke',
    'Lede',
    'Ledegem',
    'LL',
    'LEN',
    'LE',
    'LEU',
    'LV',
    'Liedekerke',
    'Lier',
    'Lierde',
    'LIE',
    'IL',
    'Linkebeek',
    'LT',
    'LI',
    'LOC',
    'Lokeren',
    'Lommel',
    'Londerzeel',
    'LOR',
    'LB',
    'LU',
    'Maarkedal',
    'MA',
    'MM',
    'Machelen',
    'MAL',
    'MA',
    'Mechelen',
    'MH',
    'Meise',
    'Melle',
    'MEN',
    'MT',
    'Merelbeke',
    'Merksplas',
    'Mesen',
    'MEU',
    'Middelkerke',
    'Moerbeke',
    'MO',
    'MO',
    'Mortsel',
    'Nazareth',
    'NL',
    'NI',
    'Nieuwpoort',
    'Nijlen',
    'NIV',
    'Olen',
    'Oostende',
    'Oosterzele',
    'Oostkamp',
    'OOS',
    'OPW',
    'Oudenaarde',
    'OU',
    'OH',
    'OB',
    'Oud-Turnhout',
    'Overijse',
    'PE',
    'PT',
    'PP',
    'Pittem',
    'Poperinge',
    'PT',
    'Puurs-Sint-Amands',
    'RA',
    'RV',
    'RI',
    'RI',
    'RK',
    'ROE',
    'Ronse',
    'ROO',
    'RO',
    'Ruiselede',
    'RU',
    'SL',
    'Scherpenheuvel-Zichem',
    'SI',
    'SO',
    'Sint-Genesius-Rode',
    'Sint-Gillis-Waas',
    'SW',
    'SLA',
    'Sint-Lievens-Houtem',
    'Sint-Martens-Latem',
    'SNI',
    'PL',
    'ST',
    'SPI',
    'Stabroek',
    'SD',
    'SO',
    'STE',
    'TEM',
    'Ternat',
    'Tervuren',
    'TES',
    'TLT',
    'TW',
    'TI',
    'TO',
    'TH',
    'Tremelo',
    'Turnhout',
    'Veurne',
    'Vilvoorde',
    'VLE',
    'VR',
    'VR',
    'VS',
    'WMS',
    'WCB',
    'WAR',
    'WEL',
    'Wemmel',
    'WER',
    'WO',
    'Wetteren',
    'Wevelgem',
    'WZO',
    'Wichelen',
    'WIE',
    'WY',
    'WL',
    'WIN',
    'Wommelgem',
    'Wortegem-Petegem',
    'WU',
    'ZH',
    'Zaventem',
    'ZED',
    'ZEL',
    'Zelzate',
    'ZEM',
    'ZS',
    'ZO',
    'ZON',
    'Zottegem',
    'ZL',
    'Zuienkerke',
    'Zulte',
    'ZU',
    'Zwalm',
    'ZWE',
    'Zwijndrecht',
  ];

  public allUsers: User[];
  public selectedUserIds: string[] = [];
  @Output() outputEvent: EventEmitter<string> = new EventEmitter();

  isRbNaamInvalid: boolean = false;
  isRbProjectNrInvalid: boolean = false;
  isRbProjectNaamInvalid: boolean = false;
  isRbGemeenteInvalid: boolean = false;
  isAannemerNaamInvalid: boolean = false;
  isAannemerProjectNrInvalid: boolean = false;
  isAannemerWerfleiderInvalid: boolean = false;
  isGemeenteCodeInvalid: boolean = false;

  secondMogOn: boolean = false;
  thirdMogOn: boolean = false;
  private selectedGemeenteIndex: number;
  filteredGemeentes$: Observable<string[]>;
  hasChangedValue: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router,
    private formService: FormService,
    private dialog: MatDialog
  ) {
    this.filteredGemeentes$ = of(this.gemeentes);

    route.params.subscribe((val) => {
      this._id = this.route.snapshot.paramMap.get('id');
      this.hasChangedValue = false;
      this.apiService.getUsers().subscribe((x) => {
        this.allUsers = x as User[];
        this.allUsers = this.allUsers
          .filter(user => user.name !== 'bjorn programmeur selux')
          .map(user => {
            if (!user.name) {
              user.name = user.email + this.soortTranslateShort(user.role);
            } else {
              user.name += this.soortTranslateShort(user.role);
            }
            return user;
          })
        this.sortUsers();
      });
        this.apiService.getGroupById(this._id).subscribe((y) => {
          this.group = y as unknown as Group;
          if(this.group._id == null){
            this.group._id = this.group.id;
          }
          if(this.group.users != null && this.group.users.length !== 0){
            for(let user of this.group.users){
              this.selectedUserIds.push(user._id);
            }
          }
          this.buildForm();
        });
    });
  }
  soortTranslateShort(role: string){
    if(role === '59cf78e883680012b0438503'){
      return ' (mobile)';
    } else {
      return '';
    }
  }
  sortUsers(){
    this.allUsers = this.allUsers.sort((a, b) => {
      if(a.role.localeCompare(b.role) !== 0) return b.role.localeCompare(a.role);
      if(a.name > b.name) return 1;
    });
  }
  public async buildForm() {
    this.secondMogOn = this.group.secondMogOn;
    this.thirdMogOn = this.group.thirdMogOn;
    if(this.group.possibleKolkStreets == null) this.group.possibleKolkStreets = [];
    let possibleKolkStreets = this.formBuilder.array(this.group.possibleKolkStreets.map(x => this.formBuilder.control(x)));
    this.addForm = this.formBuilder.group({
      //Rioolbeheerder
      rbNaam: this.group.rbNaam,
      rbProjectNr: this.group.rbProjectNr,
      rbProjectNaam: this.group.rbProjectNaam,
      rbGemeente: this.group.rbGemeente,
      gemeenteCode: this.group.gemeenteCode,
      //Bouwheer
      bhNaam: this.group.bhNaam,
      bhProjectNr: this.group.bhProjectNr,
      bhProjectNaam: this.group.bhProjectNaam,
      //Medeopdrachtgever
      mogNaam: this.group.mogNaam,
      mogProjectNr: this.group.mogProjectNr,
      mogProjectNaam: this.group.mogProjectNaam,

      mogNaam1: this.group.mogNaam1,
      mogProjectNr1: this.group.mogProjectNr1,
      mogProjectNaam1: this.group.mogProjectNaam1,

      mogNaam2: this.group.mogNaam2,
      mogProjectNr2: this.group.mogProjectNr2,
      mogProjectNaam2: this.group.mogProjectNaam2,
      //aannemer
      aannemerProjectNr: this.group.aannemerProjectNr,
      aannemerNaam: this.group.aannemerNaam,
      aannemerWerfleider: this.group.aannemerWerfleider,
      //gemeentecode
      //Users
      users: [this.selectedUserIds],
      heeftPloegen: this.group.heeftPloegen,
      //fum/omh
      buisVertMult: this.group.buisVertMult == null ? 1 : this.group.buisVertMult,
      yStukMult: this.group.yStukMult == null ? 0.5 : this.group.yStukMult,
      bochtMult: this.group.bochtMult == null ? 0.3 : this.group.bochtMult,
      mofMult: this.group.mofMult == null ? 0.15 : this.group.mofMult,
      possibleKolkStreets: possibleKolkStreets
    });
    this.isLoaded = true;
    await this.delay(500);
    this.addForm.valueChanges.subscribe(x => {
      console.log(x)
      this.hasChangedValue = true;
    });
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  async ngOnInit() {}

  onDeleteGroup() {
    this.formService._chosenGroup = this.group;
    this.formService.previousPage.push('/pages/groupview' + this.group._id);
    let dialogRef = this.dialog.open(GroupsViewDeleteDialogComponent, {
      height: '25vh',
      width: '27vw',
    });
  }

  onSubmit(groupData: Group) {
    groupData._id = this.group._id;
    groupData.secondMogOn = this.secondMogOn;
    groupData.thirdMogOn = this.thirdMogOn;
    this.isRbNaamInvalid = false;
    this.isRbProjectNrInvalid = false;
    this.isRbProjectNaamInvalid = false;
    this.isRbGemeenteInvalid = false;
    this.isGemeenteCodeInvalid = false;
    this.isAannemerNaamInvalid = false;
    this.isAannemerProjectNrInvalid = false;
    this.isAannemerWerfleiderInvalid = false;

    if (groupData.rbNaam === '' || groupData.rbNaam == null) {
      this.isRbNaamInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.rbProjectNr === '' || groupData.rbProjectNr == null) {
      this.isRbProjectNrInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.rbProjectNaam === '' || groupData.rbProjectNaam == null) {
      this.isRbProjectNaamInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.gemeenteCode == null || groupData.gemeenteCode === '') {
      this.isGemeenteCodeInvalid = true;
      this.toastBadForm();
      return;
    }
    if (
      groupData.aannemerProjectNr === '' ||
      groupData.aannemerProjectNr == null
    ) {
      this.isAannemerProjectNrInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.aannemerNaam === '' || groupData.aannemerNaam == null) {
      this.isAannemerNaamInvalid = true;
      this.toastBadForm();
      return;
    }
    if (
      groupData.aannemerWerfleider === '' ||
      groupData.aannemerWerfleider == null
    ) {
      this.isAannemerWerfleiderInvalid = true;
      this.toastBadForm();
      return;
    }

    this.addForm.reset();
    this.outputEvent.emit('updated group');
    this.toastrService.success(
      groupData.rbProjectNr +
        ' - ' +
        groupData.rbProjectNaam +
        ' te ' +
        groupData.rbGemeente +
        ' is bewerkt',
      'Succes!',
    );
    this.apiService.updateGroup(groupData).subscribe((x) => {
      this.hasChangedValue = false;
      this.router.navigate(['/pages/groupview'  , this.group._id]);
    });
  }

  addSecondMog(){
    this.secondMogOn = true;
  }
  removeSecondMog(){
    this.secondMogOn = false;
    if(this.thirdMogOn){
      this.addForm.controls['mogNaam1'].setValue(this.addForm.controls['mogNaam2'].value);
      this.addForm.controls['mogProjectNr1'].setValue(this.addForm.controls['mogProjectNr2'].value);
      this.addForm.controls['mogProjectNaam1'].setValue(this.addForm.controls['mogProjectNaam2'].value);
      this.secondMogOn = true;
      this.removeThirdMog();
    } else {
      this.addForm.controls['mogNaam1'].setValue('');
      this.addForm.controls['mogProjectNr1'].setValue('');
      this.addForm.controls['mogProjectNaam1'].setValue('');
    }
  }
  addThirdMog(){
    this.thirdMogOn = true;
  }
  removeThirdMog(){
    this.thirdMogOn = false;
    this.addForm.controls['mogNaam2'].setValue('');
    this.addForm.controls['mogProjectNr2'].setValue('');
    this.addForm.controls['mogProjectNaam2'].setValue('');
  }

  toastBadForm() {
    this.toastrService.warning('Probeer het opnieuw', 'Oops!');
  }
  checkChangedValue(route: string){
    if(this.hasChangedValue){
      this.formService.previousRoute = route;
      const dialogRef = this.dialog.open(HasChangedPopupComponent, {
        width:'450px',
        height:'200px',
        panelClass: 'mat-dialog-padding'
      });
    } else {
      this.router.navigate([route]);
    }
  }
  goToPrevious() {
    this.checkChangedValue('/pages/groupview/'  +  this.group._id);
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.gemeentes.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(value: string): Observable<string[]> {
    return of(value).pipe(
      map(filterString => this.filter(filterString)),
    );
  }

  onChange() {
    this.filteredGemeentes$ = this.getFilteredOptions(this.addForm.get('rbGemeente').value);
  }

  onSelectionChange($event) {
    this.filteredGemeentes$ = this.getFilteredOptions($event);
    if(this.gemeenteCodes[this.gemeentes.findIndex(x => x === $event)] != null){
      this.addForm.controls['gemeenteCode'].setValue(this.gemeenteCodes[this.gemeentes.findIndex(x => x === $event)]);
    }
  }
  convertIdToNameString(user: string) {
    return this.allUsers.find(x => x._id === user).name;
  }
  get possibleKolkStreets() {
    return this.addForm.get('possibleKolkStreets') as FormArray;
  }

  addStreet() {
    this.possibleKolkStreets.push(this.formBuilder.control(''));
  }

  removeStreet(index: number) {
    this.possibleKolkStreets.removeAt(index);
  }
}
