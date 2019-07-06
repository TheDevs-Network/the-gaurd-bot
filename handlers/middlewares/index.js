'use strict';

const { Composer } = require('telegraf');

const composer = new Composer();

const { deleteAfter } = require('../../utils/tg');
const { deleteJoinsAfter = '2 minutes' } = require('../../config');

const addedToGroupHandler = require('./addedToGroup');
const antibotHandler = require('./antibot');
const checkLinksHandler = require('./checkLinks');
const kickBannedHandler = require('./kickBanned');
const kickedFromGroupHandler = require('./kickedFromGroup');
const leaveUnmanagedHandler = require('./leaveUnmanaged');
const removeChannelForwardsHandler = require('./removeChannelForwards');
const removeCommandsHandler = require('./removeCommands');
const syncStatusHandler = require('./syncStatus');
const updateUserDataHandler = require('./updateUserData');
const presenceLogHandler = require('./logPresence');
const updateGroupTitleHandler = require('./updateGroupTitle');

composer.on('new_chat_members', addedToGroupHandler);
composer.on('left_chat_member', kickedFromGroupHandler);
composer.use(leaveUnmanagedHandler);
composer.on('message', updateUserDataHandler);
composer.on('new_chat_members', syncStatusHandler, antibotHandler);
composer.on('message', kickBannedHandler);
composer.use(removeChannelForwardsHandler);
composer.on([ 'edited_message', 'message' ], checkLinksHandler);
composer.on('new_chat_title', updateGroupTitleHandler);
composer.on('text', removeCommandsHandler);
composer.on(
	[ 'new_chat_members', 'left_chat_member' ],
	deleteAfter(deleteJoinsAfter),
	presenceLogHandler,
);

module.exports = composer;
