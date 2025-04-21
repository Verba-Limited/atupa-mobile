import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ShopModalComponent } from '../shop-modal/shop-modal.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-level',
  templateUrl: './all-level.page.html',
  styleUrls: ['./all-level.page.scss'],
  imports: [IonicModule, FormsModule],
  standalone: true,
})
export class AllLevelPage implements OnInit {
  levelObject: any = {
    quizPage: '',
    title: '',
    levelCompleted: 0,
    totalQuestions: 0,
    totalAnswered: 0,
    totalLevelPoints: 0,
    userCumulativePoint: 0,
    percentage: 0,
    nextLevel: 0,
  };
  
  constructor(
    private modalCntl: ModalController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // Retrieve level data from route params
    const retrievedLevelObject = this.activatedRoute.snapshot.paramMap.get('levelObject');
    if (retrievedLevelObject) {
      this.levelObject = JSON.parse(retrievedLevelObject);
      console.log('Received level data:', this.levelObject);
    }
  }

  async openShopModal() {
    const modal = await this.modalCntl.create({
      component: ShopModalComponent,
      cssClass: 'custom-shop-modal',
      backdropDismiss: true,
      showBackdrop: true,
    });
    await modal.present();
  }
  
  goToHomepage() {
    this.router.navigate(['/tabs/home-tab']);
  }
  
  backToLevels() {
    // Navigate back to the levels page with the current category
    if (this.levelObject && this.levelObject.quizPage) {
      this.router.navigate(['/levels', { page: this.levelObject.quizPage }]);
    } else {
      // Fallback if no quiz page info
      this.navCtrl.back();
    }
  }
}
