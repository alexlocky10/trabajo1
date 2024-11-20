import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-medic-delete-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './medic-delete-dialog.component.html',
  styleUrl: './medic-delete-dialog.component.css'
})
export class MedicDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MedicDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe los datos del diálogo (por ejemplo, el id del medic)
  ){}

   // Cierra el diálogo y pasa false para indicar que no se debe eliminar
   onCancel(): void {
    this.dialogRef.close(false);
  }

  // Cierra el diálogo y pasa true para indicar que se debe eliminar
  onConfirm(): void {
    this.dialogRef.close(true);
  }

}
