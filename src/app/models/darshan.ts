export class Darshan {
    url: string;
    placeholder?: string;
    isLoaded?: boolean;
    isLoading?: boolean;
    fileName: string;
    isDownloaded?: Promise<boolean>;
    isError?: boolean;
    localUrl?: string;
    constructor(obj?: any) {
      this.url = (obj && obj.url) || '';
      this.placeholder = (obj && obj.placeholder) || '';
      this.localUrl = (obj && obj.localUrl) || '';
      this.fileName = (obj && obj.fileName) || '';
      this.isLoaded = (obj && obj.isLoaded) || false;
      this.isLoading = (obj && obj.isLoading) || false;
      this.isError = (obj && obj.isError) || false;
      this.isDownloaded = (obj && obj.isDownloaded) || false;
    }
  }
