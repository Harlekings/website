Accounts.oauth.registerService('discord');

Discord = {};

Discord.requestCredential = (options, credentialRequestCompleteCallback) => {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  const config = ServiceConfiguration.configurations.findOne({ service: 'discord' });
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  const credentialToken = Random.secret();

  const scope = (options && options.requestPermissions) || ['identify', 'email', 'guilds.join', 'gdm.join'];
  const flatScope = _.map(scope, encodeURIComponent).join('+');
  const loginStyle = OAuth._loginStyle('discord', config, options);

  const loginUrl =
    'https://discordapp.com/api/oauth2/authorize' +
    '?client_id=' + config.clientId +
    '&response_type=code' +
    '&scope=' + flatScope +
    '&redirect_uri=' + OAuth._redirectUri('discord', config) +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl);

  OAuth.launchLogin({
    loginService: 'discord',
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken,
    popupOptions: { width: 450, height: 660 }
  });
};

Meteor.loginWithDiscord = async (options = null) => {
  return new Promise((resolve, reject) => {
    const credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler((err, res) => {
      if (err) return reject(err);

      return resolve();
    });

    Discord.requestCredential(options, credentialRequestCompleteCallback);
  })
};