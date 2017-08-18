import { describe, it } from 'mocha';
import { assert } from 'chai';

import { sendQuery, sendQueryAndExpect } from './sendQuery';

describe('mutations', () => {
  describe('users', () => {
    it('can do CRUD', () => {
      function makeInput(user) {
        return `{
          username: "${user.username}",
          bio: "${user.bio}",
          role: "${user.role}"
        }`;
      }

      const expectedUser = {
        username: 'zol',
        bio: 'Maker of apps, product and engineering. Climber. Cyclist. Enthusiast. Product lead',
        role: 'admin'
      };

      const modifiedUser = {
        username: 'zoltan',
        bio: 'Maker of things, I guess',
        role: 'admin'
      };

      let userId;
      return sendQuery({ query: `
        mutation {
          createUser(input: ${makeInput(expectedUser)}) {
            id
          }
        }
      ` })
      .then((result) => {
        assert.isNotNull(result.data);
        assert.isNotNull(result.data.createUser);
        assert.isNotNull(result.data.createUser.id);
        userId = result.data.createUser.id;
      })
      .then(() =>
        sendQueryAndExpect(
          `{ user(id: "${userId}") { username, bio, role } }`,
          { user: expectedUser })
      )
      .then(() =>
        sendQueryAndExpect(`
          mutation {
            updateUser(id: "${userId}", input: ${makeInput(modifiedUser)}) {
              username
              bio
              role
            }
          }
        `, { updateUser: modifiedUser })
      )
      .then(() =>
        sendQueryAndExpect(
          `{ user(id: "${userId}") { username, bio, role } }`,
          { user: modifiedUser })
      )
      .then(() =>
        sendQueryAndExpect(
          `mutation { removeUser(id: "${userId}") }`,
          { removeUser: true })
      )
      .then(() =>
        sendQueryAndExpect(
          `{ user(id: "${userId}") { username, bio, role } }`,
          { user: null })
      );
    });
  });

  describe('tweets', () => {
    it('can do CRUD', () => {
      function makeInput(tweet) {
        if (tweet.author) {
          return `{
            authorId: "${tweet.author.id}",
            body: "${tweet.body}"
          }`;
        }
        return `{
          body: "${tweet.body}"
        }`;
      }

      const expectedTweet = {
        author: { id: '583291a1638566b3c5a92ca1' },
        body: 'This is a test tweet',
      };

      const modifiedTweet = {
        body: 'This is a modified test',
      };

      let tweetId;
      return sendQuery({ query: `
        mutation {
          createTweet(input: ${makeInput(expectedTweet)}) {
            id
          }
        }
      ` })
      .then((result) => {
        assert.isNotNull(result.data);
        assert.isNotNull(result.data.createTweet);
        assert.isNotNull(result.data.createTweet.id);
        tweetId = result.data.createTweet.id;
        console.log('tweetId', tweetId);
      })
      .then(() =>
        sendQueryAndExpect(
          `{ tweet(id: "${tweetId}") { author { id } body } }`,
          { tweet: expectedTweet })
      )
      .then(() =>
        sendQueryAndExpect(`
          mutation {
            updateTweet(id: "${tweetId}", input: ${makeInput(modifiedTweet)}) {
              body
            }
          }
        `, { updateTweet: modifiedTweet })
      )
      .then(() =>
        sendQueryAndExpect(
          `{ tweet(id: "${tweetId}") { body } }`,
          { tweet: modifiedTweet })
      )
      .then(() =>
        sendQueryAndExpect(
          `mutation { removeTweet(id: "${tweetId}") }`,
          { removeTweet: true })
      )
      .then(() =>
        sendQueryAndExpect(
          `{ tweet(id: "${tweetId}") { body } }`,
          { tweet: null })
      );
    });
  });
});
