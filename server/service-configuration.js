// Config zu Discord als Login Provider
ServiceConfiguration.configurations.remove({
  service: 'discord'
});

ServiceConfiguration.configurations.insert({
  service: 'discord',
  clientId: process.env.DISCORD_CLIENT_ID || '384760848528179210',
  secret: process.env.DISCORD_CLIENT_SECRET ||'0dMQaQ5cFQkCyBwdc07bX7EwP7kZnqEM'
});

// Deny der schreibzugriffe auf die User Collection
// Besonders auf das Profil feld. -Nicht das uns jemand die DB zumüllt
Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});