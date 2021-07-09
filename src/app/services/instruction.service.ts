import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class InstructionService {
  private readonly config: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    duration: 20000,
  };

  constructor(private snackbar: MatSnackBar) {}

  public warn(message: string) {
    this.snackbar.open(message, 'Close', {
      ...this.config,
      panelClass: ['snack-bar-error'],
    });
  }

  public sucess(message: string) {
    this.snackbar.open(message, 'Close', {
      ...this.config,
      panelClass: ['snack-bar-success'],
    });
  }

  public info(message: string) {
    this.snackbar.open(message, 'Close', {
      ...this.config,
      panelClass: ['snack-bar-info'],
      duration: undefined,
    });
  }

  public infoIterropt(message: string) {
    this.snackbar.open(message, 'Close', {
      ...this.config,
      panelClass: ['snack-bar-info-echape'],
      duration: undefined,
      // duration: 4000,
    });
  }

  public dismiss() {
    this.snackbar.dismiss();
  }
}
