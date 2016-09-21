var Botkit = require('botkit')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hello', 'hi'], ['direct_message', 'direct_mention'], function (bot, message) {
  controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hi, <@'+ message.user + '>! I hope you\'re doing well today.');
        } else {
            bot.reply(message, 'Hi, <@'+ message.user + '>!  What do you want to do?')
        }
    });
})

controller.hears(['track','change', 'changed','rate','grow','growth'], ['direct_message', 'direct_mention'], function (bot, message) {
  var attachments = [{
    title: 'Bar Chart or Line Chart',
    text: 'You will require either a bar chart or a line chart to better convey this information.',
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })
})

controller.hears(['compare','contrast', 'difference','opposed'], ['direct_message', 'direct_mention'], function (bot, message) {
  var attachments = [{
    title: 'Bubble or Scatter',
    text: 'You will require a Bar Mekko, Bubble or Scatter graph to better convey this information.',
    color: '#F5B279'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })


  var askNumber = function(err, convo) {
      convo.ask('How many companies would you like? (max. 5)', function(response, convo) {
        convo.say('Great.');
        askRegion(response, convo);
        convo.next();
      });
    };
    var askRegion = function(response, convo) {
      convo.ask('What region would you like the result comparison for? (Domestic or Global)', function(response, convo) {
        convo.say('Understood.')
        displayChart(response, convo);
        convo.next();
      });
    };

    var displayChart = function(response, convo) {
       var mainAttachments = [{
    title: 'Bubble or Scatter',
    text: 'Here it is.',
    image_url:'http://www.mekkographics.com/wp-content/uploads/2012/07/Bar-Mekko1.png',
    color: '#F5B279'
  }]
      convo.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })
    }
    bot.startConversation(message, askNumber);

});

controller.hears(['market share','segment', 'market','share', 'each'], ['direct_message', 'direct_mention'], function (bot, message) {
  var attachments = [{
    title: 'Marimekko or 100% Stacked Bar Graph',
    text: 'You will require a 100% Stacked bar graph or a Marimekko graph to better convey this information.',
    color: '#EF84B6'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })

})


controller.hears(['thanks','thx','thank you'], ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'No problem <@' + message.user + '>!')
})

// controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
//   bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
// })
