import { Component, Input, OnInit } from '@angular/core';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-avatar',
  template: `
    <ng-container *ngIf="projects.image_project_Squared != ''; else avater">
      <img [style.margin]="'auto 5px'" [src]="urlImg" height="50" width="50" />
    </ng-container>
    <ng-template #avater>
      <div
        class="letter"
        [style.background]="projects.letter_thumbnails_project[0]['background']"
        [style.color]="projects.letter_thumbnails_project[0]['color']"
      >
        {{ letter }}
      </div>
    </ng-template>
  `,
  styles: [],
})
export class AvatarComponent implements OnInit {
  @Input() public projects: Projects;
  public urlImg: string = '';
  public letter: string = '';

  constructor() {}

  ngOnInit(): void {
    this.urlImg = `${environment.baseUrlImg}${this.projects.image_project_Squared}`;
    this.letter = this.projects.letter_thumbnails_project[0]['letter'];
  }
}
