import IpcMain = Electron.IpcMain;
import IpcMainEvent = Electron.IpcMainEvent;

import logger from './utils/logger';
import {
    NewAction,
    addNewActionToGame,
    createNewGameFile,
    getGame,
    removeActionFromGame,
    removeGame,
} from './utils/game';
import { checkGameFolderExists, getExistingGameFolders } from './utils/path';
import { concatVideos, copyVideoToUserDataPath } from './utils/video';

export default function(ipcMain: IpcMain) {
    ipcMain.on('get_existing_games', onInitAppListener);
    ipcMain.on('create_new_game', onCreateNewGameListener);
    ipcMain.on('get_game', onGetGameListener);
    ipcMain.on('remove_game', onRemoveGameListener);
    ipcMain.on('add_action', onAddActionListener);
    ipcMain.on('remove_action', onRemoveActionListener);
}

const onInitAppListener = async (event: IpcMainEvent) => {
    logger.debug('OnInitAppListener');

    const gameNumbers = await getExistingGameFolders();

    event.reply('get_existing_games_succeeded', gameNumbers);
};

type OnCreateNewGameListenerArgs = { force?: boolean; gameNumber: string; videoPaths: string[] };
const onCreateNewGameListener = async (event: IpcMainEvent, { force, gameNumber, videoPaths }: OnCreateNewGameListenerArgs) => {
    logger.debug('OnCreateNewGameListener');

    if (!videoPaths.length) {
        logger.error('No video to handle');
        event.reply('create_new_game_failed');
    }

    try {
        const alreadyExisting = checkGameFolderExists(gameNumber, force);
        if (alreadyExisting) {
            event.reply('create_new_game_failed', { alreadyExisting: true });
            return;
        }

        let videoPath;
        if (videoPaths.length > 1) {
            videoPath = await concatVideos(gameNumber, videoPaths, event);
        } else {
            videoPath = await copyVideoToUserDataPath(gameNumber, videoPaths[0], event);
        }

        createNewGameFile(gameNumber, videoPath);

        event.reply('create_new_game_succeeded', gameNumber);
    } catch (error) {
        logger.error(`error OnCreateNewGameListener: ${error}`);
        event.reply('create_new_game_failed', error);
    }
};

type OnGetGameListenerArgs = { gameNumber: string };
const onGetGameListener = (event: IpcMainEvent, { gameNumber }: OnGetGameListenerArgs) => {
    logger.debug('OnGetGameListener');

    const game = getGame(gameNumber);
    if (game) {
        event.reply('get_game_succeeded', game);
    } else {
        event.reply('get_game_failed');
    }
};

type OnRemoveGameListenerArgs = { gameNumber: string };
const onRemoveGameListener = (event: IpcMainEvent, { gameNumber }: OnRemoveGameListenerArgs) => {
    logger.debug('OnRemoveGameListener');

    const gameRemoved = removeGame(gameNumber);
    if (gameRemoved) {
        event.reply('remove_game_succeeded');
    } else {
        event.reply('remove_game_failed');
    }
};

type OnAddActionListenerArgs = { newAction: NewAction; gameNumber: string };
const onAddActionListener = (event: IpcMainEvent, { newAction, gameNumber }: OnAddActionListenerArgs) => {
    logger.debug('OnAddActionListener');

    const action = addNewActionToGame(gameNumber, newAction);
    if (action) {
        event.reply('add_action_succeeded', action);
    } else {
        event.reply('add_action_failed');
    }
};

type OnRemoveActionListenerArgs = { actionId: string; gameNumber: string };
const onRemoveActionListener = (event: IpcMainEvent, { actionId, gameNumber }: OnRemoveActionListenerArgs) => {
    logger.debug('OnRemoveActionListener');

    const isRemoved = removeActionFromGame(gameNumber, actionId);
    if (isRemoved) {
        event.reply('remove_action_succeeded');
    } else {
        event.reply('remove_action_failed');
    }
};
