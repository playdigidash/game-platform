import { IDbQuestion } from '@lidvizion/commonlib';

/**
 * Standard tutorial question data - always the sky color question
 * with Blue as the first and correct answer
 */
export const TUTORIAL_QUESTION_DATA = {
  xformedQ: JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Sample question: What is the primary color of the sky on a clear day?',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }),
  answers: [
    { txt: 'Blue', color: '#0000FF' }, // blue
    { txt: 'Green', color: '#008000' }, // green
    { txt: 'Red', color: '#FF0000' }, // red
    { txt: 'Yellow', color: '#FFFF00' } // yellow
  ],
  hints: [
    {
      title: 'Sample Hint',
      xformedH: JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Select Blue to complete the tutorial.',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      }),
    }
  ],
  correctAnswerIdx: 0, // Blue is always the correct answer
  id: 'tutorial-q-1',
  isTutorial: true // Explicitly mark this as a tutorial question
} as IDbQuestion; 