import fs from 'fs';
import path from 'path';

import logger from './logger';

export function copyFileToPath(filePath: string, newFilePath: string): void {
    fs.copyFileSync(filePath, newFilePath);
    logger.info(`Copy video succeeded: ${newFilePath}`);
}

export function removeFile(filePath: string): void {
    try {
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath, { force: true });
            logger.info(`File removed: ${filePath}`);
        }
    } catch {
        setTimeout(() => {
            try {
                fs.rmSync(filePath, { force: true });
                logger.info(`File removed: ${filePath}`);
            } catch {
                logger.error(`Failed to remove file: ${filePath}`);
            }
        }, 10000);
    }
}

export function extractFileExtension(fileName: string): string {
    return path.extname(fileName).slice(1).toLowerCase();
}
