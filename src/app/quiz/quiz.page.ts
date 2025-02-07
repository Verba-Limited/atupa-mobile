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

  levelsPage() {
    this.router.navigate(['/levels']);
  }
  erankoPage() {
    this.router.navigate(['/eranko-quiz']);
  }
}
