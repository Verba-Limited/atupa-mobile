import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

export interface Option {
  id: string;
  label: string;
  isChecked?: boolean;
}

interface QuizQuestion {
  id: string;
  categoryId: string;
  levelNumber: number;
  questionNumber: number;
  question: string;
  options: { [key: string]: string };
  answer: string;
  explanation: string;
  picture: string;
  points: number;
}

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.page.html',
  styleUrls: ['./quiz-page.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true, // If using standalone components
})
export class QuizPagePage {

  quizQuestions: QuizQuestion[] = [
    {
      "id": "101",
      "categoryId": "1",
      "levelNumber": 1,
      "questionNumber": 1,
      "question": "Kini 1 ni Yoruba?",
      "options": {
        "option1": "Mefa",
        "option2": "Okan",
        "option3": "Marun",
        "option4": "Meji"
      },
      "answer": "option2",
      "explanation": "1 in Yoruba is 'Okan'.",
      "picture": "https://example.com/images/question_101.png",
      "points": 10
    },
    {
      "id": "102",
      "categoryId": "1",
      "levelNumber": 1,
      "questionNumber": 2,
      "question": "Kini 5 ni Yoruba?",
      "options": {
        "option1": "Marun",
        "option2": "Mefa",
        "option3": "Meje",
        "option4": "Merin"
      },
      "answer": "option1",
      "explanation": "5 in Yoruba is 'Marun'.",
      "picture": "https://example.com/images/question_102.png",
      "points": 10
    },
    {
      "id": "103",
      "categoryId": "1",
      "levelNumber": 1,
      "questionNumber": 3,
      "question": "Kini 10 ni Yoruba?",
      "options": {
        "option1": "Mewa",
        "option2": "Mejo",
        "option3": "Meje",
        "option4": "Mefa"
      },
      "answer": "option1",
      "explanation": "10 in Yoruba is 'Mewa'.",
      "picture": "https://example.com/images/question_103.png",
      "points": 10
    },
    {
      "id": "104",
      "categoryId": "1",
      "levelNumber": 1,
      "questionNumber": 4,
      "question": "Kini 20 ni Yoruba?",
      "options": {
        "option1": "Mewa",
        "option2": "Ogun",
        "option3": "Mokanla",
        "option4": "Okan"
      },
      "answer": "option2",
      "explanation": "20 in Yoruba is 'Ogun'.",
      "picture": "https://example.com/images/question_104.png",
      "points": 10
    },
    {
      "id": "105",
      "categoryId": "1",
      "levelNumber": 1,
      "questionNumber": 5,
      "question": "Kini 50 ni Yoruba?",
      "options": {
        "option1": "Ogota",
        "option2": "Ogbon",
        "option3": "Aadorun",
        "option4": "Ogofa"
      },
      "answer": "option3",
      "explanation": "50 in Yoruba is 'Aadorun'.",
      "picture": "https://example.com/images/question_105.png",
      "points": 10
    },
    {
      "id": "106",
      "categoryId": "1",
      "levelNumber": 1,
      "questionNumber": 6,
      "question": "Kini 100 ni Yoruba?",
      "options": {
        "option1": "Ogorun",
        "option2": "Ogun",
        "option3": "Ogota",
        "option4": "Aadorun"
      },
      "answer": "option1",
      "explanation": "100 in Yoruba is 'Ogorun'.",
      "picture": "https://example.com/images/question_106.png",
      "points": 10
    },
    {
      "id": "107",
      "categoryId": "1",
      "levelNumber": 1,
      "questionNumber": 7,
      "question": "Kini 200 ni Yoruba?",
      "options": {
        "option1": "Odogun",
        "option2": "Eedegbeta",
        "option3": "Eedegberun",
        "option4": "Eedegbeta"
      },
      "answer": "option2",
      "explanation": "200 in Yoruba is 'Eedegbeta'.",
      "picture": "https://example.com/images/question_107.png",
      "points": 10
    },
    {
      "id": "108",
      "categoryId": "1",
      "levelNumber": 1,
      "questionNumber": 8,
      "question": "Kini 500 ni Yoruba?",
      "options": {
        "option1": "Eedegberun",
        "option2": "Eedegbeta",
        "option3": "Eedegbon",
        "option4": "Eedegta"
      },
      "answer": "option3",
      "explanation": "500 in Yoruba is 'Eedegbon'.",
      "picture": "https://example.com/images/question_108.png",
      "points": 10
    },
    {
      "id": "109",
      "categoryId": "1",
      "levelNumber": 1,
      "questionNumber": 9,
      "question": "Kini 1000 ni Yoruba?",
      "options": {
        "option1": "Egbewa",
        "option2": "Eedegberun",
        "option3": "Eedegbon",
        "option4": "Eedegta"
      },
      "answer": "option2",
      "explanation": "1000 in Yoruba is 'Eedegberun'.",
      "picture": "https://example.com/images/question_109.png",
      "points": 10
    },
    {
      "id": "110",
      "categoryId": "1",
      "levelNumber": 1,
      "questionNumber": 10,
      "question": "Kini 10,000 ni Yoruba?",
      "options": {
        "option1": "Egbewa",
        "option2": "Eedegberun",
        "option3": "Egbeta",
        "option4": "Egbeta"
      },
      "answer": "option1",
      "explanation": "10,000 in Yoruba is 'Egbewa'.",
      "picture": "https://example.com/images/question_110.png",
      "points": 10
    }
  ];

