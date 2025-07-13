// * translate function for standard text strings

import * as React from 'react'

import { getTranslation } from "./get-ms-translate";

interface ITranslationProps {
  toTranslate: string[],
  language: string,
  setTranslation: (tr: string[]) => void,
  storageKey?: string | null,
  useLS?: boolean
}

export const msTranslate = ({
  toTranslate,
  language,
  setTranslation,
  storageKey = null,
  useLS = true
}: ITranslationProps) => {

  // only use translate if not english
  if (language === 'en-US' || language === 'en') {
    setTranslation(toTranslate);
    return;
  }

  // only translate if no translation in localStorage & should store
  const stored = useLS ? null : getStoredTranslation(storageKey)
  if (stored) {
    /*
      TODO: 
      Check if stored en translation matches toTranslate 
      - if SO  : use stored translation
      - if NOT : move to machine translation
    */

    setTranslation(stored)
    return
  }

  const msFormatted = toTranslate
  .map((str, idx) => {
    // add marker between toTranslate members
    const isLast = idx === toTranslate.length - 1
    
    return isLast ? str : `${str}*`
  })
  .join(' ');

  getTranslation(msFormatted, language).then((translation: string) => {
    const splitTrans = translation.split('*');

    if (useLS) storeTranslation(storageKey, splitTrans)
    setTranslation(splitTrans);
  });
}
export function getStoredTranslation(storageKey: string | null) {
  const storedTranslation = localStorage.getItem(`${storageKey}`)
  const parsed = storedTranslation ? JSON.parse(`${storedTranslation}`) : null
  const translation = parsed?.translation ?? null

  return translation
}
export function storeTranslation(storageKey: string | null, translation: string[],) {
  const transObj = { translation }

  localStorage.setItem(`${storageKey}`, JSON.stringify(transObj))
}