import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import { IRecyclable } from '../search';
import userEvent from '@testing-library/user-event';

const recyclables: IRecyclable[][] = [
  [
    {
      type: 'Plastic',
      fact: 'fact',
      items: [
        { item: 'Cups', isNearby: true, isAccepted: false, isDropoff: true },
        { item: 'Spoons', isNearby: true, isAccepted: false, isDropoff: true },
        { item: 'Bottles', isNearby: true, isAccepted: false, isDropoff: true },
      ],
    },
  ],
  [
    {
      type: 'Metal',
      fact: 'fact',
      items: [
        {
          item: 'Aluminum cans',
          isNearby: true,
          isAccepted: false,
          isDropoff: true,
        },
        {
          item: 'Steel cans',
          isNearby: true,
          isAccepted: false,
          isDropoff: true,
        },
      ],
    },
  ],
];

describe('Search Bar', () => {
  it('should render the options correctly', () => {
    const onChildClickHandler = jest.fn();

    render(
      <SearchBar
        items={recyclables}
        onChildClickHandler={onChildClickHandler}
      />
    );

    // const searchInput = screen.getByLabelText('Search recyclables...');
    const searchInput = screen.getByLabelText('Search recyclables...');
    userEvent.type(searchInput, 'spoons');

    const option1 = screen.findByText('Cups');
    const option2 = screen.findByText('Boxes');
    const option3 = screen.queryByText('Non-existent Item');

    expect(option1).toBeTruthy();
    expect(option2).toBeTruthy();
    expect(option3).toBeFalsy();
  });

  it('should call onChildClickHandler with the correct option when a selection is made', async () => {
    const onChildClickHandler = jest.fn();

    const { getByLabelText } = render(
      <SearchBar
        items={recyclables}
        onChildClickHandler={onChildClickHandler}
      />
    );

    const inputElement = getByLabelText('Search recyclables...');
    await userEvent.type(inputElement, 'Cups');
    await userEvent.keyboard('{arrowdown}');
    await userEvent.keyboard('{enter}');

    expect(onChildClickHandler).toHaveBeenCalled()
  });
});
