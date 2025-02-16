import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class QuizPage {
  constructor(private router: Router) {}

  levelsPage(pageName: string) {
    this.router.navigate(['/levels', { page: pageName }]);
  }
  // erankoPage() {
  //   this.router.navigate(['/eranko-quiz']);
  // }
  // owePage() {
  //   this.router.navigate(['/owe-page']);
  // }

}
