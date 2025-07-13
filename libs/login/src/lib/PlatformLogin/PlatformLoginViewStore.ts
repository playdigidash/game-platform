import { action, makeAutoObservable, reaction } from 'mobx';
import { PlatformRootStore } from '../RootStore/PlatformLoginRootStore';
import { msalInstance } from '../Microsoft/MsalConfig';
import { OAuthCredential, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../Firebase';
import validator from 'validator';
import { MongoDBRealmError, User } from 'realm-web';
import {
  sendMagicLink,
  AppRoute,
  verifyToken,
  IRealmContext,
  IUserProfileType,
  sendCode,
  formatPhoneNumber,
  waitForSpecifiedTime,
  TokenVerifyMsg,
  environmentConfig,
} from '@lidvizion/commonlib';
import { VerificationType } from '../Login/PhoneVerification';

export class PlatformLoginViewStore {
  root: PlatformRootStore;
  isLoading = false;
  emailHelperTxt = '';
  isEmailError = false;
  emailOrPhone = '';
  isLoggingIn = false;
  currentlyVerifying = false;
  placeholder = 'dummy5432';
  realmContext: IRealmContext;
  signInMsg = '';
  isResettingPw = false;
  verifyNumRef1: HTMLInputElement | null = null;
  verifyNumRef2: HTMLInputElement | null = null;
  verifyNumRef3: HTMLInputElement | null = null;
  verifyNumRef4: HTMLInputElement | null = null;
  verifyNumRef5: HTMLInputElement | null = null;
  verifyNumRef6: HTMLInputElement | null = null;
  verifyNum1: string | null = null;
  verifyNum2: string | null = null;
  verifyNum3: string | null = null;
  verifyNum4: string | null = null;
  verifyNum5: string | null = null;
  verifyNum6: string | null = null;
  verificationFor: VerificationType = VerificationType.signup;
  showResetPwModal = false;
  password: string | null = null;
  passwordConfirm = '';
  loginTabValue = 0;
  showPhoneVerifyModal = false;
  isEmail = false;
  isVerificationCodeValid = true;
  isOptInChecked = true;
  truncatedNum = '';
  waitingForLinkTimeout = false;
  resendTimer = 30;
  phoneAllowed = false;
  emailAllowed = false;
  userType: IUserProfileType = IUserProfileType.game;
  showVerifyTokenModal = false;
  tokenVerifyMsg = TokenVerifyMsg.verifying;

  handleCreateUser?: (
    user: Realm.User,
    db: Realm.Services.MongoDBDatabase
  ) => void | null;

  constructor({
    root,
    realmContext,
  }: {
    root: PlatformRootStore;
    realmContext: IRealmContext;
  }) {
    this.root = root;
    this.realmContext = realmContext;
    makeAutoObservable(this);
  }
  setUserType = action((userType: IUserProfileType) => {
    this.userType = userType;
  });

  setEmailAllowed = action((emailAllowed: boolean) => {
    this.emailAllowed = emailAllowed;
  });

  setPhoneAllowed = action((phoneAllowed: boolean) => {
    this.phoneAllowed = phoneAllowed;
  });

  get loginHeaderTxt() {
    if (this.userType === IUserProfileType.game) {
      return 'Login to track progress';
    }

    return 'Login to your account';
  }

  get isValidPhone() {
    return (
      this.phoneAllowed && validator.isMobilePhone(this.emailOrPhone, 'en-US')
    );
  }

  get isValidEmail() {
    return this.emailAllowed && validator.isEmail(this.emailOrPhone);
  }

  get phoneOrEmailDivTxt() {
    if (this.emailAllowed && this.phoneAllowed) {
      return 'phone or email';
    }

    if (this.emailAllowed) {
      return 'email';
    }

    if (this.phoneAllowed) {
      return 'phone';
    }

    return '';
  }

  get isSendBtnDisabled() {
    let bool = false;

    if (!this.isValidEmail && !this.isValidPhone) {
      bool = true;
    }

    if (this.waitingForLinkTimeout) {
      bool = true;
    }

    return bool;
  }

  setResendTimer = action((t: number) => {
    this.resendTimer = t;
  });

  setWaitingForLinkTimeout = action(async (bool: boolean) => {
    this.waitingForLinkTimeout = bool;

    if (bool) {
      await waitForSpecifiedTime(30, this.setResendTimer);
      this.waitingForLinkTimeout = false;
    }
  });

  setIsLoading = action((bool: boolean) => {
    this.isLoading = bool;
  });

  setSignInMsg = action((msg: string) => {
    this.signInMsg = msg;
  });

  setTruncatedNum = action((str: string) => {
    this.truncatedNum = str;
  });

  setIsLoggingIn = action((bool: boolean) => {
    this.isLoggingIn = bool;
  });

  setEmailOrPhone = action((emailOrPhone: string) => {
    this.emailOrPhone = emailOrPhone;
  });

  setIsResettingPw = action((bool: boolean) => {
    this.isResettingPw = bool;
  });

  setIsVerificationCodeValid = action((bool: boolean) => {
    this.isVerificationCodeValid = bool;
  });

  setVerifyNumRef = action((ref: HTMLInputElement, position: number) => {
    switch (position) {
      case 0:
        this.verifyNumRef1 = ref;
        break;
      case 1:
        this.verifyNumRef2 = ref;
        break;
      case 2:
        this.verifyNumRef3 = ref;
        break;
      case 3:
        this.verifyNumRef4 = ref;
        break;
      case 4:
        this.verifyNumRef5 = ref;
        break;
      case 5:
        this.verifyNumRef6 = ref;
        break;
      default:
        break;
    }
  });

  setIsOptInChecked = action((bool: boolean) => {
    this.isOptInChecked = bool;
  });

  setCurrentVerifyNum = action((num: string, position: number) => {
    switch (position) {
      case 0:
        this.verifyNum1 = num;
        break;
      case 1:
        this.verifyNum2 = num;
        break;
      case 2:
        this.verifyNum3 = num;
        break;
      case 3:
        this.verifyNum4 = num;
        break;
      case 4:
        this.verifyNum5 = num;
        break;
      case 5:
        this.verifyNum6 = num;
        break;
      default:
        break;
    }
  });

  changeLoginTab = action((event: React.SyntheticEvent, newValue: number) => {
    this.setVerificationFor(VerificationType.signup);
    this.setLoginTabValue(newValue);
  });

  setLoginTabValue = action((val: number) => {
    this.loginTabValue = val;
  });

  setShowPhoneVerifyModal = action((bool: boolean) => {
    this.showPhoneVerifyModal = bool;
  });

  setVerificationFor = action((vType: VerificationType) => {
    this.verificationFor = vType;
  });

  setEmailHelperTxt = action((txt: string) => {
    this.emailHelperTxt = txt;
  });

  setIsEmailError = action((bool: boolean) => {
    this.isEmailError = bool;
  });

  setShowResetPwModal = action((bool: boolean) => {
    this.showResetPwModal = bool;
  });

  resetCodeInput = action(() => {
    this.verifyNum1 = '';
    this.verifyNum2 = '';
    this.verifyNum3 = '';
    this.verifyNum4 = '';
    this.verifyNum5 = '';
    this.verifyNum6 = '';
  });

  handleMicrosoftsignIn = async (
    err: any,
    data: any,
    microsoftSignIn: (data: any) => any
  ) => {
    if (!err && data.accessToken) {
      const microsoftInfo = await microsoftSignIn(data);
      if (microsoftInfo.realmUser.error) {
        this.setEmailHelperTxt(microsoftInfo.realmUser.error);
        this.setIsEmailError(true);
        this.setIsLoading(false);
        return;
      }

      return microsoftInfo;
    }

    return;
  };

  handleGoogleSignUp = action(
    async (idToken: string, googleSignUp: (str: string) => any) => {
      const googleInfo = await googleSignUp(idToken);
      if (googleInfo.realmUser.error) {
        this.setEmailHelperTxt(googleInfo.realmUser.error);
        this.setIsEmailError(true);
        this.setIsLoading(false);
        return;
      }

      return googleInfo;
    }
  );

  handleMicrosoft = action(
    async ({
      microsoftSignIn,
      handleAfterLogin,
      userType,
    }: {
      microsoftSignIn: (cred: OAuthCredential) => any;
      handleAfterLogin?: any;
      userType: IUserProfileType;
    }) => {
      try {
        // Check if Firebase auth is available
        if (!auth) {
          console.warn('Firebase authentication is not available - Microsoft login disabled');
          this.setEmailHelperTxt('Microsoft authentication is not available in this environment');
          this.setIsEmailError(true);
          this.setIsLoading(false);
          return;
        }

        await msalInstance.initialize();
        const provider = new OAuthProvider('microsoft.com');
        const res = await signInWithPopup(auth, provider);
        const creds = OAuthProvider.credentialFromResult(res);
        if (creds?.idToken) {
          const microRes = await microsoftSignIn(creds);
          if (
            microRes &&
            microRes.email &&
            microRes.realmUser instanceof User
          ) {
            handleAfterLogin(microRes.realmUser);
          }
        }
      } catch (error) {
        console.error('Error during Microsoft login:', error);
        this.setEmailHelperTxt('Failed to authenticate with Microsoft');
        this.setIsEmailError(true);
        this.setIsLoading(false);
      }
    }
  );

  handleMagicLink = action(
    async (
      email: string,
      db: Realm.Services.MongoDBDatabase,
      callbackUrl: string
    ) => {
      await sendMagicLink(email, callbackUrl);
    }
  );

  handleMagicLinkVerification = action(
    async ({
      email,
      token,
      handleAfterLogin,
      handleAfterLoginFail,
    }: {
      email: string;
      token: string;
      handleAfterLogin: (
        currentUser: User<
          Realm.DefaultFunctionsFactory,
          Record<string, unknown>,
          Realm.DefaultUserProfileData
        >
      ) => void;
      handleAfterLoginFail: (msg: TokenVerifyMsg, closeModal: boolean) => void;
    }) => {
      if (this.currentlyVerifying) {
        return;
      }

      handleAfterLoginFail(TokenVerifyMsg.verifying, false);

      const res = await verifyToken(email, token);
      let realmUser: any = null;
      if (res?.verified) {
        realmUser = await this.realmContext.emailSignIn(
          email,
          this.placeholder
        );

        if (!(realmUser instanceof User)) {
          if (
            typeof realmUser.message === 'string' &&
            realmUser.message.includes('status 401')
          ) {
            realmUser = await this.realmContext.emailSignUp(
              email,
              this.placeholder,
              false,
              true
            );
          } else {
            handleAfterLoginFail(TokenVerifyMsg.generic, true);
          }
        }
      } else {
        if (res.status === 350) {
          handleAfterLoginFail(TokenVerifyMsg.expired, true);
        } else if (res.status === 401) {
          handleAfterLoginFail(TokenVerifyMsg.invalid, true);
        } else {
          handleAfterLoginFail(TokenVerifyMsg.generic, true);
        }
      }

      if (realmUser instanceof User) {
        handleAfterLogin(realmUser);
      }
    }
  );

  get sendBtnTxt() {
    let txt = 'Send';
    if (this.isValidEmail) {
      txt = 'Send Magic Link';
    } else if (this.isValidPhone) {
      txt = 'Send Code';
    }

    return txt;
  }
  handleMagicClick = action(
    async ({
      callbackUrl,
      handleAfterLoginFail,
    }: {
      callbackUrl?: string;
      handleAfterLoginFail: (msg: TokenVerifyMsg, closeModal: boolean) => void;
    }) => {
      if (this.isValidEmail) {
        try {
          handleAfterLoginFail(TokenVerifyMsg.sending, false);
          await this.handleMagicLink(
            this.emailOrPhone,
            this.root.db,
            callbackUrl || ''
          );
          handleAfterLoginFail(TokenVerifyMsg.sent, true);
          this.setWaitingForLinkTimeout(true);
        } catch (error) {
          handleAfterLoginFail(TokenVerifyMsg.sendError, true);
        }
      }
    }
  );

  handleTokenVerifyFail = action(
    async (
      msg: TokenVerifyMsg,
      handleAfterLoginFail: (msg: TokenVerifyMsg, showModal: boolean) => void
    ) => {
      this.setEmailOrPhone('');
      handleAfterLoginFail(msg, false);
    }
  );

  handlePhoneCode = action(() => {
    const formattedNum = formatPhoneNumber(this.emailOrPhone);
    this.setEmailOrPhone(formattedNum);
    sendCode(formattedNum, false);
    this.setShowPhoneVerifyModal(true);
  });
}
