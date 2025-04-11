import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-completed-level',
  templateUrl: './completed-level.page.html',
  styleUrls: ['./completed-level.page.scss'],
  imports: [IonicModule, FormsModule],
  standalone: true,
})
export class CompletedLevelPage {
  levelObject: any = {
    title: '',
    levelCompleted: 0,
    totalQuestions: 0,
    totalAnswered: 0,
    totalLevelPoints: 0,
    userCumulativePoint: 0,
    percentage: 0,
  };
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.levelObject = {};
    let retrievedLevelObject =
      this.activatedRoute.snapshot.paramMap.get('levelObject');
    if (retrievedLevelObject != null) {
      this.levelObject = JSON.parse(retrievedLevelObject);
    }
    console.log(`Level Object: ${JSON.stringify(this.levelObject)}`);
  }

  ngOnInit() {
    console.log('level title: ' + this.levelObject.title);
  }

  alllevelPage() {
    this.router.navigate(['/all-level']);
  }

  goToNextLevel(page: any, nextLevel: any) {
    this.router.navigate(['/quiz-page', { page: page, level: nextLevel }]);
  }

  goToHome() {
    this.router.navigate(['/tabs/home-tab']);
  }
}
