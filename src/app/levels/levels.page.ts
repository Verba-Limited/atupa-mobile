import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.page.html',
  styleUrls: ['./levels.page.scss'],
  // standalone: true,
  imports: [IonicModule],
})
export class LevelsPage {
  pageFrom: any;
  constructor(
    private navCtrl: NavController, 
    private router: Router, 
    private activatedRouter: ActivatedRoute) {
      const page = this.activatedRouter.snapshot.paramMap.get('page');
      if (page != null) {
        this.pageFrom = page;
        // this.goToPage(page);
      } 
  }

  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }

  quizPage() {
    this.router.navigate(['/quiz-page']);
  }

  goToPage (page: string) {
    this.router.navigate(['/quiz-page', { page: page }]);
  }

  // goToPage (page: string) {
  //   switch (page) {
  //     case 'onka':
  //       this.router.navigate(['/quiz-page', { page: page }]);
  //       break;
  //     case 'eranko':
  //       this.router.navigate(['/quiz-page', { page: page }]);
  //       // this.router.navigate(['/eranko-quiz']);
  //       break;
  //     case 'owe':
  //       this.router.navigate(['/quiz-page', { page: page }]);
  //       break;
  //     case 'oba-ilu':
  //       this.router.navigate(['/quiz-page', { page: page }]);
  //       break;
  //     case 'ilu':
  //       this.router.navigate(['/quiz-page', { page: page }]);
  //       break;
  //     case 'akanlo-ede':
  //       this.router.navigate(['/akanlo-ede']);
  //       break;
  //     case 'apejuwe':
  //       this.router.navigate(['/apejuwe']);
  //       break;
  //     default:
  //       this.router.navigate(['/home']);
  //       break;
  //   }
  // }

}
