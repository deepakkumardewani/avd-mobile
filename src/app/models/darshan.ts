export class Darshan {
    url: string;
    isLoaded: boolean;
    fileName: string;
    isDownloaded?: Promise<boolean>;
    constructor(obj?: any) {
      this.url = (obj && obj.url) || '';
      this.fileName = (obj && obj.fileName) || '';
      this.isLoaded = (obj && obj.isLoaded) || false;
      this.isDownloaded = (obj && obj.isDownloaded) || false;
    }
  }
