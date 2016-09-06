import { Component } from '@angular/core';
import {AmazonLoginComponent} from './amazon-login';
@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives : [AmazonLoginComponent]
})
export class AppComponent {
  title = 'app works!';
}
