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

  categories = [
      {
        "id": "1",
        "name": "Onka",
        "description": "Numbers in Yoruba",
        "picture": "https://example.com/images/onka.png",
        "maxPoints": 1000
      },
      {
        "id": "2",
        "name": "Owe",
        "description": "Yoruba Proverbs",
        "picture": "https://example.com/images/owe.png",
        "maxPoints": 1200
      },
      {
        "id": "3",
        "name": "Eranko",
        "description": "Animals in Yoruba",
        "picture": "https://example.com/images/eranko.png",
        "maxPoints": 900
      }
  ]

  levelsPage() {
    this.router.navigate(['/levels']);
  }
}
