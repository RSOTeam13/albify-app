const apolloOverrides = ({ app }) => {
  // disable caching on all the queries
  app.apolloProvider.defaultClient.defaultOptions = {
    query: {
      fetchPolicy: 'no-cache',
    },
  };
};

export default apolloOverrides;
