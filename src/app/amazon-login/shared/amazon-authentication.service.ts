import { Injectable } from '@angular/core';
import {Options} from './options.model';
import {AuthorizeRequest} from './authorize-request.model';
declare var System: any;
declare var require: any;
declare var amazon: any;
@Injectable()
export class AmazonAuthenticationService {
  private sdkURI: string = 'https://api-cdn.amazon.com/sdk/login1.js';
  private sdkLoaded: boolean = false;
  private amazonLogin: any;
  private clientId: string;
  constructor() {
  }
  loadSdk(clientId: string, successCallback?: Function, failureCallback?: Function) {
    if (!clientId || clientId === '') {
      return;
    } else {
      this.clientId = clientId;
    }
    /*If System JS is present, it will be used else for webpack we expect it to be loaded via webpack.config.js*/
    if (typeof System !== 'undefined') {
      System.config({
        meta: {
          'amazon-login': { format: 'global', scriptLoad: true, exports : 'amazon' }
        },
        map: {
          'amazon-login': this.sdkURI
        }
      });
      console.log('System JS Detected');
      /*Try to Load Module via System JS*/
      System.import('amazon-login').then(refToLoadedModule => {
        console.log('SDK Loaded via System.js');
        this.amazonLogin = refToLoadedModule.Login;
        this.afterLoad();
        successCallback ? successCallback() : null;
      }, (error: any) => {
        console.log('Error Occured while loading Amazon SDK');
        failureCallback ? failureCallback(error) : null;
      });

    } else {
      console.log('System JS not found.Checking if sdk has been loaded already');
      if (typeof amazon !== 'undefined' && amazon.login) {
        console.log('Amazon SDK already Loaded externally');
        this.amazonLogin = amazon.Login;
        this.afterLoad();
        successCallback ? successCallback() : null;
      } else {
        console.log('Error Occured while loading Amazon SDK');
        failureCallback ? failureCallback('SDK Not found') : null;
      }
    }
  }
  isSdkLoaded() {
    return this.sdkLoaded;
  }
  afterLoad() {
    this.sdkLoaded = true;
    this.setClientId();
  }
  setClientId() {
    this.amazonLogin.setClientId(this.clientId);
  }
  authorize(options: Options, next?: URL | (Function)): AuthorizeRequest {
      return this.amazonLogin.authorize( options, next);
  }
  retrieveProfile(callback: Function, accessToken?: string ) {
      this.amazonLogin.retrieveProfile(accessToken, callback);
  }
  logout() {
    this.amazonLogin.logout();
  }
  setSandboxMode( sandboxMode: boolean) {
      this.amazonLogin.setSandboxMode( sandboxMode);
  }

  setSiteDomain( siteDomain: string) {
      this.amazonLogin.setSiteDomain( siteDomain);
  }

  setUseCookie( useCookie: boolean) {
      this.amazonLogin.setUseCookie(useCookie);
  }
}
