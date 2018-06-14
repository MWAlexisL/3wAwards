import {Component, OnInit} from '@angular/core';
import {Form, FormService} from '../../../backend/forms';
import {Credit, Image, Member, Project, SiteType, Tag, Target, TypeTag} from '../../../backend/model';
import {
  MembersService,
  ProjectsService,
  SiteTypesService,
  TargetsService,
  TypeTagsService
} from '../../../backend/services';
import {TokenInterface} from '../../tokenInterface';
import {AuthService} from '../../auth.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {GlobalsService} from '../../globals.service';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent implements OnInit {
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
  isLoading = false;

  separatorKeysCodes = [ENTER, COMMA];
  files: File[] = [];
  url: string[] = [];
  uploadedImages: Image[] = [];

  colors = ['#ffffff', '#000000', '#999999', '#FD0100', '#FE8A01', '#FFDC02', '#80D300', '#27A101', '#00B09C', '#1888DA', '#00568D',
    '#0E00C6', '#6500C9', '#8F01C9', '#8F02C5', '#D40280'];

  constructor(private projectsService: ProjectsService, private membersService: MembersService, private formService: FormService,
              private authService: AuthService, private typeTagsService: TypeTagsService, private targetsService: TargetsService,
              private  siteTypesService: SiteTypesService, private http: HttpClient, private globalService: GlobalsService,
              private router: Router, public snackBar: MatSnackBar) {
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
  }

  createNewProject(): void {
    this.form = this.formService.makeForm(new Project());
  }

  commitProject(): void {
    this.isLoading = true;
    if (this.form.group.dirty && this.form.group.valid) {
      const newProject = this.form.get();
      newProject.projectRatingMember = [];
      newProject.status = 'pending';
      if (newProject.id) {
        this.projectsService.update(newProject).subscribe();
      } else {

        if (this.member.agencies[0] === undefined) {
          this.idClient = this.member.clients[0].id;
        } else {
          this.idAgency = this.member.agencies[0].id;
        }

        if (this.idClient !== undefined) {
          newProject.setAgencyAtNull();
          newProject.setClient(this.idClient);
        } else {
          newProject.setClientAtNull();
          newProject.setAgency(this.idAgency);
        }

        newProject.averageRating = 0;
        newProject.averageOriginalityRatingsJudge = 0;
        newProject.averageOriginalityRatingsMember = 0;
        newProject.averageReadabilityRatingsJudge = 0;
        newProject.averageReadabilityRatingsMember = 0;
        newProject.averageNavigationRatingsJudge = 0;
        newProject.averageNavigationRatingsMember = 0;
        newProject.averageInteractivityRatingsJudge = 0;
        newProject.averageInteractivityRatingsMember = 0;
        newProject.averageQualityContentRatingsJudge = 0;
        newProject.averageQualityContentRatingsMember = 0;
        newProject.averageWeatlhFunctionalityRatingsJudge = 0;
        newProject.averageWeatlhFunctionalityRatingsMember = 0;
        newProject.averageReactivityRatingsMember = 0;
        newProject.averageReactivityRatingsJudge = 0;
        newProject.averageUsersRatings = 0;
        newProject.averageJudgeRatings = 0;
        if (this.accessibilityValue !== undefined) {
          this.addTag(this.accessibilityValue.toString(), 'accessibility');
        }

        if (this.challengeValue !== undefined) {
          this.addTag(this.challengeValue.toString(), 'challenge');
        }
        newProject.tags = this.projectTags;
        newProject.setMembersatNull();
        newProject.setAwardsAtNull();
        newProject.credits = this.credits;

        if (this.idSiteType === undefined) {
          newProject.setSiteType(this.siteTypes[0].id);
        } else {
          newProject.setSiteType(this.idSiteType);
        }
        if (this.idTarget === undefined) {
          newProject.setTarget(this.targets[0].id);
        } else {
          newProject.setTarget(this.idTarget);
        }
        // remove all undefined elements
        for (let i = 0; i < this.url.length; i++) {
          if (this.url[i] === undefined) {
            this.url.splice(i, 1);
            this.files.splice(i, 1);
            i = -1;
          }
        }
        this.files.forEach((file, index) => {
          const formData = new FormData();
          formData.append('xd', file);
          this.http.post(this.globalService.url + 'xd', formData).subscribe((data: string) => {
            const image = new Image();
            image.libelle = file.name;
            image.path = data;
            image.position = index;
            this.uploadedImages.push(image);
            if (index === (this.files.length - 1)) {
              newProject.images = this.uploadedImages;
              this.projectsService.add(newProject).subscribe(project => {
                  this.openSnackBar();
                  this.router.navigate(['/update-project/' + project.id]);
              });
            }
          });
        });


      }
    } else {
      this.form.displayErrors();
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
        for (const typeTag of this.typeTags) {
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
      for (const typeTag of this.typeTags) {
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
    for (const typeTag of this.typeTags) {
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

  fileUpload($event: any, i) {
    const fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      const file: File = $event.target.files[0];
      this.files[i] = file;
      const fileReader = new FileReader();
      fileReader.onload = (event: any) => {
        this.url[i] = event.target.result;
      };
      fileReader.readAsDataURL(file);
    }
  }

  removeFile(index) {
    this.files[index] = undefined;
    this.url[index] = undefined;
  }

    openSnackBar(): void {
        this.snackBar.open('Projet créé', 'Ok', {
            duration: 2000
        });
    }
}
