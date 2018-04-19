// This file should not be modified, as it can be overwritten by the generator.
// The 'FormGroupValidationMatcher' class is here for customizations and will not be touched.

import { ValidationTypes } from './tools/ValidationTypes';

import { Agency } from '../model/Agency';
import { AgencyValidators } from './AgencyValidators';
import { Award } from '../model/Award';
import { AwardValidators } from './AwardValidators';
import { Category } from '../model/Category';
import { CategoryValidators } from './CategoryValidators';
import { Client } from '../model/Client';
import { ClientValidators } from './ClientValidators';
import { Image } from '../model/Image';
import { ImageValidators } from './ImageValidators';
import { Member } from '../model/Member';
import { MemberValidators } from './MemberValidators';
import { ProjectRatingMember } from '../model/ProjectRatingMember';
import { ProjectRatingMemberValidators } from './ProjectRatingMemberValidators';
import { Project } from '../model/Project';
import { ProjectValidators } from './ProjectValidators';
import { Rating } from '../model/Rating';
import { RatingValidators } from './RatingValidators';
import { Tag } from '../model/Tag';
import { TagValidators } from './TagValidators';
import { TypeAgency } from '../model/TypeAgency';
import { TypeAgencyValidators } from './TypeAgencyValidators';
import { TypeTag } from '../model/TypeTag';
import { TypeTagValidators } from './TypeTagValidators';

export class FormGroupValidationMatcherBase {
  protected items: {[itemType: string ]: ValidationTypes};

  constructor() {
    this.setBaseItems();
    this.setItems();
  }

  setItems() {}

  setBaseItems() {
    this.items = {};
    this.items[Agency._resource] = {itemClass: Agency, validator: AgencyValidators};
    this.items[Award._resource] = {itemClass: Award, validator: AwardValidators};
    this.items[Category._resource] = {itemClass: Category, validator: CategoryValidators};
    this.items[Client._resource] = {itemClass: Client, validator: ClientValidators};
    this.items[Image._resource] = {itemClass: Image, validator: ImageValidators};
    this.items[Member._resource] = {itemClass: Member, validator: MemberValidators};
    this.items[ProjectRatingMember._resource] = {itemClass: ProjectRatingMember, validator: ProjectRatingMemberValidators};
    this.items[Project._resource] = {itemClass: Project, validator: ProjectValidators};
    this.items[Rating._resource] = {itemClass: Rating, validator: RatingValidators};
    this.items[Tag._resource] = {itemClass: Tag, validator: TagValidators};
    this.items[TypeAgency._resource] = {itemClass: TypeAgency, validator: TypeAgencyValidators};
    this.items[TypeTag._resource] = {itemClass: TypeTag, validator: TypeTagValidators};
  }

  get(itemType: string): ValidationTypes {
    if (!this.items[itemType]) {
      throw new Error('Form group validator not found for "' + itemType + '"');
    }
    return this.items[itemType];
  }
}
