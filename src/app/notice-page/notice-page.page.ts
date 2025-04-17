import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface Badge {
  id: number;
  title: string;
  imageSrc: string;
  unlocked: boolean;
}
@Component({
  selector: 'app-notice-page',
  templateUrl: './notice-page.page.html',
  styleUrls: ['./notice-page.page.scss'],
  imports: [FormsModule, IonicModule, CommonModule],
  standalone: true,
})
export class NoticePagePage implements OnInit {
  returnTo: string = '/tabs/home-tab'; // Default return path
  navigating: boolean = false; // To prevent multiple clicks
  
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private location: Location
  ) {
    // Get return route from router state if available
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { returnTo: string };
      if (state.returnTo) {
        this.returnTo = state.returnTo;
      }
    }
  }

  navigateBack(event?: Event) {
    // Prevent event propagation to avoid multiple clicks
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Prevent multiple navigation attempts
    if (this.navigating) return;
    this.navigating = true;
    
    console.log('Navigating back to:', this.returnTo);
    
    // Use a simple approach - direct navigation
    this.router.navigateByUrl(this.returnTo, { replaceUrl: true });
  }

  ngOnInit() {}

  badges = [
    {
      id: 1,
      imageSrc: '../../assets/icon/receipt 1.svg',
      title: 'Subscription : Get a monthly plan for 20% discount rate',
    },
    {
      id: 2,
      imageSrc: '../../assets/icon/receipt 1.svg',
      title: 'Subscription : You have 3 days left renew your subscription ',
    },
    {
      id: 3,
      imageSrc: '../../assets/icon/book-open 2.svg',
      title: 'Lesson : Another lesson has been added, name is apejuwe ',
    },
    {
      id: 4,
      imageSrc: '../../assets/icon/file-pen 1.svg',
      title: 'Quiz : Try new excited owe quiz to understand learn yoruba  ',
    },
  ];
}
