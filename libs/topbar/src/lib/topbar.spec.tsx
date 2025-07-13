import { render } from '@testing-library/react';

import Topbar from './topbar';

describe('Topbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Topbar />);
    expect(baseElement).toBeTruthy();
  });
});
