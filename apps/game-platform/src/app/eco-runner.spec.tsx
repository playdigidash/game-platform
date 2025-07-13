import { render } from '@testing-library/react';

import EcoRunner from './eco-runner';

describe('EcoRunner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EcoRunner />);
    expect(baseElement).toBeTruthy();
  });
});
