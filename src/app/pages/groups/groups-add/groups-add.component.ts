import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, FormGroup, UntypedFormArray } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { ApiService } from "../../../../services/api.service";
import { FormService } from "../../../../services/form.service";
import { Router } from "@angular/router";
import { User } from 'models/user';
import { Group } from '../../../../models/groups';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-categories-add',
  templateUrl: './groups-add.component.html',
  styleUrls: ['../../styles/add-form.scss', './groups-add.component.scss']
})
export class GroupsAddComponent implements OnInit {

  public allUsers: User[];
  public isLoaded: boolean;
  @Output() outputEvent: EventEmitter<string> = new EventEmitter();
  selectedGemeenteIndex: number;
  isSaving: boolean = false;
  addForm: UntypedFormGroup;
  gemeentes: string[] = ['Aalst', 'Aalter', 'Aarschot', 'Aartselaar', 'Affligem', 'Alken', 'Alveringem', 'Antwerpen', 'Anzegem', 'Ardooie', 'Arendonk', 'As', 'Asse', 'Assenede', 'Avelgem', 'Baarle-Hertog', 'Balen', 'Beernem', 'Beerse', 'Beersel', 'Begijnendijk', 'Bekkevoort', 'Beringen', 'Berlaar', 'Berlare', 'Bertem', 'Bever', 'Beveren', 'Bierbeek', 'Bilzen', 'Blankenberge', 'Bocholt', 'Boechout', 'Bonheiden', 'Boom', 'Boortmeerbeek', 'Borgloon', 'Bornem', 'Borsbeek', 'Boutersem', 'Brakel', 'Brasschaat', 'Brecht', 'Bredene', 'Bree', 'Brugge', 'Buggenhout', 'Damme', 'De Haan', 'De Panne', 'De Pinte', 'Deerlijk', 'Deinze', 'Denderleeuw', 'Dendermonde', 'Dentergem', 'Dessel', 'Destelbergen', 'Diepenbeek', 'Diest', 'Diksmuide', 'Dilbeek', 'Dilsen-Stokkem', 'Drogenbos', 'Duffel', 'Edegem', 'Eeklo', 'Erpe-Mere', 'Essen', 'Evergem', 'Galmaarden', 'Gavere', 'Geel', 'Geetbets', 'Genk', 'Gent', 'Geraardsbergen', 'Gingelom', 'Gistel', 'Glabbeek', 'Gooik', 'Grimbergen', 'Grobbendonk', 'Haacht', 'Haaltert', 'Halen', 'Halle', 'Ham', 'Hamme', 'Hamont-Achel', 'Harelbeke', 'Hasselt', 'Hechtel-Eksel', 'Heers', 'Heist-op-den-Berg', 'Hemiksem', 'Herent', 'Herentals', 'Herenthout', 'Herk-de-Stad', 'Herne', 'Herselt', 'Herstappe', 'Herzele', 'Heusden-Zolder', 'Heuvelland', 'Hoegaarden', 'Hoeilaart', 'Hoeselt', 'Holsbeek', 'Hooglede', 'Hoogstraten', 'Horebeke', 'Houthalen-Helchteren', 'Houthulst', 'Hove', 'Huldenberg', 'Hulshout', 'Ichtegem', 'Ieper', 'Ingelmunster', 'Izegem', 'Jabbeke', 'Kalmthout', 'Kampenhout', 'Kapellen', 'Kapelle-op-den-Bos', 'Kaprijke', 'Kasterlee', 'Keerbergen', 'Kinrooi', 'Kluisbergen', 'Knokke-Heist', 'Koekelare', 'Koksijde', 'Kontich', 'Kortemark', 'Kortenaken', 'Kortenberg', 'Kortessem', 'Kortrijk', 'Kraainem', 'Kruibeke', 'Kruisem', 'Kuurne', 'Laakdal', 'Laarne', 'Lanaken', 'Landen','Langemark-Poelkapelle', 'Lebbeke', 'Lede', 'Ledegem', 'Lendelede', 'Lennik', 'Leopoldsburg','Leuven', 'Lichtervelde', 'Liedekerke', 'Lier', 'Lierde', 'Lievegem', 'Lille', 'Linkebeek', 'Lint', 'Linter', 'Lochristi', 'Lokeren', 'Lommel', 'Londerzeel', 'Lo-Reninge', 'Lubbeek', 'Lummen', 'Maarkedal', 'Maaseik', 'Maasmechelen', 'Machelen', 'Maldegem', 'Malle', 'Mechelen', 'Meerhout', 'Meise', 'Melle', 'Menen', 'Merchtem', 'Merelbeke', 'Merksplas', 'Mesen', 'Meulebeke', 'Middelkerke', 'Moerbeke', 'Mol', 'Moorslede', 'Mortsel', 'Nazareth', 'Niel', 'Nieuwerkerken', 'Nieuwpoort', 'Nijlen', 'Ninove', 'Olen', 'Oostende', 'Oosterzele', 'Oostkamp', 'Oostrozebeke', 'Opwijk', 'Oudenaarde', 'Oudenburg', 'Oud-Heverlee', 'Oudsbergen', 'Oud-Turnhout', 'Overijse', 'Peer', 'Pelt', 'Pepingen', 'Pittem', 'Poperinge', 'Putte', 'Puurs-Sint-Amands', 'Ranst', 'Ravels', 'Retie', 'Riemst', 'Rijkevorsel', 'Roeselare', 'Ronse', 'Roosdaal', 'Rotselaar', 'Ruiselede', 'Rumst', 'Schelle', 'Scherpenheuvel-Zichem', 'Schilde', 'Schoten', 'Sint-Genesius-Rode', 'Sint-Gillis-Waas', 'Sint-Katelijne-Waver','Sint-Laureins', 'Sint-Lievens-Houtem', 'Sint-Martens-Latem', 'Sint-Niklaas', 'Sint-Pieters-Leeuw', 'Sint-Truiden', 'Spiere-Helkijn','Stabroek', 'Staden', 'Steenokkerzeel', 'Stekene', 'Temse', 'Ternat', 'Tervuren', 'Tessenderlo', 'Tielt', 'Tielt-Winge', 'Tienen', 'Tongeren', 'Torhout', 'Tremelo', 'Turnhout', 'Veurne', 'Vilvoorde', 'Vleteren', 'Voeren', 'Vorselaar', 'Vosselaar', 'Waasmunster', 'Wachtebeke', 'Waregem', 'Wellen', 'Wemmel', 'Wervik', 'Westerlo','Wetteren', 'Wevelgem', 'Wezembeek-Oppem', 'Wichelen', 'Wielsbeke', 'Wijnegem', 'Willebroek', 'Wingene', 'Wommelgem', 'Wortegem-Petegem','Wuustwezel', 'Zandhoven', 'Zaventem', 'Zedelgem', 'Zele', 'Zelzate', 'Zemst', 'Zoersel', 'Zonhoven', 'Zonnebeke', 'Zottegem', 'Zoutleeuw', 'Zuienkerke', 'Zulte', 'Zutendaal', 'Zwalm', 'Zwevegem', 'Zwijndrecht'];
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
  isRbNaamInvalid: boolean = false;
  isRbProjectNrInvalid: boolean = false;
  isRbProjectNaamInvalid: boolean = false;
  isRbGemeenteInvalid: boolean = false;
  isBhNaamInvalid: boolean = false;
  isBhProjectNrInvalid: boolean = false;
  isBhProjectNaamInvalid: boolean = false;
  /*
  isMogNaamInvalid: boolean = false;
  isMogProjectNrInvalid: boolean = false;
  isMogProjectNaamInvalid: boolean = false;
  */
  isAannemerNaamInvalid: boolean = false;
  isAannemerProjectNrInvalid: boolean = false;
  isAannemerWerfleiderInvalid: boolean = false;
  isGemeenteCodeInvalid: boolean = false;

