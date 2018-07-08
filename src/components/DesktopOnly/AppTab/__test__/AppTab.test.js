import React from 'react';
import renderer from 'react-test-renderer';
import AppTab from '../../AppTab';

describe('The <AppTab /> Component', () => {
  it('renders without crashing passing props', () => {
    const tree = renderer.create(<AppTab content={{images: []}} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
