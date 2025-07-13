import { getTranslation } from './get-ms-translate'

describe('getTranslation', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('returns a string when passed valid parameters', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ translations: [{ text: 'Hello' }] }])
      })
    ) as jest.Mock

    const result = await getTranslation('Bonjour', 'en')

    expect(typeof result).toBe('string')
    expect(result).toEqual('Hello')
  })

  it('throws an error when passed invalid parameters', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))

    await expect(getTranslation('', '')).rejects.toThrow(Error)
  })

  it('makes a POST request to the Microsoft Translator API with the correct headers and body', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ translations: [{ text: 'Hello' }] }])
      })
    )

    global.fetch = mockFetch as jest.Mock

    await getTranslation('Bonjour', 'en')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Ocp-Apim-Subscription-Key': expect.any(String),
          'Ocp-Apim-Subscription-Region': expect.any(String),
          'Content-type': 'application/json',
          'X-ClientTraceId': expect.any(String)
        }),
        body: expect.any(String)
      })
    )
  })

  it('correctly extracts the translated text from the response data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ translations: [{ text: 'Hello' }] }])
      })
    ) as jest.Mock

    const result = await getTranslation('Bonjour', 'en')

    expect(result).toEqual('Hello')
  })

  it('handles errors from the API and throws an error.', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Error translating request!')))

    await expect(getTranslation('Bonjour', 'en')).rejects.toThrow()
  })
})