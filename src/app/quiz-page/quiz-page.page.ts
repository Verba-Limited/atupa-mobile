import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Platform, IonicModule, NavController } from '@ionic/angular';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { BackgroundAudioService } from '../services/background-audio.service';

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

  isOptionSelected: boolean = false;

  correctOption: boolean = false;
  wrongAnswer: any;

  questionIndex: number = 0;

  questionCompleted: boolean = false;

  suggestionCosts: Record<'ileke' | 'obi' | 'eyoOwo' | 'ami', number> = {
    ileke: 10,
    obi: 5,
    eyoOwo: 20,
    ami: 15,
  };
  
  usedSuggestions: Record<'ileke' | 'obi' | 'eyoOwo' | 'ami', boolean> = {
    ileke: false,
    obi: false,
    eyoOwo: false,
    ami: false,
  };
  
  isBgSoundPlaying: boolean = true;

  levelOption = {
    title: '',
    levelCompleted: 0,
    totalQuestions: 0,
    totalAnswered: 0,
    totalLevelPoints: 0,
    userCumulativePoint: 0,
    percentage: 0,
  }

  constructor(private navCtrl: NavController, 
    private router: Router, 
    private platform: Platform, 
    private bgAudio: BackgroundAudioService) {
  }

  ngOnInit() {
    this.bgAudio.play();
    this.isBgSoundPlaying = true;
    this.shuffleQuestions();
    this.loadNextQuestion();
    this.calculateTotalLevelPoints();
  }

  stopBackgroundAudio() {
    this.isBgSoundPlaying = false;
    this.bgAudio.stop();
  }

  playBackgroundAudio() {
    this.isBgSoundPlaying = true;
    this.bgAudio.play();
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
    this.isOptionSelected = false;
    this.usedSuggestions = { ileke: false, obi: false, eyoOwo: false, ami: false };

    // console.log(`answeredQuestions size: ${this.answeredQuestions.size}`);
    // console.log(`quizQuestions length: ${this.quizQuestions.length}`);
    // console.log(`answeredQuestions < quizQuestions : ${this.answeredQuestions.size < this.quizQuestions.length}`);

    if (this.answeredQuestions.size < this.quizQuestions.length) {
      this.currentQuestion = this.quizQuestions[this.answeredQuestions.size];
      this.answeredQuestions.add(this.currentQuestion.id);
      this.startTimer();
      this.questionIndex++;
      this.questionCompleted = false;
    } else {
      this.questionIndex = 0;
      this.questionCompleted = true;
      this.evaluateLevelProgress();
    }
  }

  answerQuestion(option: string) {
    if (!this.selectedAnswer) {
      this.selectedAnswer = option;
      this.stopTimer();

      if (option === this.currentQuestion.answer) {
        this.userCumulativePoint += this.currentQuestion.points;
        this.correctOption = true;
      } else {
        this.correctOption = false;
        this.wrongAnswer = this.selectedAnswer;
      }
    }
  }

  evaluateLevelProgress() {
    const requiredScore = this.totalLevelPoints * 0.5;
    this.levelCompleted = this.userCumulativePoint >= requiredScore;
    console.log(`Total Level Point: ${this.totalLevelPoints}`);
    console.log(`requiredScore: ${requiredScore}`);
    console.log(`levelCompleted: ${this.levelCompleted}`);
  }

  resetLevel() {
    this.questionIndex = 0;
    this.answeredQuestions.clear();
    this.userCumulativePoint = 0;
    this.shuffleQuestions();
    this.loadNextQuestion();
  }

  getOptionKeys() {
    return Object.keys(this.currentQuestion.options);
  }

  navigateBack() {
    this.navCtrl.back();
  }

  selectOption(selectedOption: any, questionIndex: number) {
    // console.log(`questionIndex: ${questionIndex}`);
    this.isOptionSelected = true;
    this.answerQuestion(selectedOption);
    if(questionIndex == this.quizQuestions.length) {
      console.log('End of quiz for the level');
      this.evaluateLevelProgress();
    }
  }

  goToNextLevel() {
    if (!this.currentQuestion) return;

    const currentLevel = this.currentQuestion.levelNumber;
    const nextLevel = currentLevel + 1;

    const nextLevelQuestions = this.quizQuestions.find(q => q.levelNumber === nextLevel);

    console.log(`nextLevelQuestions: ${nextLevelQuestions}`);

    this.levelOption.title = `Level ${currentLevel}`;
    this.levelOption.levelCompleted = currentLevel;
    this.levelOption.totalQuestions = this.quizQuestions.length;
    this.levelOption.totalAnswered = this.answeredQuestions.size;
    this.levelOption.userCumulativePoint = this.userCumulativePoint;
    this.levelOption.totalLevelPoints = this.totalLevelPoints;
    this.levelOption.percentage = (this.levelOption.totalAnswered / this.levelOption.totalQuestions) * 100;

    console.log(`Level Option Object: ${JSON.stringify(this.levelOption)}`);

    if (nextLevelQuestions) {
      this.navCtrl.navigateForward(`/completed-level/${nextLevel}`);
    } else {
      this.router.navigate(['completed-level', {levelObject: JSON.stringify(this.levelOption)}]);
      // this.navCtrl.navigateForward('/completed-level');
    }
  }
  
  useSuggestion(type: 'ileke' | 'obi' | 'eyoOwo' | 'ami') {
    if (this.userCumulativePoint < this.suggestionCosts[type]) return;
  
    this.userCumulativePoint -= this.suggestionCosts[type];
    this.usedSuggestions[type] = true;
  
    switch (type) {
      case 'ileke':
        this.removeIncorrectOptions(2);
        break;
      case 'obi':
        this.removeIncorrectOptions(1);
        break;
      case 'eyoOwo':
        this.isOptionSelected = true;
        this.answerQuestion(this.currentQuestion.answer);
        break;
      case 'ami':
        alert(`Hint: ${this.currentQuestion.explanation}`);
        break;
    }
  }
  
  removeIncorrectOptions(count: number) {
    let incorrectOptions = Object.keys(this.currentQuestion.options).filter(opt => opt !== this.currentQuestion.answer);
    incorrectOptions = incorrectOptions.sort(() => Math.random() - 0.5).slice(0, count);
  
    incorrectOptions.forEach(opt => delete this.currentQuestion.options[opt]);
  }

  // Text to Speech Section
  async speakText(text: string) {
    try {
      if (this.platform.is('capacitor')) {
        await this.nativeSpeechSynthesis(text);
      } else {
        await this.webSpeechSynthesis(text);
      }
      console.log('Text spoken successfully');
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  }
  private async nativeSpeechSynthesis(text: string) {
    await TextToSpeech.speak({
      text: text,
      lang: 'en-US',
      rate: 3.0,
      pitch: 2.0,
    });
  }
  private async webSpeechSynthesis(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'yo';
    window.speechSynthesis.speak(utterance);
  }
  // End Text to Speech Section

}
