import { Component } from '@angular/core';
import {AmazonAuthenticationService} from './shared/amazon-authentication.service';
import {Options} from './shared/options.model';

@Component({
  moduleId: module.id,
  selector: 'amazon-login',
  templateUrl: 'amazon-login.component.html',
  styleUrls: ['amazon-login.component.css'],
  providers : [AmazonAuthenticationService]
})
export class AmazonLoginComponent  {
  private clientId: string = 'AMAZON_CLIENT_ID';
  private sdkLoaded: boolean;
  private waiting: boolean;
  private error: string;
  private accessToken: string;
  private loggedIn: boolean;
  private profileDetails: any;
  constructor(private amazonAuthenticationService: AmazonAuthenticationService) {
    this.waiting = true;
    this.amazonAuthenticationService.loadSdk(this.clientId, () => {
      this.sdkLoaded = true;
      this.waiting = false;
    }, (error) => {
      console.log(error);
      this.error = error;
      this.sdkLoaded = false;
      this.waiting = false;
    });
  }

  login() {
    if (this.sdkLoaded) {
      let options = new Options();
      this.amazonAuthenticationService.authorize(options, (response) => {
        if (response.status === 'complete' && response.access_token) {
          this.accessToken = response.access_token;
          this.loggedIn = true;
          this.retrieveProfileDetails();
        }
      });
    }
  }
  retrieveProfileDetails() {
    this.amazonAuthenticationService.retrieveProfile((response) => {
      console.log(response);
      this.profileDetails = JSON.stringify(response.profile);
    }, this.accessToken);
  }
  logout() {
    if (this.sdkLoaded) {
      this.amazonAuthenticationService.logout();
      this.loggedIn = false;
      this.profileDetails = null;
    }
  }
}
