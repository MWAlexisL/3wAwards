import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
})
export class AdminMenuComponent implements OnInit {
  hoveredAward = false;
  hoveredMember = false;

  constructor() { }

  ngOnInit() {
  }

}
