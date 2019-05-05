import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { AlertController } from '@ionic/angular';

declare var cordova: any;


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  files: Promise<any>;
  constructor(
    private file: File,
    public alertController: AlertController
    ) { }

  ngOnInit() {
  }

  getFiles(directory: string) {
    return this.file.listDir(cordova.file.dataDirectory, directory)
      .then(files => files)
      .catch(err => err);
  }
  async clearCache() {
    this.presentClearAlert();
  }

  async clearAudios() {
    const files = await this.getFiles('audios');
    files.forEach(file => {
      this.removeFile(file, 'audios');
    });
  }

  async clearImages() {
    const files = await this.getFiles('images');
    files.forEach(file => {
      this.removeFile(file, 'images');
    });
  }

  removeFile(file, directory) {
    this.file.removeFile(`${cordova.file.dataDirectory}${directory}/`, file.name)
      .then(_ => {
      })
      .catch(_ => {
      });
  }

  async presentClearAlert() {
    const alert = await this.alertController.create({
      header: 'Hare Krishna',
      subHeader: '',
      message: 'This will delete all your downladed audios and images. Are you sure?',
      buttons: [
        {
          text: 'Delete',
          role: 'delete',
          cssClass: 'delete-button',
          handler: (_) => {
            this.clearAudios();
            this.clearImages();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (_) => {
          }
        }
      ]
    });

    await alert.present();
  }
}
