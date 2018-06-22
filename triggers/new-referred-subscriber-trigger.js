//This function is used to register a zapier url with Early Parrot.
const registerHook = (z, bundle) => {

  const campaignId = bundle.inputData.campaignId;

  z.console.log(`Zapier target url ${bundle.targetUrl}`);

  // bundle.targetUrl has the Hook URL this app should call when a subscriber is created.
  const data = {
    url: bundle.targetUrl
  };

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `https://devadmin.earlyparrot.com/api/campaigns/${campaignId}/newSubscriberZapier`,
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json; charset=utf-8'
    },
    body: JSON.stringify(data)
  };

  z.console.log(`Registering hook with following options ${options}`);

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

const unregisterHook = (z, bundle) => {

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `https://devadmin.earlyparrot.com/api/campaigns/${campaignId}/newSubscriberZapier`,
    method: 'DELETE',
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

const getSubscriber = (z, bundle) => {
  // bundle.cleanedRequest will include the parsed JSON object (if it's not a
  // test poll) and also a .querystring property with the URL's query string.
  const subscriber = {
    subscriberId: bundle.cleanedRequest.subscriberId,
    campaignId: bundle.cleanedRequest.campaignId,
    firstname: bundle.cleanedRequest.firstname,
    lastname: bundle.cleanedRequest.lastname,
    email: bundle.cleanedRequest.email
  };

  return [subscriber];
};

const getFallbackRealSubscriber = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  const options = {
    url: 'http://5b1a857783b6190014ca3ad6.mockapi.io/api/subscriber', //TODO
    params: {
      campaignId: bundle.inputData.campaignId
    }
  };

  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {

  key: 'newSubscriberTrigger',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'New Subscriber',
  display: {
    label: 'New Subscriber',
    description: 'Trigger when a new subscriber is added.'
  },

  // `operation` is where the business logic goes.
  operation: {

    // `inputFields` can define the fields a user could provide in the zapier interface
    // we'll pass them in as `bundle.inputData` later.
    inputFields: [
      //TODO eventually this should be a dropdown list of campaigns
      {key: 'campaignId', required: true, label: 'Campaign Id', type: 'string', helpText: 'The ID of the campaign with which the subscriber is associated'}

    ],

    type: 'hook',

    performSubscribe: registerHook,
    performUnsubscribe: unregisterHook,

    perform: getSubscriber,
    performList: getFallbackRealSubscriber,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
         "subscriberId":"5a9d2de2e801f464911251b6",
         "campaignId":"5a96e836abc9f47c36ef360c",
         "firstname":"Joe",
         "lastname":"Smith",
         "email":"joe@gmail.com"
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      {key: 'subscriberId', label: 'Subscriber ID'},
      {key: 'campaignId', label: 'Campaign ID'},
      {key: 'firstname', label: 'First Name'},
      {key: 'lastname', label: 'Last Name'},
      {key: 'email', label: 'Email Address'},
    ]
  }
};