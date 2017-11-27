Accounts.oauth.registerService('discord');

Accounts.addAutopublishFields({
  forLoggedInUser: ['services.discord'],
  forOtherUsers: ['services.discord.username']
});

Discord = {};

OAuth.registerService('discord', 2, null, (query) => {

  const accessToken = getAccessToken(query);
  const user = getUser(accessToken);

  return {
    serviceData: _.extend(user, { accessToken: OAuth.sealSecret(accessToken) }),
    options: { 
      profile: { name: user.username }
    }
  };
});

const userAgent = 'HarleKings Website';

const getAccessToken = (query) => {
  const config = ServiceConfiguration.configurations.findOne({ service: 'discord' });
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  let response;
  try {
    response = HTTP.post(
      'https://discordapp.com/api/oauth2/token', {
        headers: {
          Accept: 'application/json',
          'User-Agent': userAgent
        },
        params: {
          grant_type: 'authorization_code',
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('discord', config),
          state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error('Fehler beim abschluss des Handshake mit Discord. ' + err.message),
      { response: err.response });
  }
  if (response.data.error) {
    throw new Error('Fehler beim abschluss des Handshake mit Discord. ' + response.data.error);
  } else {
    return response.data.access_token;
  }
};

const getUser = (accessToken) => {
  try {
    return HTTP.get(
      'https://discordapp.com/api/users/@me', {
        headers: {
          'User-Agent': userAgent,
          'Authorization': 'Bearer ' + accessToken
        }
      }).data;
  } catch (err) {
    throw _.extend(new Error('Fehler beim holen der Benutzerinformation von Discord. ' + err.message),
      { response: err.response });
  }
};

Discord.retrieveCredential = (credentialToken, credentialSecret) => OAuth.retrieveCredential(credentialToken, credentialSecret)

Accounts.onCreateUser((options, user) => {
  let email = user.services.discord.email
  let discord = user.services.discord

  if (!discord.verified) {
    throw new Meteor.Error("Bitte verifiziere deinen Discord Account zuerst!");
  }

  if (discord.mfa_enabled) {
    user.mfa_enabled = discord.mfa_enabled;
  }

  user.emails = [{address: email, verified: true}];

  /*api*/
  user.profile = Object.assign(options.profile, {
      realname: discord.username,
      nickname: discord.username,
      name: discord.username,
      bio: "",
      publishMail: false,
    },
    discord.avatar ? { avatar: `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png` } : {}
  );

  return user;
});
  
Accounts.validateLoginAttempt((options) => {
  if (options.allowed) {
    const id = options.user._id;
    const { discord } = options.user.services;

    const changes = Object.assign({}, {
      profile: Object.assign({},
        { username: discord.username },
        discord.avatar ? { avatar: `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png` } : {}),
      }, {
        emails: [{address: discord.email, verified: true}]
      },
      Object.assign({}, discord.mfa_enabled ? { mfa_enabled: discord.mfa_enabled} : {}),
    )

    Meteor.users.update(id, { $set: changes });
  }
//  console.log(options.user.services.discord);
  return true;
});