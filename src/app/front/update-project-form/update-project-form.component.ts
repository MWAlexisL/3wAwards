import {Component, OnInit} from '@angular/core';
import {FormService, Form} from '../../../backend/forms';
import {Credit, Member, Project, Tag, TypeTag, Target, SiteType} from '../../../backend/model';
import {MembersService, ProjectsService, TypeTagsService, TargetsService, SiteTypesService} from '../../../backend/services';
import {TokenInterface} from '../../tokenInterface';
import {AuthService} from '../../auth.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-update-project-form',
  templateUrl: './update-project-form.component.html',
})
export class UpdateProjectFormComponent implements OnInit {
  form: Form<Project>;
  tokenStorage = localStorage.getItem('user_token');
  userInfo: TokenInterface;
  member: Member;
  project: Project;
  idAgency: number;
  idClient: number;
  accessibilityValue: string;
  challengeValue: string;
  typeTags: TypeTag[] = [];
  projectTags: Tag[] = [];
  accessibility: Tag[] = [];
  challenge: Tag[] = [];
  siteTypeTags: Tag[] = [];
  businessTags: Tag[] = [];
  targetTags: Tag[] = [];
  purposeTags: Tag[] = [];
  languageTags: Tag[] = [];
  customTags: Tag[] = [];
  styleTags: Tag[] = [];
  behaviorTags: Tag[] = [];
  agencyMissionTags: Tag[] = [];
  mainFonctionnalityTags: Tag[] = [];
  frontTags: Tag[] = [];
  backTags: Tag[] = [];
  cmsTags: Tag[] = [];
  colorTags: Tag[] = [];
  budgetFork: Tag[] = [];
  credits: Credit[] = [];
  targets: Target[] = [];
  siteTypes: SiteType[] = [];
  idTarget: number;
  idSiteType: number;
  addOnBlur = true;
  agencyOrClientName: string;
  separatorKeysCodes = [ENTER, COMMA];
  tiles = [
    {text: 'One', cols: 2, rows: 2, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 1, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 1, rows: 1, color: '#DDBDF1'},
  ];
  colors = ['#ffffff', '#000000', '#999999', '#FD0100', '#FE8A01', '#FFDC02', '#80D300', '#27A101', '#00B09C', '#1888DA', '#00568D',
    '#0E00C6', '#6500C9', '#8F01C9', '#8F02C5', '#D40280'];

  constructor(private projectsService: ProjectsService, private membersService: MembersService, private formService: FormService,
              private authService: AuthService, private typeTagsService: TypeTagsService, private targetsService: TargetsService,
              private  siteTypesService: SiteTypesService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.userInfo = this.authService.getUserInfo(this.tokenStorage);
    this.membersService.get(this.userInfo.id).subscribe(
      res => {
        this.member = res;
      },
      err => {
      }
    );
    this.targetsService.getAll().subscribe(
      res => {
        this.targets = res;
      },
      err => {
      }
    );
    this.siteTypesService.getAll().subscribe(
      res => {
        this.siteTypes = res;
      },
      err => {
      }
    );
    this.getAllTypeTag();
    this.createNewProject();
    this.route.params.subscribe(params => {
      this.projectsService.get(params.id).subscribe(
        res => {
          this.project = res;
          console.log(this.project);
          if (this.project.agency === null) {
            this.agencyOrClientName = this.project.client.name;
          } else {
            this.agencyOrClientName = this.project.agency.name;
          }
          this.form = this.formService.makeForm<Project>(this.project);
          this.projectTags = this.project.tags;
          this.credits = this.project.credits;
          this.refreshTagsArray();
          console.log(this.challenge[0]);
        },
        err => {
        }
      );
    });
  }

  createNewProject(): void {
    this.form = this.formService.makeForm(new Project());
  }

  commitProject(): void {
    if (this.form.group.dirty && this.form.group.valid) {
      const newProject = this.form.get();
      if (newProject.id) {
        newProject.setImagesAtNull();
        console.log(newProject);
        this.projectsService.update(newProject).subscribe();
      } else {
        this.form.displayErrors();
      }
    }
  }

  getTheSelectedValue(value): void {
    const array = value.split(',');
    if (array[0] === 'agency') {
      this.idAgency = array[1];
      this.idClient = undefined;
    } else {
      this.idClient = array[1];
      this.idAgency = undefined;
    }
  }

  getTarget(value): void {
    this.idTarget = value;
  }

