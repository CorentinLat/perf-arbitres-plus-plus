import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable({ providedIn: 'root' })
export class ElectronService {
    ipcRenderer: (typeof ipcRenderer) | null = null;
    webFrame: (typeof webFrame) | null = null;
    childProcess: (typeof childProcess) | null = null;
    fs: (typeof fs) | null = null;

    constructor() {
        if (this.isElectron) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;

            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
        }
    }

    get isElectron(): boolean {
        return !!(window && window.process && window.process.type);
    }
}