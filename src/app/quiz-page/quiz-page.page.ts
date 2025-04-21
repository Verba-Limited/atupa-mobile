import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  fruitQuestions,
} from '../data/quizQuestions'; // Import the quiz questions from the data file
import { GameStateService } from '../services/game-state.service';

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
  currentLevel: any;
  currentQuestion: any = { categoryName: '' };
  answeredQuestions = new Set();
  userCumulativePoint = 0;
  totalLevelPoints = 0;
  overallTotalPoints = 0; // Track overall points from all categories
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
  questionIndex: number = 1;
  questionCompleted: boolean = false;
  isImageLoading: boolean = false;
  questionVisible: boolean = true;

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

  pageFrom: any;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private bgAudio: BackgroundAudioService,
    private activatedRouter: ActivatedRoute,
    private modalController: ModalController,
    private gameStateService: GameStateService
  ) {
    const page = this.activatedRouter.snapshot.paramMap.get('page');
    const levelNo = this.activatedRouter.snapshot.paramMap.get('level');
    const questionIndex =
      this.activatedRouter.snapshot.queryParamMap.get('index');
    const score = this.activatedRouter.snapshot.queryParamMap.get('score');
    console.log(`pageFrom: ${page}`);
    console.log(`levelNo: ${levelNo}`);
    console.log(`questionIndex: ${questionIndex}`);
    console.log(`score: ${score}`);
    if (page != null && levelNo != null) {
      this.currentLevel = levelNo;
      this.pageFrom = page;
      this.loadQuizQuestion(page, levelNo);
    }

    // Initialize the overall total points from the game state service
    this.overallTotalPoints = this.gameStateService.getTotalPoints();
    console.log(`Initial overall total points: ${this.overallTotalPoints}`);
  }

  ngOnInit() {
    this.bgAudio.play();
    this.isBgSoundPlaying = true;
    
    // Only call loadNextQuestion if not resuming from saved state
    if (!this.activatedRouter.snapshot.queryParamMap.has('index')) {
      // Reset these values for a fresh quiz
      this.answeredQuestions = new Set();
      this.questionIndex = 1;
      this.userCumulativePoint = 0;
      this.levelOption.userCumulativePoint = 0;
      
      this.shuffleQuestions();
      this.loadNextQuestion();
    }

    this.activatedRouter.queryParams.subscribe((params) => {
      const page = params['page'];
      const levelNo = params['level'];
      const questionIndex = params['index'];
      const score = params['score'];
      const previousScore = params['previousScore'];

      console.log(`pageFrom: ${page}`);
      console.log(`levelNo: ${levelNo}`);
      console.log(`questionIndex: ${questionIndex}`);
      console.log(`score: ${score}`);
      console.log(`previousScore: ${previousScore}`);

      if (page && levelNo) {
        this.pageFrom = page;
        this.currentLevel = +levelNo;
        this.questionIndex = +questionIndex || 1;
        this.loadQuizQuestion(page, levelNo);
        
        // Check if this is a continuation
        if (questionIndex) {
          // Try to load the saved game state to restore answered questions
          const savedState = this.gameStateService.getQuizState(page);
          if (savedState && savedState.answeredQuestions) {
            // Convert the array back to a Set
            this.answeredQuestions = new Set(savedState.answeredQuestions);
            console.log(`Restored ${this.answeredQuestions.size} answered questions from saved state`);
            
            // If there are no answered questions but we have a question index > 1,
            // we need to populate the answered questions based on the index
            if (this.answeredQuestions.size === 0 && +questionIndex > 1) {
              console.log(`No answered questions found but questionIndex is ${questionIndex}. Populating answered questions...`);
              // Mark questions as answered up to the current index
              for (let i = 0; i < +questionIndex - 1; i++) {
                if (i < this.quizQuestions.length) {
                  this.answeredQuestions.add(this.quizQuestions[i].id);
                }
              }
              console.log(`Populated ${this.answeredQuestions.size} answered questions`);
            }
          } else if (+questionIndex > 1) {
            // No saved state but questionIndex > 1, so populate answered questions
            console.log(`No saved state but questionIndex is ${questionIndex}. Populating answered questions...`);
            for (let i = 0; i < +questionIndex - 1; i++) {
              if (i < this.quizQuestions.length) {
                this.answeredQuestions.add(this.quizQuestions[i].id);
              }
            }
            console.log(`Populated ${this.answeredQuestions.size} answered questions`);
          }
        }
      }

      // Set the score from parameters
      this.questionIndex = questionIndex ? +questionIndex : 1;
      this.userCumulativePoint = score ? +score : 0;
      
      // Store the previous score that was already counted in the total
      const startingScore = previousScore ? +previousScore : 0;
      this.levelOption.userCumulativePoint = startingScore;
      
      console.log(`Initialized quiz with:
      - Current score: ${this.userCumulativePoint}
      - Previous score: ${this.levelOption.userCumulativePoint}
      - Question index: ${this.questionIndex}`);
      
      // Save this initial state to track points correctly
      this.saveGameState();

      if (
        this.quizQuestions.length > 0 &&
        this.questionIndex <= this.quizQuestions.length
      ) {
        const nextQuestion = this.quizQuestions[this.questionIndex - 1];
        console.log(`Loading question at index ${this.questionIndex - 1}:`, nextQuestion);
        
        // Handle image preloading for saved quiz state
        if (nextQuestion.picture) {
          this.isImageLoading = true;
          this.questionVisible = false;
          
          // Preload the image
          const img = new Image();
          img.onload = () => {
            this.currentQuestion = nextQuestion;
            this.isImageLoading = false;
            this.questionVisible = true;
            this.startTimer();
            console.log(`Image loaded, showing question: ${this.currentQuestion.question}`);
          };
          img.onerror = () => {
            console.error('Failed to load image:', nextQuestion.picture);
            this.currentQuestion = nextQuestion;
            this.isImageLoading = false;
            this.questionVisible = true;
            this.startTimer();
            console.log(`Image load failed, showing question: ${this.currentQuestion.question}`);
          };
          img.src = nextQuestion.picture;
        } else {
          // No image, proceed immediately
          this.currentQuestion = nextQuestion;
          this.questionVisible = true;
          this.startTimer();
          console.log(`No image, showing question: ${this.currentQuestion.question}`);
        }
      } else {
        console.warn('Invalid questionIndex or no questions available.');
        console.log(`Question index: ${this.questionIndex}, Quiz questions length: ${this.quizQuestions.length}`);
      }
    });
  }

  getQuestionLevel(questions: any, levelNumber: number) {
    return questions.filter((q: any) => q.levelNumber == levelNumber);
  }

  // get pageFrom and load quiz questions based on the page
  loadQuizQuestion(pageFrom: string, levelNumber: any = 1) {
    // Don't reset questions if we're continuing a saved quiz
    // We'll determine this by checking if there are params in the URL
    const isContinuing = this.activatedRouter.snapshot.queryParamMap.has('index');
    
    if (!isContinuing) {
      // Only reset the state when starting a new quiz
      this.answeredQuestions = new Set();
      this.questionIndex = 1;
      console.log('Starting new quiz - resetting question index to 1');
    } else {
      console.log('Continuing saved quiz - keeping existing state');
    }
    
    switch (pageFrom) {
      case 'onka':
        this.quizQuestions = this.getQuestionLevel(
          numberQuestions,
          levelNumber
        );
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
      case 'eso':
        this.quizQuestions = fruitQuestions;
        break;
      default:
        this.quizQuestions = numberQuestions;
        break;
    }
    
    // Calculate total level points after questions are loaded
    this.calculateTotalLevelPoints();
    console.log("Total level points calculated:", this.totalLevelPoints);
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
    // Clear any existing timer first to prevent multiple intervals
    this.stopTimer();
    
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

    // Hide current question while preparing the next one
    this.questionVisible = false;

    // Log the current state for debugging
    console.log(`Loading next question. Answered: ${this.answeredQuestions.size}/${this.quizQuestions.length}`);
    console.log(`Current points: ${this.userCumulativePoint}, Starting points: ${this.levelOption.userCumulativePoint}`);

    if (this.answeredQuestions.size < this.quizQuestions.length) {
      const nextQuestion = this.quizQuestions[this.answeredQuestions.size];
      
      // Pre-load image if there is one
      if (nextQuestion.picture) {
        this.isImageLoading = true;
        
        // Preload the image
        const img = new Image();
        img.onload = () => {
          // Image is loaded, now set the current question and show it
          this.currentQuestion = nextQuestion;
          this.answeredQuestions.add(this.currentQuestion.id);
          this.questionIndex = this.answeredQuestions.size; // Update index based on answered count
          this.questionCompleted = false;
          this.isImageLoading = false;
          this.questionVisible = true;
          this.startTimer();
          
          // Save state after each question loads
          this.saveGameState();
        };
        img.onerror = () => {
          // Handle image loading error
          console.error('Failed to load image:', nextQuestion.picture);
          this.currentQuestion = nextQuestion;
          this.answeredQuestions.add(this.currentQuestion.id);
          this.questionIndex = this.answeredQuestions.size; // Update index based on answered count
          this.questionCompleted = false;
          this.isImageLoading = false;
          this.questionVisible = true;
          this.startTimer();
          
          // Save state after each question loads
          this.saveGameState();
        };
        img.src = nextQuestion.picture;
      } else {
        // No image, proceed immediately
        this.currentQuestion = nextQuestion;
        this.answeredQuestions.add(this.currentQuestion.id);
        this.questionIndex = this.answeredQuestions.size; // Update index based on answered count
        this.questionCompleted = false;
        this.questionVisible = true;
        this.startTimer();
        
        // Save state after each question loads
        this.saveGameState();
      }
    } else {
      this.questionIndex = 1;
      this.questionCompleted = true;
      this.questionVisible = true;
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
    this.questionIndex = 1;
    this.answeredQuestions.clear();
    this.userCumulativePoint = 0;
    this.shuffleQuestions();
    this.loadNextQuestion();
  }

  getOptionKeys() {
    if (!this.currentQuestion || !this.currentQuestion.options) {
      return [];
    }
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

    // Check if this is the last question
    if (questionIndex === this.quizQuestions.length) {
      console.log('End of quiz for the level');
      // Add this question to answered questions to ensure completion state is detected
      if (!this.answeredQuestions.has(this.currentQuestion.id)) {
        this.answeredQuestions.add(this.currentQuestion.id);
      }
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

    // Mark this level as completed and unlock the next level
    this.gameStateService.completeLevel(currentLevel);
    
    console.log(`Adding ${this.userCumulativePoint} points from current quiz to total points`);
    
    // Save points using the new method - replaces all the direct calculation
    const newTotalPoints = this.ensurePointsSaved();
    
    // Update the service's value to match
    this.gameStateService.forceRefreshTotalPoints();
    this.overallTotalPoints = newTotalPoints;

    // Check if this was the final level for this category
    const maxLevelForCategory = this.gameStateService.getMaxLevelsForCategory(this.pageFrom);
    const isFinalLevel = currentLevel >= maxLevelForCategory;

    // Prepare level info regardless of destination
    this.levelOption.quizPage = this.pageFrom;
    this.levelOption.title = `Level ${currentLevel}`;
    this.levelOption.levelCompleted = currentLevel;
    this.levelOption.nextLevel = nextLevel;
    this.levelOption.totalQuestions = this.quizQuestions.length;
    this.levelOption.totalAnswered = this.answeredQuestions.size;
    this.levelOption.userCumulativePoint = this.userCumulativePoint;
    this.levelOption.totalLevelPoints = this.totalLevelPoints;
    this.levelOption.percentage =
      (this.levelOption.totalAnswered / this.levelOption.totalQuestions) * 100;

    // Save the game state with the current points before navigating
    this.saveGameState();

    console.log(`Level Option Object: ${JSON.stringify(this.levelOption)}`);
    console.log(`Is final level: ${isFinalLevel}, Current: ${currentLevel}, Max: ${maxLevelForCategory}`);

    this.modalOpen = false;
    this.isOptionSelected = false;

    if (isFinalLevel) {
      // Navigate to all-level page when final level is completed
      this.router.navigate([
        'all-level',
        { levelObject: JSON.stringify(this.levelOption) },
      ]);
    } else {
      // Next level exists, navigate to completed-level
      const nextLevelQuestions = this.quizQuestions.find(
        (q) => q.levelNumber === nextLevel
      );

      if (nextLevelQuestions) {
        this.navCtrl.navigateForward(`/completed-level/${nextLevel}`);
      } else {
        this.router.navigate([
          'completed-level',
          { levelObject: JSON.stringify(this.levelOption) },
        ]);
      }
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
            console.log('You picked yes');
            
            // Save the game state first
            this.saveGameState();
            
            // Save points using the new method - replaces all the direct calculation
            this.ensurePointsSaved();
            
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
            console.log('You picked no');
          },
        },
      ],
    });

    await alert.present();
  }

  saveGameState() {
    // Calculate total points before saving to ensure it's current
    this.calculateTotalLevelPoints();
    
    // Get the latest overall total points
    this.overallTotalPoints = this.gameStateService.getTotalPoints();
    
    // Log the values being saved
    console.log(`SAVE STATE: Category: ${this.pageFrom}, Level: ${this.currentLevel}`);
    console.log(`SAVE STATE: Current points: ${this.userCumulativePoint}, Initial points: ${this.levelOption.userCumulativePoint}`);
    console.log(`SAVE STATE: Questions answered: ${this.answeredQuestions.size}/${this.quizQuestions.length}`);
    console.log(`SAVE STATE: Question index: ${this.questionIndex}`);
    
    const gameState = {
      quizQuestions: this.quizQuestions,
      currentQuestion: this.currentQuestion,
      currentLevel: this.currentLevel,
      answeredQuestions: Array.from(this.answeredQuestions),
      userCumulativePoint: this.userCumulativePoint,
      totalLevelPoints: this.totalLevelPoints,
      questionIndex: this.questionIndex,
      pageFrom: this.pageFrom,
      overallTotalPoints: this.overallTotalPoints,
      // Save the initial score for this category - what was already counted in totalPoints
      previousScore: this.levelOption.userCumulativePoint,
      // Add timestamp to help with debugging
      savedAt: new Date().toISOString()
    };

    this.gameStateService.updateGameState(gameState);
    console.log(`Game state saved for ${this.pageFrom}`);
  }

  // Ensure points are saved to localStorage just before navigation
  ensurePointsSaved() {
    // Get existing points from localStorage
    const existingPoints = localStorage.getItem('totalPoints');
    const currentStoredPoints = existingPoints ? parseInt(existingPoints) : 0;
    
    // Get the starting score for this category
    const previousScore = this.levelOption.userCumulativePoint || 0;
    
    // Calculate new points earned in this session only
    const newPointsEarned = Math.max(0, this.userCumulativePoint - previousScore);
    
    // Detailed console logging for debugging
    console.log('--------- POINTS CALCULATION ---------');
    console.log(`Current total in localStorage: ${currentStoredPoints}`);
    console.log(`Previous score for this category: ${previousScore}`);
    console.log(`Current score for this category: ${this.userCumulativePoint}`);
    console.log(`New points earned this session: ${newPointsEarned}`);
    
    // Calculate the new total - only add the new points earned in this session
    const newTotalPoints = currentStoredPoints + newPointsEarned;
    console.log(`New total points to save: ${newTotalPoints}`);
    
    // Save to localStorage with a timestamp for verification
    const timestamp = new Date().getTime();
    localStorage.setItem('totalPoints', newTotalPoints.toString());
    localStorage.setItem('pointsLastUpdated', timestamp.toString());
    
    // Update stored value for next session
    this.levelOption.userCumulativePoint = this.userCumulativePoint;
    
    console.log(`Saved points to localStorage: ${newTotalPoints} at ${timestamp}`);
    console.log('--------------------------------------');
    
    return newTotalPoints;
  }
}
