import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { TranslateService } from './i18n/translate.service';

export interface ConfirmOptions {
  title: string;
  message: string;
  cancelText?: string;
  confirmText: string;
  destructive?: boolean;
}

/** Diálogos do app, no lugar do $ionicPopup do AngularJS. */
@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly alertController = inject(AlertController);
  private readonly translate = inject(TranslateService);

  async alert(title: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['OK'],
      backdropDismiss: false,
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  /** Atalhos com os títulos padronizados do app. */
  warning(message: string): Promise<void> {
    return this.alert(this.translate.instant('popupWarning'), message);
  }

  error(message: string): Promise<void> {
    return this.alert(this.translate.instant('popupError'), message);
  }

  success(message: string): Promise<void> {
    return this.alert(this.translate.instant('popupSuccess'), message);
  }

  async confirm(options: ConfirmOptions): Promise<boolean> {
    const alert = await this.alertController.create({
      header: options.title,
      message: options.message,
      backdropDismiss: false,
      buttons: [
        {
          text: options.cancelText ?? this.translate.instant('labelCancel'),
          role: 'cancel',
        },
        {
          text: options.confirmText,
          role: 'confirm',
          cssClass: options.destructive ? 'ion-color-danger' : undefined,
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }
}
