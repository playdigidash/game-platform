import { action, makeAutoObservable, observable } from "mobx";
import { RootStore } from "../RootStore/RootStore";
import axios from "axios";
import qs from 'qs';
import { extractTextNodeMap, IHint, getTxtFromEditor, environmentConfig } from "@lidvizion/commonlib";

const translateTexts = async (texts: string[], targetLanguage: string): Promise<string[]> => {
  const googleConfig = environmentConfig.getGoogleConfig();
  if (!googleConfig?.translateApiKey) {
    console.warn('Google Translate API key not configured. Translation features are only available in the cloud version.');
    return texts; // Return original texts if translation is not available
  }

  try {
    const response = await axios.post(
      'https://translation.googleapis.com/language/translate/v2',
      null,
      {
        params: {
          q: texts,
          target: targetLanguage,
          key: googleConfig.translateApiKey,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      }
    );

    return response.data.data.translations.map((t: any) => t.translatedText);
  } catch (error) {
    console.error('Error translating text batch:', error);
    return texts; // Fallback to original text on error
  }
};

export const languageCodes: Record<string, string> = {
  am: "Amharic",
  ar: "Arabic",
  eu: "Basque",
  bn: "Bengali",
  "en-GB": "English (UK)",
  "pt-BR": "Portuguese (Brazil)",
  bg: "Bulgarian",
  ca: "Catalan",
  chr: "Cherokee",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English (US)",
  et: "Estonian",
  fil: "Filipino",
  fi: "Finnish",
  fr: "French",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  iw: "Hebrew",
  hi: "Hindi",
  hu: "Hungarian",
  is: "Icelandic",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  kn: "Kannada",
  ko: "Korean",
  lv: "Latvian",
  lt: "Lithuanian",
  ms: "Malay",
  ml: "Malayalam",
  mr: "Marathi",
  no: "Norwegian",
  pl: "Polish",
  "pt-PT": "Portuguese (Portugal)",
  ro: "Romanian",
  ru: "Russian",
  sr: "Serbian",
  "zh-CN": "Chinese (PRC)",
  sk: "Slovak",
  sl: "Slovenian",
  es: "Spanish",
  sw: "Swahili",
  sv: "Swedish",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  "zh-TW": "Chinese (Taiwan)",
  tr: "Turkish",
  ur: "Urdu",
  uk: "Ukrainian",
  vi: "Vietnamese",
  cy: "Welsh"
};

export interface IObstacleData {
  title: string;
  funFacts: string[];
}

export interface IHeroData {
  title: string;
  description: string;
}

export interface IQuestionData {
  question: string;
  answers: string[];
  xformedExp: string;
  hints: IHint[];
}

export interface IGameData {
  title: string;
  desc: string;
  questions: Record<string, IQuestionData>;
  heroes: IHeroData[];
  obstacles: Record<string, IObstacleData>;
  playLabel?: string;
  settingsLabel?: string;
  welcomeLabel?: string;
  partLabel?: string;
  ofLabel?: string;
  youChoseLabel?: string;
  selectLabel?: string;
  skipLabel?: string;
  profileTabLabel?: string;
  displayNameLabel?: string;
  savingLabel?: string;
  saveNameLabel?: string;
  audioTabLabel?: string;
  masterAudioLabel?: string;
  musicLabel?: string;
  soundEffectsLabel?: string;
  movementTabLabel?: string;
  subscriptionTabLabel?: string;
  accessibilityTabLabel?: string;
  openAccessibilityWidgetLabel?: string;
  howToPlayLabel?: string;
  dodgeObstaclesLabel?: string;
  collectCoinsHintsLabel?: string;
  answerTriviaLabel?: string;
  emailLabel?: string;
  enterYourEmailLabel?: string;
  feedbackTypeLabel?: string;
  feedbackPlaceholderLabel?: string;
  heroLabel?: string;
  pointsLabel?: string;
  questionsAnswersLabel?: string;
  leaderboardLabel?: string;
  otherLabel?: string;
  descriptionLabel?: string;
  submitFeedbackLabel?: string;
  submittingLabel?: string;
  tutorialLabel?: string;
  tutorialDescriptionLabel?: string;
  startTutorialLabel?: string;
  skipTutorialLabel?: string;
  selectYourHeroLabel?: string;
  availableHintsLabel?: string;
  dashCompleteLabel?: string;
  completedLabel?: string;
  questLabel?: string;
  scoreLabel?: string;
  collectedLabel?: string;
  minutesLabel?: string;
  rankLabel?: string;
  addPrizeCodeLabel?: string;
  leaderboardDescriptionLabel?: string;
  triviaCheckLabel?: string;
  playFriendsLabel?: string;
  reviewLabel?: string;
  questionsCompletedLabel?: string;
  explanationLabel?: string;
  hintsLabel?: string;
  sourceLabel?: string;
  restartQuestLabel?: string;
  nextDashLabel?: string;
  topScoresLabel?: string;
  noPlayerYetLabel?: string;
  correctAnswerLabel?: string;
  wellDoneLabel?: string;
  avoidObstaclesLabel?: string;
  collectCoinsHintBoxesLabel?: string;
  answerAccuracySpeedLabel?: string;
  onARollLabel?: string;
  lightningFastLabel?: string;
  firstTryLabel?: string;
  secondShotSuccessLabel?: string;
  thirdTimeCharmLabel?: string;
  youGotItLabel?: string;
  collectHintsHelpLabel?: string;
  collectCoinsPointsLabel?: string;
  tutorialCompleteLabel?: string;
  retryQuestLabel?: string;
}

export class TranslateViewStore {
  root: RootStore;
  originalGameData: IGameData | null = null;
  translatedGameData: IGameData | null = null;
  translations: { [lang: string]: IGameData } = {};
  defaultLanguage = 'en'; // English (US)
  currentLanguage = 'en';
  isTranslating = false;

  constructor(root: RootStore){
    this.root = root;
    makeAutoObservable(this, {
       translations: observable,
    });
  };

  setDefaultLanguage = action((lang: string) => {
    this.defaultLanguage = lang;
  });

  setCurrentLanguage = action((lang: string) => {
    this.currentLanguage = lang;
  });

  setOriginalGameData = action((data: IGameData) => {
    this.originalGameData = {
      ...data,
      playLabel: 'Play',
      settingsLabel: 'Settings',
      welcomeLabel: 'Welcome,',
      partLabel: 'Part',
      ofLabel: 'of',
      youChoseLabel: 'You chose',
      selectLabel: 'Select',
      skipLabel: 'Skip',
      profileTabLabel: 'Profile',
      displayNameLabel: 'Display Name',
      savingLabel: 'Saving',
      saveNameLabel: 'Save Name',
      audioTabLabel: 'Audio',
      masterAudioLabel: 'Master Audio',
      musicLabel: 'Music',
      soundEffectsLabel: 'Sound Effects',
      movementTabLabel: 'Movement',
      subscriptionTabLabel: 'Subscription',
      accessibilityTabLabel: 'Accessibility',
      openAccessibilityWidgetLabel: 'Open Accessibility Widget',
      howToPlayLabel: 'Scoring',
      dodgeObstaclesLabel: 'Dodge Obstacles (-50)',
      collectCoinsHintsLabel: 'Collect Coins (+100)',
      answerTriviaLabel: 'Answer Trivia (accuracy is key!)',
      emailLabel: 'Email',
      enterYourEmailLabel: 'Enter your email',
      feedbackTypeLabel: 'Feedback Type',
      feedbackPlaceholderLabel: 'How can we improve? Feel free to upload a screenshot!',
      heroLabel: 'Hero',
      pointsLabel: 'Points',
      questionsAnswersLabel: 'Questions/Answers',
      leaderboardLabel: 'Leaderboard',
      otherLabel: 'Other',
      descriptionLabel: 'Description',
      submitFeedbackLabel: 'Submit Feedback',
      submittingLabel: 'Submitting',
      tutorialLabel: 'Tutorial',
      tutorialDescriptionLabel: 'Learn how to play in three simple steps.',
      startTutorialLabel: 'Start Tutorial',
      skipTutorialLabel: 'Skip Tutorial',
      selectYourHeroLabel: 'Select Your Hero!',
      availableHintsLabel: 'Available Hints',
      dashCompleteLabel: 'Dash Complete!',
      completedLabel: 'Completed',
      questLabel: 'Quest',
      scoreLabel: 'Score',
      collectedLabel: 'Collected',
      minutesLabel: 'Minutes',
      rankLabel: 'Rank',
      addPrizeCodeLabel: 'Get Prize',
      leaderboardDescriptionLabel: 'The leaderboard lists your highest score!',
      triviaCheckLabel: 'Trivia Check',
      playFriendsLabel: 'Play Friends',
      reviewLabel: 'Review',
      questionsCompletedLabel: 'Questions Completed',
      explanationLabel: 'Explanation',
      hintsLabel: 'Hints',
      sourceLabel: 'Source',
      restartQuestLabel: 'Restart Quest',
      nextDashLabel: 'Next Dash',
      topScoresLabel: 'Top Scores',
      noPlayerYetLabel: 'No player yet',
      correctAnswerLabel: 'Correct answer!',
      wellDoneLabel: 'Well Done! Keep Going!',
      avoidObstaclesLabel: 'Avoid obstacles in your path to keep your points!',
      collectCoinsHintBoxesLabel: 'Collect coins to increase your score and collect hint boxes for trivia help!',
      answerAccuracySpeedLabel: 'Answer accurately to earn more points! Your score decreases with each attempt, so aim for the right answer early. Speed matters too—bonus points fade over time!',
      onARollLabel: "You're on a roll!",
      lightningFastLabel: 'Lightning fast!',
      firstTryLabel: 'First try!!',
      secondShotSuccessLabel: 'Second shot success!',
      thirdTimeCharmLabel: "Third time's the charm!",
      youGotItLabel: 'You got it!',
      collectHintsHelpLabel: 'Collect Hints for Trivia Help',
      collectCoinsPointsLabel: 'Collect Coins for More Points!',
      tutorialCompleteLabel: "Tutorial completed! Starting the game...",
      retryQuestLabel: 'retry quest',
    };
    this.setTranslatedGameData(this.originalGameData);
  });

  setTranslatedGameData = action((data: IGameData | null) => {
    this.translatedGameData = data;
  });

  handleTranslateGame = action(async (targetLanguage: string) => {
    if (!this.originalGameData) return;
    this.setCurrentLanguage(targetLanguage);

    if (targetLanguage === this.defaultLanguage){
      this.setTranslatedGameData(this.originalGameData);
      return;
    }

    if (this.translations[targetLanguage]) {
      this.setTranslatedGameData(this.translations[targetLanguage]);
      return;
    }

    this.isTranslating = true;

    try {
      // --- Step 1: Translate Static UI Text ---
      const staticTexts = [
        'Play', 'Settings', 'Welcome,', 'Part', 'of', 'You chose', 'Select', 'Skip', 'Profile',
        'Display Name', 'Saving', 'Save Name', 'Audio', 'Master Audio', 'Music',
        'Sound Effects', 'Movement', 'Subscription', 'Accessibility',
        'Open Accessibility Widget', 'How To Play', 'Dodge Obstacles',
        'Collect Coins & Hints', 'Answer Trivia', 'Email', 'Enter your email', 'Feedback Type', 
        'How can we improve? Feel free to upload a screenshot!',
         'Hero', 'Points', 'Questions/Answers', 'Leaderboard', 'Other', 'Description',
        'Submit Feedback', 'Submitting', 'Tutorial', 'Learn how to play in three simple steps.', 'Start Tutorial', 
        'Skip Tutorial', 'Select Your Hero!', 'Available Hints', 'Dash Complete!', 'Completed', 'Quest',
        'Score', 'Collected', 'Minutes', 'Rank', 'Get Prize', 'The leaderboard lists your highest score!', 
        'Trivia Check', 'Play Friends', 'Review', 'Questions Completed', 'Explanation', 'Hints', 'Source',
        'Restart Quest', 'Next Dash', 'Top Scores', 'No player yet', 
        'Correct answer!',
        'Well Done! Keep Going!',
        'Avoid obstacles in your path to keep your points!',
        'Collect coins to increase your score and collect hint boxes for trivia help!',
        'Answer accurately to earn more points! Your score decreases with each attempt, so aim for the right answer early. Speed matters too—bonus points fade over time!',
        "You're on a roll!",
        'Lightning fast!',
        'First try!!',
        'Second shot success!',
        "Third time's the charm!",
        'You got it!',
        'Collect Hints for Trivia Help',
        'Collect Coins for More Points!',
        "Tutorial completed! Starting the game...",
        'retry quest',
      ];
    
      const translatedStaticTexts = await translateTexts(staticTexts, targetLanguage);
    
      // Destructure results
      const [
        playLabel, settingsLabel, welcomeLabel, partLabel, ofLabel, youChoseLabel, selectLabel, skipLabel, profileTabLabel,
        displayNameLabel, savingLabel, saveNameLabel, audioTabLabel, masterAudioLabel,
        musicLabel, soundEffectsLabel, movementTabLabel, subscriptionTabLabel,
        accessibilityTabLabel, openAccessibilityWidgetLabel, howToPlayLabel,
        dodgeObstaclesLabel, collectCoinsHintsLabel, answerTriviaLabel, emailLabel, enterYourEmailLabel,
        feedbackTypeLabel, feedbackPlaceholderLabel, heroLabel, pointsLabel, questionsAnswersLabel,
        leaderboardLabel, otherLabel, descriptionLabel, submitFeedbackLabel, submittingLabel,
        tutorialLabel, tutorialDescriptionLabel, startTutorialLabel, skipTutorialLabel, selectYourHeroLabel,
        availableHintsLabel, dashCompleteLabel, completedLabel, questLabel, scoreLabel, collectedLabel, minutesLabel, rankLabel,
        addPrizeCodeLabel, leaderboardDescriptionLabel, triviaCheckLabel, playFriendsLabel, reviewLabel, 
        questionsCompletedLabel, explanationLabel, hintsLabel, sourceLabel, restartQuestLabel, nextDashLabel, 
        topScoresLabel, noPlayerYetLabel, correctAnswerLabel, wellDoneLabel, avoidObstaclesLabel, collectCoinsHintBoxesLabel,
        answerAccuracySpeedLabel, onARollLabel, lightningFastLabel, firstTryLabel, secondShotSuccessLabel,
        thirdTimeCharmLabel, youGotItLabel, collectHintsHelpLabel, collectCoinsPointsLabel, tutorialCompleteLabel,
        retryQuestLabel,
      ] = translatedStaticTexts;
    
      // --- Step 2: Translate Game Data Content ---
      const dynamicTexts: string[] = [];
  
      dynamicTexts.push(this.originalGameData.title);
      dynamicTexts.push(this.originalGameData.desc);

      const expNodeMap: Record<string, ReturnType<typeof extractTextNodeMap>> = {};
      const hintNodeMap: Record<string, { [index: number]: ReturnType<typeof extractTextNodeMap> }> = {};
    
      for (const [id, q] of Object.entries(this.originalGameData.questions)) {
        dynamicTexts.push(q.question);
        dynamicTexts.push(...q.answers);
    
        const expMap = extractTextNodeMap(q.xformedExp);
        expNodeMap[id] = expMap;
        dynamicTexts.push(...expMap.texts);
    
        hintNodeMap[id] = {};
        q.hints.forEach((hint, idx) => {
          dynamicTexts.push(hint.title);
          const hMap = extractTextNodeMap(hint.xformedH);
          hintNodeMap[id][idx] = hMap;
          dynamicTexts.push(...hMap.texts);
        });
      }

      for (const hero of this.originalGameData.heroes) {
        dynamicTexts.push(hero.title, hero.description);
      }
      
      for (const [id, obstacle] of Object.entries(this.originalGameData.obstacles)) {
        dynamicTexts.push(obstacle.title);
        dynamicTexts.push(...obstacle.funFacts);
      }
    
      const translatedDynamicTexts = await translateTexts(dynamicTexts, targetLanguage);
    
      // --- Step 3: Reconstruct Translated Game Data ---
      let i = 0;
      const newTitle = translatedDynamicTexts[i++];
      const newDesc = translatedDynamicTexts[i++];
    
      const newQuestions: Record<string, IQuestionData> = {};
      for (const [id, q] of Object.entries(this.originalGameData.questions)) {
        const question = translatedDynamicTexts[i++];
        const answers = q.answers.map(() => translatedDynamicTexts[i++]);
    
        const expMap = expNodeMap[id];
        const translatedExpTexts = expMap.nodes.map(() => translatedDynamicTexts[i++]);
    
        let textIndex = 0;
        const reconstructExpJson = (node: any) => {
          if (node.type === 'text') node.text = translatedExpTexts[textIndex++];
          node.children?.forEach(reconstructExpJson);
        };
        if (expMap.json?.root) reconstructExpJson(expMap.json.root);
        const newXformedExp = JSON.stringify(expMap.json);
    
        const hints: IHint[] = q.hints.map((_originalHint, idx) => {
          const title = translatedDynamicTexts[i++];
          const hMap = hintNodeMap[id][idx];
          const translatedHintTexts = hMap.nodes.map(() => translatedDynamicTexts[i++]);
    
          let hintTextIndex = 0;
          const reconstructHintJson = (node: any) => {
            if (node.type === 'text') node.text = translatedHintTexts[hintTextIndex++];
            node.children?.forEach(reconstructHintJson);
          };
          if (hMap.json?.root) reconstructHintJson(hMap.json.root);
          const newXformedH = JSON.stringify(hMap.json);
    
          return { title, xformedH: newXformedH };
        });
    
        newQuestions[id] = { question, answers, xformedExp: newXformedExp, hints };
      }

      const newHeroes: IHeroData[] = [];
      for (const hero of this.originalGameData.heroes) {
        const title = translatedDynamicTexts[i++];
        const description = translatedDynamicTexts[i++];
        newHeroes.push({ title, description });
      }

      const newObstacles: Record<string, IObstacleData> = {};
      for (const [id, obstacle] of Object.entries(this.originalGameData.obstacles)) {
        const title = translatedDynamicTexts[i++];
        const funFacts = obstacle.funFacts.map(() => translatedDynamicTexts[i++]);
        newObstacles[id] = { title, funFacts };
      }
    
      const newGameData: IGameData = {
        title: newTitle,
        desc: newDesc,
        questions: newQuestions,
        heroes: newHeroes,
        obstacles: newObstacles,
        playLabel,
        settingsLabel,
        welcomeLabel,
        partLabel,
        ofLabel,
        youChoseLabel,
        selectLabel,
        skipLabel,
        profileTabLabel,
        displayNameLabel,
        savingLabel,
        saveNameLabel,
        audioTabLabel,
        masterAudioLabel,
        musicLabel,
        soundEffectsLabel,
        movementTabLabel,
        subscriptionTabLabel,
        accessibilityTabLabel,
        openAccessibilityWidgetLabel,
        howToPlayLabel,
        dodgeObstaclesLabel,
        collectCoinsHintsLabel,
        answerTriviaLabel,
        emailLabel,
        enterYourEmailLabel,
        feedbackTypeLabel,
        feedbackPlaceholderLabel,
        heroLabel,
        pointsLabel,
        questionsAnswersLabel,
        leaderboardLabel,
        otherLabel,
        descriptionLabel,
        submitFeedbackLabel,
        submittingLabel,
        tutorialLabel,
        tutorialDescriptionLabel,
        startTutorialLabel,
        skipTutorialLabel,
        selectYourHeroLabel,
        availableHintsLabel,
        dashCompleteLabel, 
        completedLabel,
        questLabel,
        scoreLabel,
        collectedLabel,
        minutesLabel,
        rankLabel,
        addPrizeCodeLabel,
        leaderboardDescriptionLabel,
        triviaCheckLabel,
        playFriendsLabel,
        reviewLabel,
        questionsCompletedLabel,
        explanationLabel,
        hintsLabel,
        sourceLabel,
        restartQuestLabel,
        nextDashLabel,
        topScoresLabel,
        noPlayerYetLabel,
        correctAnswerLabel,
        wellDoneLabel,
        avoidObstaclesLabel,
        collectCoinsHintBoxesLabel,
        answerAccuracySpeedLabel,
        onARollLabel,
        lightningFastLabel,
        firstTryLabel,
        secondShotSuccessLabel,
        thirdTimeCharmLabel,
        youGotItLabel,
        collectHintsHelpLabel,
        collectCoinsPointsLabel,
        tutorialCompleteLabel,
        retryQuestLabel,
      };
    
      this.translations[targetLanguage] = newGameData;
      this.setTranslatedGameData(newGameData);

    } catch (error) {
      console.error("Error during translation process:", error);
      if (this.originalGameData) {
        this.setTranslatedGameData(this.originalGameData);
      }
    } finally {
      this.isTranslating = false;
    }
  });

  translate3DObjects = action(async() => {
    if (!this.originalGameData || !this.translatedGameData) return;

    try {
      const textsToTranslate: string[] = [];

      for (const hero of this.originalGameData.heroes) {
        textsToTranslate.push(hero.title, hero.description);
      }
      
      for (const [id, obstacle] of Object.entries(this.originalGameData.obstacles)) {
        textsToTranslate.push(obstacle.title, ...obstacle.funFacts);
      }

      const translatedTexts = await translateTexts(textsToTranslate, this.currentLanguage);

      const translatedHeroes: IHeroData[] = [];
      let i = 0;
      for (const hero of this.originalGameData.heroes) {
        const title = translatedTexts[i++];
        const description = translatedTexts[i++];
        translatedHeroes.push({ title, description });
      }

      const translatedObstacles: Record<string, IObstacleData> = {};
      for (const [id, obstacle] of Object.entries(this.originalGameData.obstacles)) {
        const title = translatedTexts[i++];
        const funFacts = obstacle.funFacts.map(() => translatedTexts[i++]);
        translatedObstacles[id] = { title, funFacts };
      }
      
      this.translatedGameData.heroes = translatedHeroes;
      this.translatedGameData.obstacles = translatedObstacles;
    }
    catch (error) {
      console.error("Error during translation of heroes and obstacles:", error);
      this.translatedGameData.heroes = this.originalGameData.heroes;
      this.translatedGameData.obstacles = this.originalGameData.obstacles;
    }
  })
};