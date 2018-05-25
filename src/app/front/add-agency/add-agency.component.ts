import {Component, OnInit} from '@angular/core';
import {MembersService, AgenciesService, TypeTagsService, TypeAgenciesService} from '../../../backend/services';
import {Agency, Member, TypeTag, Tag, TypeAgency} from '../../../backend/model';
import {FormService, Form} from '../../../backend/forms';
import {TokenInterface} from '../../tokenInterface';
import {AuthService} from '../../auth.service';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.scss']
})
export class AddAgencyComponent implements OnInit {
  agencies: Array<Agency> = [];
  form: Form<Agency>;
  tokenStorage = localStorage.getItem('user_token');
  userInfo: TokenInterface;
  member: Member;
  typeTags: TypeTag[] = [];
  typeAgencies: TypeAgency[] = [];
  agencyTags: Tag[] = [];
  idTypeAgency: number;
  customTags: Tag[] = [];
  addOnBlur = true;
  separatorKeysCodes = [ENTER, COMMA];

  constructor(private agenciesService: AgenciesService, private formService: FormService, private typeTagService: TypeTagsService,
              private membersService: MembersService, private authService: AuthService, private  typeAgenciesService: TypeAgenciesService) {
  }

  ngOnInit() {
    this.userInfo = this.authService.getUserInfo(this.tokenStorage);
    this.getAllTypeTag();
    // initialize the form with a whole new Agency
    this.createNewAgency();
    this.typeAgenciesService.getAll().subscribe(
      res => {
        this.typeAgencies = res;
      },
      err => {
      }
    );
  }

  createNewAgency(): void {
    this.form = this.formService.makeForm<Agency>(new Agency());
  }

  commitAgency(): void {
    if (this.form.group.dirty && this.form.group.valid) {
      const newAgency = this.form.get();
      if (newAgency.id) {
        this.agenciesService.update(newAgency).subscribe(agency => console.log('yeah!'));
      } else {
        newAgency.setProjectsatNull();
        newAgency.tags = this.agencyTags;
        newAgency.image = null;
        if (this.idTypeAgency === undefined) {
          newAgency.setTypeAgency(this.typeAgencies[0].id);
        }
        newAgency.setTypeAgency(this.idTypeAgency);
        newAgency.setMember(this.userInfo.id);
        this.agenciesService.add(newAgency).subscribe(agency => console.log('add'));
      }
    } else {
      // force invalid inputs state to display errors
      this.form.displayErrors();
    }
  }

  getAllTypeTag() {
    this.typeTagService.getAll().subscribe(
      res => {
        this.typeTags = res;
      },
      err => {
      }
    );
  }

  getTypeAgencies(value): void {
    this.idTypeAgency = value;
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
      this.agencyTags.push(tag);
    }
    // Reset the input value
    if (event.input) {
      event.input.value = '';
    }
    this.refreshTagsArray();
  }

  refreshTagsArray() {
    this.customTags = this.agencyTags.filter(tag => tag.type.libelle === 'custom');
  }

  removeTag(value: string): void {
    for (let i = 0; i < this.agencyTags.length; i++) {
      if (this.agencyTags[i].libelle === value) {
        this.agencyTags.splice(i, 1);
      }
    }
    this.refreshTagsArray();
  }
}
