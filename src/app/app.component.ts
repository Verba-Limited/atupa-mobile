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
      // Initialize Google Auth for both platforms with a simpler configuration
      // that works for both native and web
      try {
        GoogleAuth.initialize({
          clientId: '13367546245-gldofkock88udfcpr00j5tmm3pmqg5b3.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          // No additional options that could cause errors
        });
        console.log('Google Auth initialized in app component');
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
      }
    });
  }
}
