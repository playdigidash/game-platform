import { makeAutoObservable } from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import { IEarthLayer, earthLayers } from './models/EarthLayersData';

export interface IPresenterSlide {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'interactive';
  metadata: Record<string, unknown>;
}

export interface IPresenterQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswerIdx: number;
  explanation: string;
  relatedLayerId: string;
}

export class PresenterViewStore {
  root: RootStore;
  slides: IPresenterSlide[] = [];
  currentSlideIndex: number = 0;
  isPlaying: boolean = false;
  layers: IEarthLayer[] = earthLayers;
  currentLayerIndex = -1; // Start with overview
  isShowingFunFact = false;
  currentFunFactIndex = 0;
  
  // Question-related state
  isQuestionMode = false;
  currentQuestion: IPresenterQuestion | null = null;
  selectedAnswer: number = -1;
  showAnswers = false;
  isAnswerCorrect = false;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  setSlides = (slides: IPresenterSlide[]) => {
    this.slides = slides;
  };

  nextSlide = () => {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
    }
  };

  previousSlide = () => {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  };

  setIsPlaying = (playing: boolean) => {
    this.isPlaying = playing;
  };

  get currentSlide(): IPresenterSlide | null {
    return this.slides[this.currentSlideIndex] || null;
  }

  resetPresentation = () => {
    this.currentSlideIndex = 0;
    this.isPlaying = false;
  };

  setCurrentLayerIndex = (index: number) => {
    this.currentLayerIndex = index;
    this.isShowingFunFact = false;
    this.currentFunFactIndex = 0;
  };

  nextLayer = () => {
    if (this.currentLayerIndex < this.layers.length - 1) {
      this.setCurrentLayerIndex(this.currentLayerIndex + 1);
    }
  };

  previousLayer = () => {
    if (this.currentLayerIndex > 0) {
      this.setCurrentLayerIndex(this.currentLayerIndex - 1);
    }
  };

  toggleFunFact = () => {
    this.isShowingFunFact = !this.isShowingFunFact;
    if (this.isShowingFunFact) {
      // Cycle through fun facts
      this.currentFunFactIndex = (this.currentFunFactIndex + 1) % 
        this.currentLayer.funFacts.length;
    }
  };

  get currentLayer(): IEarthLayer {
    return this.layers[this.currentLayerIndex];
  }

  get currentFunFact(): string {
    return this.currentLayer.funFacts[this.currentFunFactIndex];
  }

  get isFirstLayer(): boolean {
    return this.currentLayerIndex === 0;
  }

  get isLastLayer(): boolean {
    return this.currentLayerIndex === this.layers.length - 1;
  }

  // Question-related methods
  setQuestionMode = (isQuestionMode: boolean) => {
    this.isQuestionMode = isQuestionMode;
    if (!isQuestionMode) {
      this.resetQuestionState();
    }
  };

  setCurrentQuestion = (question: IPresenterQuestion | null) => {
    this.currentQuestion = question;
    this.resetQuestionState();
  };

  selectAnswer = (index: number) => {
    this.selectedAnswer = index;
    this.isAnswerCorrect = index === this.currentQuestion?.correctAnswerIdx;
    this.showAnswers = true;
  };

  resetQuestionState = () => {
    this.selectedAnswer = -1;
    this.showAnswers = false;
    this.isAnswerCorrect = false;
  };

  // Navigation methods
  navigateToOverview = () => {
    this.currentLayerIndex = -1;
    this.isQuestionMode = false;
    this.resetQuestionState();
  };

  navigateToLayer = (index: number) => {
    this.currentLayerIndex = index;
    this.isQuestionMode = false;
    this.resetQuestionState();
  };

  navigateToQuestions = () => {
    this.isQuestionMode = true;
    this.setCurrentQuestion(this.getQuestionForCurrentLayer());
  };

  private getQuestionForCurrentLayer = (): IPresenterQuestion => {
    // This is a placeholder - you'll need to implement actual questions
    return {
      id: `question-${this.currentLayer.id}`,
      question: `Which of the following is true about the ${this.currentLayer.name}?`,
      answers: [
        this.currentLayer.funFacts[0],
        "This is an incorrect fact",
        "This is another incorrect fact",
        "This is yet another incorrect fact"
      ],
      correctAnswerIdx: 0,
      explanation: `The ${this.currentLayer.name} ${this.currentLayer.description}`,
      relatedLayerId: this.currentLayer.id
    };
  };
} 