import { render } from '@testing-library/react';

import { Topbar } from './top-bar';

describe('Topbar', () => {
  it('should render successfully', () => {
    const changeTabValue = jest.fn();

    const { baseElement } = render(
      <Topbar 
        searchTabValue={1} 
        changeTabValue={changeTabValue}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
