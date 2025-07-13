import { environmentConfig } from '../config/EnvironmentConfig';

// * central translation function used in other specialized functions

export async function getTranslation (text: string, to: string): Promise<string> {
  if (!text) throw new Error('Missing/invalid input string.')
  if (!to) throw new Error('Missing/invalid language string.')
 
  const msConfig = environmentConfig.getMicrosoftConfig();
  if (!msConfig) {
    throw new Error('Microsoft Translate is not configured. Translation features are only available in the cloud version.');
  }

  const apiKey = environmentConfig.getConfig().msTranslateApiKey;
  const region = environmentConfig.getConfig().msTranslateServerRegion;
  
  if (!apiKey || !region) {
    throw new Error('Microsoft Translate API key or region not configured. Translation features are only available in the cloud version.');
  }
 
  try {
    const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${to}`;
    const headers = {
      'Ocp-Apim-Subscription-Key': `${apiKey}`,
      'Ocp-Apim-Subscription-Region': `${region}`,
      'Content-type': 'application/json',
      'X-ClientTraceId': '986c2544-e2ec-11ed-b5ea-0242ac120002'
    }
    const body = JSON.stringify([{ "Text": text }]);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: body
    })
    const data = await response.json()

    // translates only one language at a time
    const translatedText = data[0]?.translations[0].text ?? ''

    return translatedText
  } catch (err) {
    console.error(err)
    
    throw new Error(`Error translating request!`)
  }
}
