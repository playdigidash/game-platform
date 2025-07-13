import { render } from '@testing-library/react';

import { Search } from './search';

describe('Search', () => {
  const onChildClickHandler = jest.fn()
  const changeTabValue = jest.fn()
  

  it('should render successfully', () => {
    const { baseElement } = render(
      <Search
        onChildClickHandler={onChildClickHandler}
        changeTabValue={changeTabValue}
        searchTabValue={1}
        pickupItems={[]}
        dropoffItems={[]}
        yardItems={[]}
        furnitureItems={[]}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
