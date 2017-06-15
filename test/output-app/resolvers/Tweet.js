const resolvers = {
  Tweet: {
    id(tweet) {
      return tweet._id;
    },

    author(tweet, args, { Tweet, _user }) {
      return Tweet.author(tweet, _user);
    },

    createdBy(tweet, args, { Tweet, _user }) {
      return Tweet.createdBy(tweet, _user);
    },

    updatedBy(tweet, args, { Tweet, _user }) {
      return Tweet.updatedBy(tweet, _user);
    },

    coauthors(tweet, { lastCreatedAt, limit }, { Tweet, _user }) {
      return Tweet.coauthors(tweet, { lastCreatedAt, limit }, _user);
    },

    likers(tweet, { lastCreatedAt, limit }, { Tweet, _user }) {
      return Tweet.likers(tweet, { lastCreatedAt, limit }, _user);
    },
  },
  Query: {
    tweets(root, { lastCreatedAt, limit }, { Tweet, _user }) {
      return Tweet.all({ lastCreatedAt, limit }, _user, 'tweets');
    },

    tweet(root, { id }, { Tweet, _user }) {
      return Tweet.getOneById(id, _user, 'tweet');  
    },
  },
  Mutation: {
    async createTweet(root, { input }, { Tweet, _user }) {
      const id = await Tweet.insert(input, _user);
      return Tweet.getOneById(id, _user, 'createTweet'); 
    },

    async updateTweet(root, { id, input }, { Tweet, _user }) {
      await Tweet.updateById(id, input, _user);
      return Tweet.getOneById(id, _user, 'updateTweet');
    },

    async removeTweet(root, { id }, { Tweet, _user }) {
      return await Tweet.removeById(id, _user);
    },
  },
  Subscription: {
    tweetCreated: tweet => tweet,
    tweetUpdated: tweet => tweet,
    tweetRemoved: id => id,
  },
};

export default resolvers;
