import { render } from '@testing-library/react';

import Award from './award';

describe('Award', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Award />);
    expect(baseElement).toBeTruthy();
  });
});
