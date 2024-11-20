import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { Medic } from '../../model/medic';
import { MedicService } from '../../services/medic.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MedicDialogComponent } from './medic-dialog/medic-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicDeleteDialogComponent } from './medic-delete-dialog/medic-delete-dialog.component';
import { switchMap } from 'rxjs';
//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-medic',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './medic.component.html',
  styleUrl: './medic.component.css'
})
export class MedicComponent implements OnInit{

  dataSource: MatTableDataSource<Medic>;

  columnsDefinitions = [
    { def: 'idMedic', label: 'idMedic', hide: true},
    { def: 'primaryName', label: 'primaryName', hide: false},
    { def: 'surname', label: 'surname', hide: false},    
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 

  constructor(
    private medicService: MedicService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    //public dialogRef: MatDialogRef<MedicDeleteDialogComponent>
  ){}

  ngOnInit(): void {
      this.medicService.findAll().subscribe(data => this.createTable(data));

      this.medicService.getMedicChange().subscribe(data => this.createTable(data));
      this.medicService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', {duration: 2000}));
  }

  createTable(data: Medic[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns(){
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();    
  }
/*
  // Método para cerrar el diálogo sin hacer nada
  onCancel(): void {
    this.dialogRef.close(false); // Cierra el diálogo y devuelve "false"
  }
*/
  openDialog(medic?: Medic){
    this._dialog.open(MedicDialogComponent, {
      width: '750px',
      data: medic
    });
  }

  delete(idMedic: number): void{
    const dialogRef = this._dialog.open(MedicDeleteDialogComponent, {
      width: '200px',
      data: idMedic
    });

      // Después de que el diálogo se cierra, obtiene el resultado (true/false)
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.removeItem(idMedic);  // Si el usuario confirma, elimina el item
        }
      });
  }

  removeItem(idMedic: number){
       
    //this.items = this.items.filter(item => item.idMedic !== idMedic);
    //this.medicService.delete(idMedic);
    this.medicService.delete(idMedic)
    .pipe(switchMap( ()=> this.medicService.findAll() ))
    .subscribe(data => {
      this.medicService.setMedicChange(data);
      this.medicService.setMessageChange('DELETED!');
    });
  }

 

   
}
