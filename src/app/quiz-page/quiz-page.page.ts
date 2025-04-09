import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Platform,
  IonicModule,
  NavController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import type { OverlayEventDetail } from '@ionic/core';

import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { filter } from 'rxjs/operators';
import { BackgroundAudioService } from '../services/background-audio.service';

import {
  numberQuestions,
  animalQuestions,
  kingsQuestions,
  proverbsQuestions,
  townsQuestions,
} from '../data/quizQuestions'; // Import the quiz questions from the data file

interface QuizQuestion {
  id: string;
  categoryId: string;
  levelNumber: number;
  questionNumber: number;
  question: string;
  options: { [key: string]: string };
  answer: string;
  explanation: string;
  picture: any;
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
  quizQuestions: QuizQuestion[] = [];

  currentQuestion: any;
  answeredQuestions = new Set();
  userCumulativePoint = 0;
  totalLevelPoints = 0;
  timer = 10;
  selectedAnswer: any;
  levelCompleted = false;
  timerInterval: any;
  modalOpen: boolean = false;
  isOptionSelected: boolean = false;
  selectedFeedbackImage: string = '';
  feedbackFadeOut: boolean = false;
  correctOption: boolean = false;
  wrongAnswer: any;
  showFeedback: boolean = false;

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

  overlayItems: any = [
    {
      icon: '../../assets/icon/dots.svg',
      title: 'Ileke',
      slug: 'ileke',
      subtitle: 'yaa meji',
      badge: '3',
    },
    {
      icon: '../../assets/icon/dots.svg',
      title: 'Obi',
      slug: 'obi',
      subtitle: 'yaa onka',
      badge: '2',
    },
    {
      icon: '../../assets/icon/dots.svg',
      title: 'Eyo Owo',
      slug: 'eyoOwo',
      subtitle: 'idahun',
      badge: '1',
    },
    {
      icon: '../../assets/icon/dots.svg',
      title: 'Ami',
      slug: 'ami',
      subtitle: 'alaye',
      badge: '4',
    },
  ];

  isBgSoundPlaying: boolean = true;

  levelOption = {
    title: '',
    levelCompleted: 0,
    totalQuestions: 0,
    totalAnswered: 0,
    totalLevelPoints: 0,
    userCumulativePoint: 0,
    percentage: 0,
  };

