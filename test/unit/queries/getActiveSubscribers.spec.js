const { expect } = require('chai');
const {
  aggregate,
  insertResource,
  dropResourceCollections,
} = require('../../helper');
const { dbUrl, createClient } = require('../../db');

// query
const getActiveSubscribers = require('../../../src/queries/getActiveSubscribers.json');

describe('Query for finding all active subscribers', () => {
  let db;
  describe('When a member is not active, the query', () => {
    before(async () => {
      ({ db } = await createClient(dbUrl));
      const member = {
        _id: 'HUYR12Qi9PLqa',
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bobwilliams@gmail.com',
        phone: '(800)-123-4321',
        gender: 'male',
        active: false,
      };
      await insertResource(db, 'member', member);
    });

    after(async () => {
      await dropResourceCollections(db, ['member']);
    });

    it('should return an empty result', async () => {
      const result = await aggregate(db, 'member', getActiveSubscribers);
      expect(result).to.be.empty;
    });
  });

  describe('When a member is active', () => {
    before(async () => {
      const member = {
        _id: 'HUYR12Qi9PLqa',
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bobwilliams@gmail.com',
        phone: '(800)-123-4321',
        gender: 'male',
        active: true,
      };

      await insertResource(db, 'member', member);
    });

    after(async () => {
      await dropResourceCollections(db, ['member']);
    });

    describe('and they have an active subscription', () => {
      before(async () => {
        const subscription = {
          _id: 'HJDYET61WihQW',
          active: true,
          startDate: '03/21/2019',
          endDate: '03/21/2020',
          member: {
            reference: 'HUYR12Qi9PLqa',
          },
        };
        await insertResource(db, 'subscription', subscription);
      });

      after(async () => {
        await dropResourceCollections(db, ['subscription']);
      });
      it('the query should return the ID of that member', async () => {
        const result = await aggregate(db, 'member', getActiveSubscribers);
        expect(result).to.eql([{ _id: 'HUYR12Qi9PLqa' }]);
      });
    });
  });
});
