import {Component, OnInit} from '@angular/core';
import {FormService, Form} from '../../../backend/forms';
import {Member, Project, Tag, TypeTag} from '../../../backend/model';
import {MembersService, ProjectsService, TypeTagsService} from '../../../backend/services';
import {TokenInterface} from '../../tokenInterface';
import {AuthService} from '../../auth.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent implements OnInit {
  form: Form<Project>;
  tokenStorage = localStorage.getItem('user_token');
  userInfo: TokenInterface;
  member: Member;
  idAgency: number;
  idClient: number;
  typeTags: TypeTag[] = [];
  projectTags: Tag[] = [];
  customTags: Tag[] = [];
  addOnBlur = true;
  separatorKeysCodes = [ENTER, COMMA];

  constructor(private projectsService: ProjectsService, private membersService: MembersService, private formService: FormService,
              private authService: AuthService, private typeTagsService: TypeTagsService) {
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
    this.getAllTypeTag();
    this.createNewProject();
  }

  createNewProject(): void {
    this.form = this.formService.makeForm(new Project());
  }

  commitProject(): void {
    if (this.form.group.dirty && this.form.group.valid) {
      const newProject = this.form.get();
      newProject.setProjectRatingMemberAtNull();
      newProject.status = 'pending';
      if (newProject.id) {
        this.projectsService.update(newProject).subscribe(res => console.log('update'));
      } else {
        this.idAgency = this.member.agencies[0].id;

        if (this.idClient !== undefined) {
          newProject.setAgencyAtNull();
          newProject.setClient(this.idClient);
        } else {
          newProject.setClientAtNull();
          newProject.setAgency(this.idAgency);
        }

        newProject.averageRating = null;
        newProject.SetMultipletTags(this.projectTags);
        newProject.setMembersatNull();
        newProject.setImagesAtNull();
        newProject.setAwardsAtNull();
        console.log(newProject);
        this.projectsService.add(newProject).subscribe(res => console.log('add'));
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
    console.log(this.projectTags);
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
      console.log(this.projectTags);
    }
    // Reset the input value
    if (event.input) {
      event.input.value = '';
    }
    this.refreshTagsArray();
  }

  refreshTagsArray () {
    this.customTags = this.projectTags.filter(tag => tag.type.libelle === 'custom');
  }


}