  pageFrom: any;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private bgAudio: BackgroundAudioService,
    private activatedRouter: ActivatedRoute,
    private modalController: ModalController
  ) {
    const page = this.activatedRouter.snapshot.paramMap.get('page');
    const levelNo = this.activatedRouter.snapshot.paramMap.get('level');
    console.log(`pageFrom: ${page}`);
    console.log(`levelNo: ${levelNo}`);
    if (page != null && levelNo != null) {
      this.pageFrom = page;
      this.loadQuizQuestion(page, levelNo);
      // this.goToPage(page);
    }
  }

  ngOnInit() {
    this.bgAudio.play();
    this.isBgSoundPlaying = true;
    this.shuffleQuestions();
    this.loadNextQuestion();
    this.calculateTotalLevelPoints();
  }

  getQuestionLevel(questions: any, levelNumber: number) {
    return questions.filter((q: any) => q.levelNumber == levelNumber);
  }

  // get pageFrom and load quiz questions based on the page
  loadQuizQuestion(pageFrom: string, levelNumber: any=1) {
    switch (pageFrom) {
      case 'onka':
        this.quizQuestions = this.getQuestionLevel(numberQuestions, levelNumber);
        break;
      case 'eranko':
        this.quizQuestions = animalQuestions;
        break;
      case 'oba-ilu':
        this.quizQuestions = kingsQuestions;
        break;
      case 'owe':
        this.quizQuestions = proverbsQuestions;
        break;
      case 'ilu':
        this.quizQuestions = townsQuestions;
        break;
      default:
        this.quizQuestions = numberQuestions;
        break;
    }
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
    this.totalLevelPoints = this.quizQuestions.reduce(
      (sum, q) => sum + q.points,
      0
    );
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
    this.usedSuggestions = {
      ileke: false,
      obi: false,
      eyoOwo: false,
      ami: false,
    };

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

  correctImages: string[] = [
    '../../assets/icon/rightone.svg',
    '../../assets/icon/righttwo.svg',
  ];
  wrongImages: string[] = [
    '../../assets/icon/wrongone.svg',
    '../../assets/icon/wrongtwo.svg',
  ];

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
    console.log('Navigating back');
    // this.navCtrl.back();
    // this.modalOpen = false;
    this.showOptions();
  }

  selectOption(selectedOption: any, questionIndex: number) {
    // console.log(`questionIndex: ${questionIndex}`);
    this.isOptionSelected = true;
    this.feedbackFadeOut = false;
    this.showFeedback = true;
    this.answerQuestion(selectedOption);

    const correctAnswer = this.currentQuestion.answer;
    let newImage: string;

    if (selectedOption === correctAnswer) {
      do {
        newImage =
          this.correctImages[
            Math.floor(Math.random() * this.correctImages.length)
          ];
      } while (
        newImage === this.selectedFeedbackImage &&
        this.selectedFeedbackImage.length > 1
      );
    } else {
      do {
        newImage =
          this.wrongImages[Math.floor(Math.random() * this.wrongImages.length)];
      } while (
        newImage === this.selectedFeedbackImage &&
        this.wrongImages.length > 1
      );
    }

    this.selectedFeedbackImage = newImage;

    if (questionIndex == this.quizQuestions.length) {
      console.log('End of quiz for the level');
      this.evaluateLevelProgress();
    }

    this.modalOpen = false;

    setTimeout(() => {
      this.feedbackFadeOut = true;
    }, 3000);

    setTimeout(() => {
      this.modalOpen = true;
      this.showFeedback = false;
    }, 3000);
  }

  goToNextLevel() {
    this.stopBackgroundAudio();

    if (!this.currentQuestion) return;

    const currentLevel = this.currentQuestion.levelNumber;
    const nextLevel = currentLevel + 1;

    const nextLevelQuestions = this.quizQuestions.find(
      (q) => q.levelNumber === nextLevel
    );

    console.log(`nextLevelQuestions: ${nextLevelQuestions}`);

    this.levelOption.title = `Level ${currentLevel}`;
    this.levelOption.levelCompleted = currentLevel;
    this.levelOption.totalQuestions = this.quizQuestions.length;
    this.levelOption.totalAnswered = this.answeredQuestions.size;
    this.levelOption.userCumulativePoint = this.userCumulativePoint;
    this.levelOption.totalLevelPoints = this.totalLevelPoints;
    this.levelOption.percentage =
      (this.levelOption.totalAnswered / this.levelOption.totalQuestions) * 100;

    console.log(`Level Option Object: ${JSON.stringify(this.levelOption)}`);

    if (nextLevelQuestions) {
      this.isOptionSelected = false;
      this.modalOpen = false;
      this.navCtrl.navigateForward(`/completed-level/${nextLevel}`);
    } else {
      this.modalOpen = false;
      this.isOptionSelected = false;
      this.router.navigate([
        'completed-level',
        { levelObject: JSON.stringify(this.levelOption) },
      ]);
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

  disableSuggestion(slug: 'ileke' | 'obi' | 'eyoOwo' | 'ami') {
    return (
      this.usedSuggestions[slug] ||
      this.userCumulativePoint < this.suggestionCosts[slug]
    );
  }

  removeIncorrectOptions(count: number) {
    let incorrectOptions = Object.keys(this.currentQuestion.options).filter(
      (opt) => opt !== this.currentQuestion.answer
    );
    incorrectOptions = incorrectOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    incorrectOptions.forEach((opt) => delete this.currentQuestion.options[opt]);
  }

  openModal() {
    this.modalOpen = true;
  }

  handleModalDismiss() {
    this.modalOpen = false;
  }

  async ionViewWillLeave() {
    const modal = await this.modalController.getTop();
    if (modal) {
      await modal.dismiss();
    }
    this.modalOpen = false;
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

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  setResult(event: CustomEvent<OverlayEventDetail>) {
    console.log(`Dismissed with role: ${event.detail.role}`);
  }

  async showOptions() {
    this.stopTimer();
    const alert = await this.alertController.create({
      header: 'Quiz Game?',
      message: 'Are you sure you want to leave the quiz?',
      buttons: [
        {
          text: 'Yes',
          role: 'cancel',
          handler: () => {
            console.log('Declined the offer');
            this.isOptionSelected = false;
            this.handleModalDismiss();
            this.stopBackgroundAudio();
            this.bgAudio.stop();
            this.router.navigate(['/tabs/home-tab']);
          },
        },
        {
          text: 'No',
          handler: () => {
            this.startTimer();
            console.log('Accepted the offer');
          },
        },
      ],
    });

    await alert.present();
  }
}
