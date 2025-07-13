import { render } from '@testing-library/react';

import Commonlib from './commonlib';

describe('Commonlib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Commonlib />);
    expect(baseElement).toBeTruthy();
  });
});
