export class Audio {
    title: string;
    url: string;
    subTitle: string;
    isSaved: boolean;
    isDownloading: boolean;
    isDownloaded: Promise<boolean>;
    progress: number;
    audioPath: string;
    promise: Promise<any>;
    result: any;
    constructor(obj?: any) {
      this.title = (obj && obj.title) || '';
      this.subTitle = (obj && obj.subTitle) || '';
      this.audioPath = (obj && obj.audioPath) || '';
      this.progress = (obj && obj.progress) || 0;
      this.url = (obj && obj.url) || '';
      this.isSaved = (obj && obj.isSaved) || false;
      this.isDownloading = (obj && obj.isDownloading) || false;
      this.isDownloaded = (obj && obj.isDownloaded) || false;
      this.promise = (obj && obj.promise) || 'hello';
      this.result = (obj && obj.result) || 'hello';
    }
  }
