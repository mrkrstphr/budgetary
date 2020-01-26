import { shallow } from 'enzyme';
import React from 'react';
import Goal from './Goal';

describe('components/Goal', () => {
  describe('for account type = bank', () => {
    it('should render a 0% goal on a bank account with 0 balance', () => {
      const component = shallow(
        <Goal
          goal={{
            description: 'Foo',
            account: {
              currentBalance: 0,
              name: 'My Bank',
              type: 'bank',
            },
            startingBalance: 0,
            goalBalance: 400,
          }}
        />,
      );
      const styles = component.find('.progress').get(0).props.style;
      expect(styles.width).toEqual('0%');
    });

    it('should render a 100% goal on a bank account with a matching goal balance', () => {
      const component = shallow(
        <Goal
          goal={{
            description: 'Have lots-o-money',
            account: {
              currentBalance: 300,
              name: 'My Other Bank',
              type: 'bank',
            },
            startingBalance: 0,
            goalBalance: 300,
          }}
        />,
      );
      const styles = component.find('.progress').get(0).props.style;
      expect(styles.width).toEqual('100%');
    });

    it('should render a 100% goal when the balance is over the goal', () => {
      const component = shallow(
        <Goal
          goal={{
            description: 'Break the bank',
            account: {
              currentBalance: 650,
              name: 'My Other, Other Bank',
              type: 'bank',
            },
            startingBalance: 0,
            goalBalance: 500,
          }}
        />,
      );
      const styles = component.find('.progress').get(0).props.style;
      expect(styles.width).toEqual('100%');
    });

    it('should render a 0% goal when the balance falls below the starting balance', () => {
      const component = shallow(
        <Goal
          goal={{
            description: 'Survive',
            account: {
              currentBalance: 1,
              name: 'Some Other Bank',
              type: 'bank',
            },
            startingBalance: 3500,
            goalBalance: 15000,
          }}
        />,
      );
      const styles = component.find('.progress').get(0).props.style;
      expect(styles.width).toEqual('0%');
    });
  });

  describe('for account type = liabilities', () => {
    it('should render the correct percentage', () => {
      const component = shallow(
        <Goal
          goal={{
            description: 'Make progress on student loans',
            account: {
              currentBalance: 2100,
              name: 'Student Loan X',
              type: 'liabilities',
            },
            startingBalance: 4000,
            goalBalance: 2000,
          }}
        />,
      );
      const styles = component.find('.progress').get(0).props.style;
      expect(styles.width).toEqual('50%');
    });

    it('should render 0% when the current balance matches the goal balance', () => {
      const component = shallow(
        <Goal
          goal={{
            description: 'Pay off student loans',
            account: {
              currentBalance: 0,
              name: 'Student Loan X',
              type: 'liabilities',
            },
            startingBalance: 2900,
            goalBalance: 0,
          }}
        />,
      );
      const styles = component.find('.progress').get(0).props.style;
      expect(styles.width).toEqual('0%');
    });

    it('should render 0% when the current balance matches the goal balance that is not 0', () => {
      const component = shallow(
        <Goal
          goal={{
            description: 'Pay off (most of) student loans',
            account: {
              currentBalance: 500,
              name: 'Student Loan Y',
              type: 'liabilities',
            },
            startingBalance: 11000,
            goalBalance: 500,
          }}
        />,
      );
      const styles = component.find('.progress').get(0).props.style;
      expect(styles.width).toEqual('0%');
    });
  });
});