  getSiteType(value): void {
    this.idSiteType = value;
  }

  addTag(value: string, type: string): void {
    if (value === '') {
      for (let i = 0; i < this.projectTags.length; i++) {
        if (this.projectTags[i].type.libelle === type) {
          this.projectTags.splice(i, 1);
        }
      }
    }
    if (value !== '') {
      let find = false;
      for (let i = 0; i < this.projectTags.length; i++) {
        if (this.projectTags[i].type.libelle === type) {
          this.projectTags[i].libelle = value;
          find = true;
        }
      }
      if (find === false) {
        const tag = new Tag();
        for (let typeTag of this.typeTags) {
          if (typeTag.libelle === type) {
            tag.setType(typeTag.id);
            tag.type.libelle = type;
          }
        }
        tag.libelle = value;
        this.projectTags.push(tag);
      }
    }
  }

  getAllTypeTag() {
    this.typeTagsService.getAll().subscribe(
      res => {
        this.typeTags = res;
      },
      err => {
      }
    );
  }

  removeTag(value: string): void {
    for (let i = 0; i < this.projectTags.length; i++) {
      if (this.projectTags[i].libelle === value) {
        this.projectTags.splice(i, 1);
      }
    }
    this.refreshTagsArray();
  }

  addTags(event: MatChipInputEvent, type: string): void {
    if ((event.value || '').trim()) {
      const tag = new Tag();
      for (let typeTag of this.typeTags) {
        if (typeTag.libelle === type) {
          tag.setType(typeTag.id);
          tag.type.libelle = type;
        }
      }
      tag.libelle = event.value;
      this.projectTags.push(tag);
    }
    // Reset the input value
    if (event.input) {
      event.input.value = '';
    }
    this.refreshTagsArray();
  }

  addColors(value: string, type: string): void {
    const tag = new Tag();
    for (let typeTag of this.typeTags) {
      if (typeTag.libelle === type) {
        tag.setType(typeTag.id);
        tag.type.libelle = type;
      }
    }
    tag.libelle = value;
    this.projectTags.push(tag);
    this.refreshTagsArray();
  }

  refreshTagsArray() {
    this.customTags = this.projectTags.filter(tag => tag.type.libelle === 'custom');
    this.styleTags = this.projectTags.filter(tag => tag.type.libelle === 'style');
    this.behaviorTags = this.projectTags.filter(tag => tag.type.libelle === 'behavior');
    this.agencyMissionTags = this.projectTags.filter(tag => tag.type.libelle === 'agency_mission');
    this.mainFonctionnalityTags = this.projectTags.filter(tag => tag.type.libelle === 'main_fonctionnality');
    this.frontTags = this.projectTags.filter(tag => tag.type.libelle === 'front_tech');
    this.backTags = this.projectTags.filter(tag => tag.type.libelle === 'back_tech');
    this.cmsTags = this.projectTags.filter(tag => tag.type.libelle === 'cms');
    this.colorTags = this.projectTags.filter(tag => tag.type.libelle === 'color');
    this.siteTypeTags = this.projectTags.filter(tag => tag.type.libelle === 'site_type');
    this.businessTags = this.projectTags.filter(tag => tag.type.libelle === 'business_sector');
    this.targetTags = this.projectTags.filter(tag => tag.type.libelle === 'target');
    this.purposeTags = this.projectTags.filter(tag => tag.type.libelle === 'purpose');
    this.languageTags = this.projectTags.filter(tag => tag.type.libelle === 'language');
    this.budgetFork = this.projectTags.filter(tag => tag.type.libelle === 'budget_fork');
    this.challenge =  this.projectTags.filter(tag => tag.type.libelle === 'challenge');
    this.accessibility =  this.projectTags.filter(tag => tag.type.libelle === 'accessibility');
  }

  onAccessibilityRatingChange($event) {
    this.accessibilityValue = $event.rating;
  }

  onChallengeRatingChange($event) {
    this.challengeValue = $event.rating;
  }

  addCredit(firstName: string, lastName: string, office: string): void {
    if (firstName !== '' && lastName !== '' && office !== '') {
      const credit = new Credit();
      credit.firstname = firstName;
      credit.lastname = lastName;
      credit.function = office;

      this.credits.push(credit);
    }
  }

  removeCredit(credit: Credit): void {
    for (let i = 0; i < this.credits.length; i++) {
      if (this.credits[i] === credit) {
        this.credits.splice(i, 1);
      }
    }
  }
}