  secondMogOn: boolean = false;
  thirdMogOn: boolean = false;



  isProjectNrInvalid: boolean = false;
  isProjectNameInvalid: boolean = false;
  isCityInvalid: boolean = false;
  isFirmaInvalid: boolean = false;
  filteredGemeentes$: Observable<string[]>;
  streetsForm: FormGroup;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private formService: FormService,
    private router: Router
  ) {
    this.addForm = this.formBuilder.group({

      //Rioolbeheerder
      rbNaam: '',
      rbProjectNr: '',
      rbProjectNaam: '',
      rbGemeente: '',
      gemeenteCode: '',
      //Bouwheer
      bhNaam: '',
      bhProjectNr: '',
      bhProjectNaam: '',
      //Medeopdrachtgever
      mogNaam: '',
      mogProjectNr: '',
      mogProjectNaam: '',

      mogNaam1: '',
      mogProjectNr1: '',
      mogProjectNaam1: '',

      mogNaam2: '',
      mogProjectNr2: '',
      mogProjectNaam2: '',
      //aannemer
      aannemerProjectNr: '',
      aannemerNaam: '',
      aannemerWerfleider: '',
      //Users
      users: [],
      heeftPloegen: false,
      //fum/omh
      buisVertMult: 1,
      yStukMult: 0.5,
      bochtMult: 0.3,
      mofMult: 0.15,
      possibleKolkStreets: this.formBuilder.array([]),
      isProjectForAWV: false,
      aidNummer: '',
      ident8: ''
    });
  }
  async ngOnInit() {
    this.isSaving = false;
    this.isLoaded = true;
    this.filteredGemeentes$ = of(this.gemeentes);

    this.apiService.getUsers().subscribe(x => {
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
    })

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
  onSubmit(groupData) {
    if(this.isSaving)return;
    this.isSaving = true;
    this.isRbNaamInvalid = false;
    this.isRbProjectNrInvalid = false;
    this.isRbProjectNaamInvalid = false;
    this.isRbGemeenteInvalid = false;
    this.isAannemerNaamInvalid = false;
    this.isAannemerProjectNrInvalid = false;
    this.isAannemerWerfleiderInvalid = false;
    this.isGemeenteCodeInvalid = false;
    groupData.thirdMogOn = this.thirdMogOn;
    groupData.secondMogOn = this.secondMogOn;
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
    if (groupData.rbGemeente === '' || groupData.rbGemeente == null) {
      this.isRbGemeenteInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.gemeenteCode === '' || groupData.gemeenteCode == null) {
      this.isGemeenteCodeInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.aannemerProjectNr === '' || groupData.aannemerProjectNr == null) {
      this.isAannemerProjectNrInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.aannemerNaam === '' || groupData.aannemerNaam == null) {
      this.isAannemerNaamInvalid = true;
      this.toastBadForm();
      return;
    }
    if (groupData.aannemerWerfleider === '' || groupData.aannemerWerfleider == null) {
      this.isAannemerWerfleiderInvalid = true;
      this.toastBadForm();
      return;
    }

    this.addForm.reset();
    this.outputEvent.emit('added group');
    this.toastrService.success(groupData.rbProjectNr + ' - ' + groupData.rbProjectNaam + ' te ' + groupData.rbGemeente + ' is opgeslagen', 'Succes!');
    this.apiService.createGroup(groupData).subscribe(x => {
      let newGroup = x as Group;
      if(newGroup._id == null){
      newGroup._id = newGroup.id;
     }
      this.formService.isComingFromCreateGroup = true;
      this.isSaving = false;
      this.router.navigate(['/pages/settings-variable', newGroup._id]);
    }, error => {
      this.toastBadForm();
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
    this.isSaving = false;
    this.toastrService.warning('Probeer het opnieuw', 'Oops!');
  }

  goToPrevious() {
    this.router.navigate(['/pages/groups']);
  }


  private filter(value: string): string[] {
    const filterValue = value?.toLowerCase();
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
    this.addForm.controls['gemeenteCode'].setValue(this.gemeenteCodes[this.gemeentes.findIndex(x => x === $event)]);
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
