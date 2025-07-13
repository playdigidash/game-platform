import { render } from '@testing-library/react';

import Aws from './aws';

describe('Aws', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Aws />);
    expect(baseElement).toBeTruthy();
  });
});
