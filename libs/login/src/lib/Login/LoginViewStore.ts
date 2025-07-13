/* eslint-disable @typescript-eslint/no-empty-interface */
import { AppRoute, LoginType, sendCode } from '@lidvizion/commonlib';
import { CredentialResponse } from '@react-oauth/google';
import validator from 'validator';
import { RootStore } from '../RootStore/LoginRootStore';
import { action, makeAutoObservable } from 'mobx';
import { VerificationType } from './PhoneVerification';

export interface Quote {
  quote:string
  author?:string
}

export const MandatoryLoginPages = {
  account: `/${AppRoute.account}`,
  award: `/${AppRoute.award}`,
  settings: `/${AppRoute.settings}`
}

export class LoginViewStore {
    root:RootStore
    isLoggingIn = false
    email:string |  null = null
    password:string |  null = null
    passwordConfirm = ''
    showSignIn = true
    loginTabValue = 0
    isEmailError = false
    isPasswordError = false
    pwHelperText = ''
    showLoginModal = false
    canCloseLogin = true
    showFeedbackHeader = false
    showSuccessSnackbar = false
    showAccountHeader = false
    showPointsHeader = false
    showForgotPasswordModal = false
    isTermsChecked = false
    emailHelperTxt = ''
    isTermsError = false
    showTermsModal = false
    showPolicyModal = false
    afterLoginNav: string |  null = null
    isOptInChecked = true
    showPhoneVerifyModal = false
    verifyNum1: string |  null = null
    verifyNum2: string |  null = null
    verifyNum3: string |  null = null
    verifyNum4: string |  null = null
    verifyNum5: string |  null = null
    verifyNum6: string |  null = null
    truncatedNum = ''
    isEmail = true
    currentLoginTitle = ''
    msg = ''
    showLoginTitle = false
    isVerificationCodeValid = true
    isFeedbackPending = false
    verifyNumRef1:HTMLInputElement| null = null 
    verifyNumRef2:HTMLInputElement| null = null 
    verifyNumRef3:HTMLInputElement| null = null 
    verifyNumRef4:HTMLInputElement| null = null 
    verifyNumRef5:HTMLInputElement| null = null 
    verifyNumRef6:HTMLInputElement| null = null 
    verificationFor:VerificationType = VerificationType.signup
    isResettingPw = false
    doesUserExist = true
    showResetPwModal = false

    constructor(root:RootStore){
      this.root = root
      makeAutoObservable(this)
    }

    setDoesUserExist = action((bool:boolean)=>{
      this.doesUserExist = bool
    })

    setIsEmail = action((bool:boolean)=>{
      this.isEmail = bool
    })
    setShowResetPwModal = action((bool:boolean)=>{
      this.showResetPwModal = bool
    })

    setShowSuccessSnackbar = action((bool:boolean)=>{
      this.showSuccessSnackbar = bool
    })

    setMsg = action((str:string)=>{
      this.msg = str
    })

    setIsVerificationCodeValid = action((bool:boolean)=>{
      this.isVerificationCodeValid = bool
    })

    setVerifyNumRef = action((ref:HTMLInputElement, position:number)=>{
      switch (position) {
        case 0:
          this.verifyNumRef1 = ref
          break;
        case 1:
          this.verifyNumRef2 = ref
          break;
        case 2:
          this.verifyNumRef3 = ref
          break;
        case 3:
          this.verifyNumRef4 = ref
          break;
        case 4:
          this.verifyNumRef5 = ref
          break;
        case 5:
          this.verifyNumRef6 = ref
          break;
        default:
          break;
      }
    })

    setCurrentVerifyNum = action((num:string, position:number)=>{
      switch (position) {
        case 0:
          this.verifyNum1 = num
          break;
        case 1:
          this.verifyNum2 = num
          break;
        case 2:
          this.verifyNum3 = num
          break;
        case 3:
          this.verifyNum4 = num
          break;
        case 4:
          this.verifyNum5 = num
          break;
        case 5:
          this.verifyNum6 = num
          break;
        default:
          break;
      }
    })

    setCurrentLoginTitle = action((str:string)=>{
      this.currentLoginTitle = str
    })

    setShowLoginTitle = action((bool:boolean)=>{
      this.showLoginTitle = bool
    })

    setShowPhoneVerifyModal = action((bool:boolean)=>{
      this.showPhoneVerifyModal = bool
    })

    setTruncatedNum = action((str:string)=>{
      this.truncatedNum = str
    })

    setIsOptInChecked = action((bool:boolean)=>{
      this.isOptInChecked = bool
    })

    setAfterLoginNav = action((nav: AppRoute) => {
      this.afterLoginNav = nav;
    })
    setCanCloseLogin = action((bool:boolean)=>{
      this.canCloseLogin = bool
    })

