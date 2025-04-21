import { Component, OnInit } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {}

  ngOnInit() {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      // Initialize Google Auth if on native platform
      if (this.platform.is('capacitor')) {
        GoogleAuth.initialize({
          clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
      }
    });
  }
}
