import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { File } from '@ionic-native/file/ngx';
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';


declare var cordova: any;

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {

  constructor(
    private iab: InAppBrowser,
    private safariViewController: SafariViewController,
    private file: File,
    private transfer: FileTransfer
  ) { }

  ngOnInit() {
  }

  async openLink(type: string) {
    let url;

    switch (type) {
      case 'english':
        url = 'https://avd-bapuji.sfo2.digitaloceanspaces.com/NKM/Naam-Ki-Mahima-English.pdf';
        this.checkBrowser(url);
        break;
      case 'hindi':
        url = 'https://avd-bapuji.sfo2.digitaloceanspaces.com/NKM/Naam-Ki-Mahima-Hindi.pdf';
        this.checkBrowser(url);
        break;
      default:
        break;
    }
  }

  checkBrowser(url: string) {
    this.safariViewController.isAvailable()
      .then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: url,
            hidden: false,
            animated: true,
            transition: 'slide',
            enterReaderModeIfAvailable: true
          })
            .subscribe((result: any) => {
              if (result.event === 'opened') {
                console.log('Opened');
              } else if (result.event === 'loaded') {
                console.log('Loaded');
              } else if (result.event === 'closed') {
                console.log('Closed');
              }
            },
              (error: any) => console.error(error)
            );
        } else {
          // use fallback browser, example InAppBrowser
          this.iab.create(url, '_system');
        }
      }
      );
  }
  checkIfDownloaded(title): Promise<boolean> {
    return this.file
      .checkFile(cordova.file.dataDirectory + 'books/', title + '.pdf').
      then(_ => {
        return true;
      }).
      catch(_ => {
        return false;
      });
  }

  download(title, url) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer
      .download(url, cordova.file.dataDirectory + 'books/' + title + '.pdf')
      .then(
        _ => {
          console.log('complete');
        },
        _ => {
          // handle error
          console.log('error');
        }
      );
  }
}