    setEmailHelperTxt = action((txt: string) => {
      this.emailHelperTxt = txt;
    })

    setLoginTabValue = action((val: number) => {
      this.loginTabValue = val;
    })

    setIsTermsChecked = action((bool: boolean) => {
      this.isTermsChecked = bool;
    })

    setIsTermsError = action((bool: boolean) => {
      this.isTermsError = bool;
    })

    setIsResettingPw = action((bool:boolean)=>{
      this.isResettingPw = bool
    })

    setShowLoginModal = action((bool: boolean) => {
      this.showLoginModal = bool;

      if (bool === false) {
        this.showFeedbackHeader = false;
        this.showAccountHeader = false;
        this.showPointsHeader = false;
        this.isEmailError = false;
        this.isTermsChecked = false;
        this.emailHelperTxt = '';
      }
    })
    setShowForgotPasswordModal = action((bool:boolean)=>{
      this.showForgotPasswordModal = bool
    })

    resetCodeInput = action(()=>{
      this.verifyNum1 = ''
      this.verifyNum2 = ''
      this.verifyNum3 = ''
      this.verifyNum4 = ''
      this.verifyNum5 = ''
      this.verifyNum6 = ''
    })

    setShowFeedbackHeader = action((bool: boolean) => {
      this.showFeedbackHeader = bool;
    })

    setShowAccountHeader = action((bool: boolean) => {
      this.showAccountHeader = bool;
    })

    setShowPointsHeader = action((bool: boolean) => {
      this.showPointsHeader = bool;
    })

    setShowPolicyModal = action((bool: boolean) => {
      this.showPolicyModal = bool
    })

    setShowTermsModal = action((bool: boolean) => {
      this.showTermsModal = bool
    })

    setEmail = action((email: string) => {
      this.email = email;
    })

    setPassword = action((pass: string) => {
      this.password = pass;
    })

    setPasswordConfirm = action((pass: string) => {
      this.passwordConfirm = pass;
    })

    setShowSignIn = action((show: boolean) => {
      this.showSignIn = show;
    })

    setVerificationFor = action((vType:VerificationType)=>{
      this.verificationFor = vType
    })

    changeLoginTab = action ((event: React.SyntheticEvent, newValue: number) => {
      this.setVerificationFor(VerificationType.signup)
      this.setLoginTabValue(newValue);
    })

    setIsEmailError = action((bool: boolean) => {
      this.isEmailError = bool;
    })

    setIsPasswordError = action((bool: boolean) => {
      this.isPasswordError = bool;
    })

    setpwHelperText = action((txt: string) => {
      this.pwHelperText = txt;
    })

    setIsLoggingIn = action((bool: boolean) => {
      this.isLoggingIn = bool;
    })

    setIsFeedbackPending = action((bool: boolean) => {
      this.isFeedbackPending = bool;
    })

    handleFormValidation = action((email: string, pw: string) => {
      const isValidEmail = validator.isEmail(email);
      const isValidPhone = validator.isMobilePhone(email);
      let isValidPassword = true;

      const isValidForm = {
        isValid: true,
        isEmail: isValidEmail,
      };

      if (pw.length < 8) {
        isValidPassword = false;
        this.setIsPasswordError(true);
      }

      if (isValidEmail && isValidPassword) {
        return isValidForm;
      }

      if (isValidPhone && isValidPassword) {
        return isValidForm;
      }

      if (!isValidEmail && !isValidPhone) {
        this.setIsEmailError(true);
        isValidForm.isValid = false;
      }

      if (!isValidPassword) {
        this.setIsPasswordError(true);
        isValidForm.isValid = false;
      }

      return isValidForm;
    })

    // checkShouldShowLogin = action((currentPath:string, user:Realm.User)=>{
    //   const providerType = userViewStore.currUser?.getProviderType(user.providerType)
    //   const isMandatory = Object.values(MandatoryLoginPages).find((val)=>{
    //     return val === currentPath
    //   })

    //   if(
    //     providerType 
    //     && providerType === LoginType.anonymous
    //     && isMandatory
    //     ){
    //       this.setShowLoginModal(true)
    //   }
    // })

    handleGoogleSignUp = action(async(
      res:CredentialResponse, 
      googleSignUp:(str:string)=>any
    )=>{
      if(res.credential){
        const googleInfo = await googleSignUp(res.credential)
        if(googleInfo.realmUser.error){
          this.setEmailHelperTxt(googleInfo.realmUser.error)
          this.setIsEmailError(true)
          this.setIsLoggingIn(false)
          return
        }

        return googleInfo
      }

      return
    })  
}