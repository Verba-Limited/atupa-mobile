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
  ToastController,
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

// Define a type for overlay items for better type checking
interface OverlayItem {
  icon: string;
  title: string;
  slug: 'ileke' | 'obi' | 'eyoOwo' | 'ami';
  subtitle: string;
  badge: number;
}

// Define a type for badge counts
interface BadgeCounts {
  ileke?: number;
  obi?: number;
  eyoOwo?: number;
  ami?: number;
  [key: string]: number | undefined;
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

  overlayItems: OverlayItem[] = [
    {
      icon: '../../assets/icon/dots.svg',
      title: 'Ileke',
      slug: 'ileke',
      subtitle: 'din meji',
      badge: 3,
    },
    {
      icon: '../../assets/icon/almond 1.svg',
      title: 'Obi',
      slug: 'obi',
      subtitle: 'din okan',
      badge: 2,
    },
    {
      icon: '../../assets/icon/coweries.svg',
      title: 'Eyo',
      slug: 'eyoOwo',
      subtitle: 'idahun',
      badge: 1,
    },
    {
      icon: '../../assets/icon/more 1.svg',
      title: 'Ami',
      slug: 'ami',
      subtitle: 'alaye',
      badge: 4,
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

  // Add audio properties to hold the sound effects
  private correctSound: HTMLAudioElement;
  private wrongSound: HTMLAudioElement;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private bgAudio: BackgroundAudioService,
    private activatedRouter: ActivatedRoute,
    private modalController: ModalController,
    private gameStateService: GameStateService,
    private toastController: ToastController
  ) {
    // Don't set initial loading state here since we don't know if question has picture yet
    
    // Initialize sound effects with relative paths
    this.correctSound = new Audio('assets/sounds/clapping.mp3');
    this.wrongSound = new Audio('assets/sounds/booing.mp3');
    
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
    
    // Load badge counts from localStorage
    this.loadBadgeCounts();
    
    // Only call loadNextQuestion if not resuming from saved state
    if (!this.activatedRouter.snapshot.queryParamMap.has('index')) {
      console.log('Starting a fresh quiz');
      // Reset these values for a fresh quiz
      this.answeredQuestions = new Set();
      this.questionIndex = 1;
      this.userCumulativePoint = 0;
      this.levelOption.userCumulativePoint = 0;
      
      this.shuffleQuestions();
      // Add a short delay before loading the first question to show loading indicator
      setTimeout(() => {
        this.loadNextQuestion();
      }, 800);
    } else {
      console.log('Continuing from a saved quiz state');
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
        // We'll set questionVisible based on whether the question has a picture
        // in the loadQuizQuestion method, not here
        
        this.pageFrom = page;
        this.currentLevel = +levelNo;
        this.questionIndex = +questionIndex || 1;
        
        // Load quiz questions first
        this.loadQuizQuestion(page, levelNo);
        
        // Check if this is a continuation
        if (questionIndex) {
          console.log(`Continuing quiz at question index ${questionIndex}`);
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
        } else {
          console.log('Starting a fresh quiz');
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
    });
  }

  getQuestionLevel(questions: any, levelNumber: number) {
    return questions.filter((q: any) => q.levelNumber == levelNumber);
  }

  // get pageFrom and load quiz questions based on the page
  loadQuizQuestion(pageFrom: string, levelNumber: any = 1) {
    // Set questionVisible to false initially
    this.questionVisible = false;
    
    const level = Number(levelNumber);
    let questions: any[] = [];

    switch (pageFrom) {
      case 'onka':
        questions = [...numberQuestions];
        break;
      case 'eranko':
        questions = [...animalQuestions];
        break;
      case 'oba-ilu':
        questions = [...kingsQuestions];
        break;
      case 'owe':
        questions = [...proverbsQuestions];
        break;
      case 'ilu':
        questions = [...townsQuestions];
        break;
      case 'eso':
        questions = [...fruitQuestions];
        break;
      default:
        questions = [...numberQuestions];
    }

    // Get the selected level questions
    this.quizQuestions = this.getQuestionLevel(questions, level);
    
    // Calculate the total points available for this level
    this.calculateTotalLevelPoints();
    
    // If there are no questions at this level, show an alert and navigate back
    if (this.quizQuestions.length === 0) {
      this.alertController.create({
        header: 'No Questions Available',
        message: 'There are no questions available for this level yet. Please check back later.',
        buttons: ['OK']
      }).then(alert => {
        alert.present();
        this.navCtrl.back();
      });
      return;
    }

    // Set the current question based on index
    const index = this.questionIndex - 1;
    if (index < this.quizQuestions.length) {
      setTimeout(() => {
        this.currentQuestion = this.quizQuestions[index];
        
        // Check if the question has an image
        if (this.currentQuestion.picture) {
          // For questions with pictures, load the image first
          this.isImageLoading = true;
          
          const img = new Image();
          img.onload = () => {
            this.isImageLoading = false;
            this.questionVisible = true;
            // Start timer after image loads
            this.startTimer();
          };
          img.onerror = () => {
            this.isImageLoading = false;
            this.questionVisible = true;
            // Start timer even if image fails to load
            this.startTimer();
          };
          img.src = this.currentQuestion.picture;
        } else {
          // For questions without pictures, make visible immediately
          this.isImageLoading = false;
          this.questionVisible = true;
          // Start timer for questions without images
          this.startTimer();
        }
      }, 500);
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
    // Clear any existing timer first to prevent multiple intervals
    this.stopTimer();
    
    this.timer = 10;
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.stopTimer();
        this.handleTimerExpired();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  // Handle when timer expires
  handleTimerExpired() {
    console.log('Timer expired - moving to next question');
    
    // Mark current question as answered with no points awarded
    this.answeredQuestions.add(this.currentQuestion.id);
    
    // Save game state to track this skipped question
    this.saveGameState();
    
    // Trigger next question with a short delay to ensure UI updates
    setTimeout(() => {
      this.loadNextQuestion();
    }, 300);
  }

  loadNextQuestion() {
    console.log('Loading next question...');
    
    // Reset states
    this.stopTimer();
    this.selectedAnswer = null;
    this.isOptionSelected = false;
    this.showFeedback = false;
    this.correctOption = false;
    this.wrongAnswer = null;
    this.feedbackFadeOut = false;
    this.modalOpen = false;

    // Determine if the quiz is complete
    if (this.answeredQuestions.size === this.quizQuestions.length) {
      console.log('All questions answered! Evaluating level progress...');
      this.questionCompleted = true;
      this.evaluateLevelProgress();
      return;
    }

    console.log(`Finding next question. Current index: ${this.questionIndex}, Total questions: ${this.quizQuestions.length}`);
    
    // Find the next unanswered question
    let nextIndex = this.questionIndex - 1;
    
    // If we're at the end of questions, wrap around to find unanswered ones
    if (nextIndex >= this.quizQuestions.length) {
      nextIndex = 0;
      console.log('Reached end of questions, wrapping around to beginning');
    }
    
    // Find the next unanswered question
    let startIndex = nextIndex;
    let found = false;
    
    // Loop through questions until we find an unanswered one
    do {
      // Make sure we have valid questions
      if (this.quizQuestions.length === 0) {
        console.error('No questions available in quiz!');
        return;
      }
      
      // Check if the current question is answered
      const currentId = this.quizQuestions[nextIndex].id;
      console.log(`Checking question ${nextIndex+1} with ID ${currentId}`);
      
      if (!this.answeredQuestions.has(currentId)) {
        // Found an unanswered question
        this.questionIndex = nextIndex + 1; // 1-indexed for display
        this.currentQuestion = this.quizQuestions[nextIndex];
        found = true;
        console.log(`Found unanswered question at index ${nextIndex+1}`);
        break;
      }
      
      // Move to next question (with wrapping)
      nextIndex = (nextIndex + 1) % this.quizQuestions.length;
      
      // If we've checked all questions and come back to the start, all are answered
      if (nextIndex === startIndex) {
        console.log('Checked all questions, all have been answered');
        break;
      }
      
    } while (!found);
    
    // If no unanswered questions found, mark as completed
    if (!found) {
      console.log('All questions have been answered');
      this.questionCompleted = true;
      this.evaluateLevelProgress();
      return;
    }

    console.log(`Loading question ${this.questionIndex} of ${this.quizQuestions.length}`);

    // Reset used suggestions
    this.usedSuggestions = {
      ileke: false,
      obi: false,
      eyoOwo: false,
      ami: false,
    };

    // Save the current game state
    this.saveGameState();

    // Check if the question has an image
    if (this.currentQuestion.picture) {
      // Only hide question and show loading for questions with images
      this.questionVisible = false;
      this.isImageLoading = true;
      
      // Preload the image
      const img = new Image();
      img.onload = () => {
        setTimeout(() => {
          this.isImageLoading = false;
          this.questionVisible = true;
          // Start timer after image is loaded and visible
          this.startTimer();
        }, 300);
      };
      img.onerror = () => {
        setTimeout(() => {
          this.isImageLoading = false;
          this.questionVisible = true;
          // Start timer after error resolution
          this.startTimer();
        }, 300);
      };
      img.src = this.currentQuestion.picture;
    } else {
      // For questions without pictures, make visible immediately
      this.questionVisible = true;
      this.isImageLoading = false;
      
      // Start the timer for the new question after a short delay
      setTimeout(() => {
        this.startTimer();
      }, 300);
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

  // Play correct answer sound
  playCorrectSound() {
    try {
      // Reset the audio to start from beginning if it was already played
      this.correctSound.currentTime = 0;
      this.correctSound.play();
    } catch (error) {
      console.error('Error playing correct sound effect:', error);
    }
  }

  // Play wrong answer sound
  playWrongSound() {
    try {
      // Reset the audio to start from beginning if it was already played
      this.wrongSound.currentTime = 0;
      this.wrongSound.play();
    } catch (error) {
      console.error('Error playing wrong sound effect:', error);
    }
  }

  selectOption(selectedOption: any, questionIndex: number) {
    if (this.isOptionSelected) {
      return; // Prevent multiple selections
    }

    this.isOptionSelected = true;
    this.selectedAnswer = selectedOption;
    this.stopTimer();

    // Add the question's points to the user's score if answered correctly
    if (selectedOption === this.currentQuestion.answer) {
      this.correctOption = true;
      this.userCumulativePoint += this.currentQuestion.points || 10;
      
      // Evaluate if the user has enough points to pass the level
      this.evaluateLevelProgress();
      
      // Show correct answer feedback
      const randomIndex = Math.floor(Math.random() * this.correctImages.length);
      this.selectedFeedbackImage = this.correctImages[randomIndex];
      
      // Play clapping sound
      this.playCorrectSound();
    } else {
      this.correctOption = false;
      this.wrongAnswer = selectedOption;
      
      // Show wrong answer feedback
      const randomIndex = Math.floor(Math.random() * this.wrongImages.length);
      this.selectedFeedbackImage = this.wrongImages[randomIndex];
      
      // Play booing sound
      this.playWrongSound();
    }

    // Record this question as answered
    this.answeredQuestions.add(this.currentQuestion.id);
    
    // Save the game state after each question is answered
    this.saveGameState();

    // Show feedback (initially don't fade out)
    this.feedbackFadeOut = false;
    this.showFeedback = true;
    
    // No need to hide the question container again - the image is already loaded
    
    // Set a timer to start fading out the feedback image after 2 seconds
    setTimeout(() => {
      this.feedbackFadeOut = true;
    }, 2000);
    
    // Delay opening the modal to allow feedback to be visible longer
    setTimeout(() => {
      // Show modal with explanation
      this.modalOpen = true;
    }, 3000); // Increased from 800ms to 3000ms
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

  // Check if user has enough badges to use an item
  checkBadgeAvailability(slug: 'ileke' | 'obi' | 'eyoOwo' | 'ami'): boolean {
    // Find the overlay item
    const item = this.overlayItems.find((item: OverlayItem) => item.slug === slug);
    
    // Check if item exists and has badges
    if (item && item.badge > 0) {
      return true;
    }
    
    // Show toast if no badges
    if (item) {
      this.showToast(`You have 0 ${item.title}, you need to purchase from shop to use`);
    }
    
    return false;
  }
  
  // Decrement badge count for an item
  decrementBadge(slug: 'ileke' | 'obi' | 'eyoOwo' | 'ami'): void {
    // Find the item and decrement its badge count
    const item = this.overlayItems.find((item: OverlayItem) => item.slug === slug);
    if (item && item.badge > 0) {
      item.badge--;
      console.log(`${item.title} badges remaining: ${item.badge}`);
      
      // Save badge counts to game state
      this.saveGameState();
    }
  }
  
  // Show toast message
  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle',
      color: 'warning',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    
    await toast.present();
  }
  
  // Modify useSuggestion to check badge availability
  useSuggestion(type: 'ileke' | 'obi' | 'eyoOwo' | 'ami') {
    // Check if user has badges for this item
    if (!this.checkBadgeAvailability(type)) {
      return; // Exit if no badges available
    }
    
    // Check if user has enough points
    if (this.userCumulativePoint < this.suggestionCosts[type]) {
      this.showToast(`You need ${this.suggestionCosts[type]} points to use this.`);
      return;
    }

    // Deduct the points
    this.userCumulativePoint -= this.suggestionCosts[type];
    
    // Mark suggestion as used for this question
    this.usedSuggestions[type] = true;
    
    // Decrease badge count
    this.decrementBadge(type);

    // Apply the suggestion effect
    switch (type) {
      case 'ileke':
        this.removeIncorrectOptions(2);
        break;
      case 'obi':
        this.removeIncorrectOptions(1);
        break;
      case 'eyoOwo':
        this.handleAutoAnswer();
        break;
      case 'ami':
        alert(`Hint: ${this.currentQuestion.explanation}`);
        break;
    }
  }
  
  // Update disableSuggestion to also check badge count
  disableSuggestion(slug: 'ileke' | 'obi' | 'eyoOwo' | 'ami'): boolean {
    // Find the item
    const item = this.overlayItems.find((item: OverlayItem) => item.slug === slug);
    
    // First check if the item was found - if not, disable it to be safe
    if (!item) {
      return true; // Item not found, disable it
    }
    
    return (
      this.usedSuggestions[slug] ||
      this.userCumulativePoint < this.suggestionCosts[slug] ||
      item.badge <= 0 // Now we know item is not undefined
    );
  }

  handleAutoAnswer() {
    // Mark as selected and set correct answer
    this.isOptionSelected = true;
    this.answerQuestion(this.currentQuestion.answer);
    
    // Show feedback with correct answer
    this.correctOption = true;
    const randomIndex = Math.floor(Math.random() * this.correctImages.length);
    this.selectedFeedbackImage = this.correctImages[randomIndex];
    
    // Play clapping sound (commented out as per user's change)
    // this.playCorrectSound();
    
    // Record this question as answered
    this.answeredQuestions.add(this.currentQuestion.id);
    
    // Save the game state after each question is answered
    this.saveGameState();

    // Show feedback (initially don't fade out)
    this.feedbackFadeOut = false;
    this.showFeedback = true;
    
    // Set a timer to start fading out the feedback image after 2 seconds
    setTimeout(() => {
      this.feedbackFadeOut = true;
    }, 2000);
    
    // Delay opening the modal to allow feedback to be visible longer
    setTimeout(() => {
      // Show modal with explanation
      this.modalOpen = true;
    }, 3000);
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
    console.log(`SAVE STATE: Badge counts:`, this.overlayItems.map(item => `${item.title}: ${item.badge}`).join(', '));
    
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
      // Save badge counts
      overlayItems: this.overlayItems,
      // Add timestamp to help with debugging
      savedAt: new Date().toISOString()
    };

    this.gameStateService.updateGameState(gameState);
    console.log(`Game state saved for ${this.pageFrom}`);
    
    // Also save badge counts separately to be used across all quizzes
    this.saveBadgeCounts();
  }
  
  // Save badge counts to be used across all quiz categories
  saveBadgeCounts() {
    const badgeCounts: BadgeCounts = {};
    this.overlayItems.forEach(item => {
      badgeCounts[item.slug] = item.badge;
    });
    localStorage.setItem('badgeCounts', JSON.stringify(badgeCounts));
    console.log('Badge counts saved to localStorage:', badgeCounts);
  }
  
  // Load badge counts from localStorage
  loadBadgeCounts() {
    const savedBadges = localStorage.getItem('badgeCounts');
    if (savedBadges) {
      try {
        const badgeCounts: BadgeCounts = JSON.parse(savedBadges);
        console.log('Loading saved badge counts:', badgeCounts);
        
        // Update overlay items with saved badge counts
        this.overlayItems.forEach(item => {
          if (badgeCounts[item.slug] !== undefined) {
            item.badge = badgeCounts[item.slug] ?? item.badge;
          }
        });
        
        console.log('Badge counts loaded successfully');
      } catch (error) {
        console.error('Error loading badge counts', error);
      }
    }
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