  currentQuestion: any;
  answeredQuestions = new Set();
  userCumulativePoint = 0;
  totalLevelPoints = 0;
  timer = 10;
  selectedAnswer: any;
  levelCompleted = false;
  timerInterval: any;

  constructor(private navCtrl: NavController, private router: Router) {}

  ngOnInit() {
    this.shuffleQuestions();
    this.loadNextQuestion();
    this.calculateTotalLevelPoints();
  }

  shuffleQuestions() {
    this.quizQuestions = this.quizQuestions.sort(() => Math.random() - 0.5);
  }

  calculateTotalLevelPoints() {
    this.totalLevelPoints = this.quizQuestions.reduce((sum, q) => sum + q.points, 0);
  }

  startTimer() {
    this.timer = 10;
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.stopTimer();
        this.loadNextQuestion();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  loadNextQuestion() {
    this.stopTimer();
    this.selectedAnswer = null;

    if (this.answeredQuestions.size < this.quizQuestions.length) {
      this.currentQuestion = this.quizQuestions[this.answeredQuestions.size];
      this.answeredQuestions.add(this.currentQuestion.id);
      this.startTimer();
    } else {
      this.evaluateLevelProgress();
    }
  }

  answerQuestion(option: string) {
    if (!this.selectedAnswer) {
      this.selectedAnswer = option;
      this.stopTimer();

      if (option === this.currentQuestion.answer) {
        this.userCumulativePoint += this.currentQuestion.points;
      }
    }
  }

  evaluateLevelProgress() {
    const requiredScore = this.totalLevelPoints * 0.7;
    this.levelCompleted = this.userCumulativePoint >= requiredScore;
  }

  resetLevel() {
    this.answeredQuestions.clear();
    this.userCumulativePoint = 0;
    this.shuffleQuestions();
    this.loadNextQuestion();
  }

  getOptionKeys() {
      return Object.keys(this.currentQuestion.options);
  }


  isOptionSelected: boolean = false;
  navigateBack() {
    this.navCtrl.back(); // Navigate to the previous page
  }
  // Initialize options with isChecked = false
  // options: Option[] = [
  //   { id: 'option1', label: '643', isChecked: false },
  //   { id: 'option2', label: '340', isChecked: false },
  //   { id: 'option3', label: '343', isChecked: false },
  //   { id: 'option4', label: '443', isChecked: false },
  // ];

  // Called when an option is clicked
  // selectOption(selectedOption: Option) {
  //   // Uncheck all options
  //   this.options.forEach((option) => (option.isChecked = false));
  //   // Check the selected one
  //   selectedOption.isChecked = true;
  //   // Show the next div, etc.
  //   this.isOptionSelected = true;
  // }

  selectOption(selectedOption: any) {
    console.log("selected option--->", selectedOption);
    // Uncheck all options
    this.currentQuestion.options.forEach((option: any) => (option.isChecked = false));
    // Check the selected one
    // selectedOption.isChecked = true;
    // Show the next div, etc.
    this.isOptionSelected = true;
  }

}
