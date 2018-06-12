// This file should not be modified, as it can be overwritten by the generator.
// The 'Member' class is here for customizations and will not be touched.

import { Tag } from '../Tag';
import { Project } from '../Project';
import { ProjectRatingMember } from '../ProjectRatingMember';
import { Client } from '../Client';
import { Agency } from '../Agency';
import { Image } from '../Image';

export class MemberBase {
  public static readonly _resource: string = 'members';
  get _resource(): string { return MemberBase._resource; };

  gender: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  country: string;
  tags: Tag[];
  favoriteProjects: Project;
  presentation: string;
  websiteUrl: string;
  function: string;
  newsletter: boolean;
  optIn: boolean;
  projectRatingMember: ProjectRatingMember[];
  clients: Client;
  agencies: Agency;
  profilePicture: Image;
  username: string;
  email: string;
  isJudge: boolean;

  setFavoriteProjects(id: number): MemberBase {
    this.favoriteProjects = new Project();
    this.favoriteProjects.id = id;
    this.favoriteProjects['@id'] = '/projects/' + id;
    return this;
  }

  setClients(id: number): MemberBase {
    this.clients = new Client();
    this.clients.id = id;
    this.clients['@id'] = '/clients/' + id;
    return this;
  }

  setAgencies(id: number): MemberBase {
    this.agencies = new Agency();
    this.agencies.id = id;
    this.agencies['@id'] = '/agencies/' + id;
    return this;
  }

  setProfilePicture(id: number): MemberBase {
    this.profilePicture = new Image();
    this.profilePicture.id = id;
    this.profilePicture['@id'] = '/images/' + id;
    return this;
  }

}
