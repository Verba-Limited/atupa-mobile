import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule, FormsModule],
})
export class EditProfilePage implements OnInit, OnDestroy {
  profileImage: string | ArrayBuffer | null = null;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  userId: string = '';
  
  private userSubscription: Subscription = new Subscription();
  
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    console.log('EditProfilePage constructor');
    
    // Load data immediately when component is constructed
    this.loadUserDataImmediately();
  }

  ngOnInit() {
    console.log('EditProfilePage ngOnInit');
    // Try loading data again
    this.loadUserData();
    
    // Force a manual data initialization after a slight delay
    setTimeout(() => {
      this.initializeData();
    }, 300);
  }

  ionViewWillEnter() {
    console.log('EditProfilePage ionViewWillEnter');
    // Reload user data when view is about to enter
    // This ensures data is loaded every time the page is visited
    this.loadUserData();
    this.cdr.detectChanges();
  }

  ionViewDidEnter() {
    console.log('EditProfilePage ionViewDidEnter');
    // Ensure data is loaded after the view is fully initialized
    this.initializeData();
  }

  ngOnDestroy() {
    console.log('EditProfilePage ngOnDestroy');
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  initializeData() {
    console.log('Initializing data manually');
    // Try to load from localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Set directly without zone
        this.firstName = user.firstName || user['firstName'] || '';
        this.lastName = user.lastName || user['lastName'] || '';
        this.email = user.email || user['email'] || '';
        this.userId = user.id || user['id'] || '';
        this.profileImage = user.profileImage || user['profileImage'] || null;
        
        // Force change detection
        this.cdr.detectChanges();
        console.log('Data initialized manually:', this.firstName, this.lastName);
      } catch (e) {
        console.error('Error initializing data manually:', e);
      }
    }
  }

  loadUserDataImmediately() {
    // Force immediate data loading from localStorage for component construction
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('IMMEDIATE User data from localStorage:', user);
        this.zone.run(() => {
          this.setUserData(user);
        });
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
      }
    }
  }

  loadUserData() {
    console.log('EditProfilePage loadUserData called');
    
    // Try to load from the current user in AuthService first
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      console.log('User data from AuthService:', currentUser);
      this.zone.run(() => {
        this.setUserData(currentUser);
      });
      return;
    }
    
    // Try to load from localStorage if not available in AuthService
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('User data from localStorage:', user);
        this.zone.run(() => {
          this.setUserData(user);
        });
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
      }
    } else {
      console.log('No user data found in localStorage');
    }
    
    // Subscribe to user data changes
    this.userSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        console.log('User data from subscription:', user);
        this.zone.run(() => {
          this.setUserData(user);
        });
      } else {
        console.log('No user data from subscription');
      }
    });
  }

  setUserData(user: any) {
    console.log('Setting user data:', 
      'firstName:', user.firstName || 'N/A',
      'lastName:', user.lastName || 'N/A', 
      'email:', user.email || 'N/A');
    
    // Use definitive assignment
    this.firstName = user['firstName'] || user.firstName || '';
    this.lastName = user['lastName'] || user.lastName || '';
    this.email = user['email'] || user.email || '';
    this.userId = user['id'] || user.id || '';
    this.profileImage = user['profileImage'] || user.profileImage || null;
    
    // Force change detection
    this.cdr.detectChanges();
    
    // Force UI update
    setTimeout(() => {
      console.log('Current UI values after update:', 
        'firstName:', this.firstName,
        'lastName:', this.lastName);
      this.cdr.detectChanges();
    }, 100);
  }

  navigateBack() {
    this.navCtrl.back();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Input event handlers with proper typing
  onFirstNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.firstName = input.value;
  }

  onLastNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.lastName = input.value;
  }

  async saveChanges() {
    if (!this.firstName || !this.lastName) {
      this.presentToast('First name and last name are required');
      return;
    }

    try {
      // Get current user data
      const currentUser = this.authService.currentUser;
      if (!currentUser) {
        this.presentToast('User data not found');
        return;
      }

      // Create updated user object
      const updatedUser = {
        ...currentUser,
        firstName: this.firstName,
        lastName: this.lastName,
        name: `${this.firstName} ${this.lastName}`,
        profileImage: this.profileImage
      };

      // Update user profile using the AuthService
      await this.authService.updateUserProfile(updatedUser);
      
      this.presentToast('Profile updated successfully');
      this.navigateBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      this.presentToast('Failed to update profile');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: message.includes('success') ? 'success' : 'danger'
    });
    toast.present();
  }
}
