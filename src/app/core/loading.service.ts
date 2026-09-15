import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { TranslateService } from './i18n/translate.service';

/**
 * Indicador de carregamento com contador de requisições simultâneas, como a
 * pilha `starckLoading` do app AngularJS: o spinner só some quando a última
 * requisição termina.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly loadingController = inject(LoadingController);
  private readonly translate = inject(TranslateService);

  private pending = 0;
  private overlay: HTMLIonLoadingElement | null = null;
  private queue: Promise<void> = Promise.resolve();

  show(): void {
    this.pending += 1;
    if (this.pending === 1) {
      this.enqueue(async () => {
        if (this.overlay || this.pending === 0) {
          return;
        }
        this.overlay = await this.loadingController.create({
          message: this.translate.instant('labelLoading'),
        });
        await this.overlay.present();
      });
    }
  }

  hide(): void {
    this.pending = Math.max(0, this.pending - 1);
    if (this.pending === 0) {
      this.enqueue(async () => {
        if (!this.overlay || this.pending > 0) {
          return;
        }
        const overlay = this.overlay;
        this.overlay = null;
        await overlay.dismiss();
      });
    }
  }

  /** Serializa present/dismiss para não sobrepor ou perder um overlay. */
  private enqueue(task: () => Promise<void>): void {
    this.queue = this.queue.then(task).catch(() => undefined);
  }
}
