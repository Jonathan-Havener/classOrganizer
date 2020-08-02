import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Papa, ParseResult } from 'ngx-papaparse';
import * as fileSaver from 'file-saver';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.css']
})
export class MatTableComponent implements OnInit {

  fileToUpload: File = null;
  tableDataSrc: any;
  uploadForm = new FormGroup({
    file: new FormControl(),
    submit: new FormControl()
  });

  @Input('tableColumns') tableCols: string[] = ["name"];
  @Input() tableData: {}[] = [
  ];



  @ViewChild(MatSort, {static : true}) sort: MatSort;
  @ViewChild(MatPaginator, {static : true}) paginator: MatPaginator;
  constructor(private papa: Papa) {
    
}

  ngOnInit(): void {
    this.tableDataSrc = new MatTableDataSource(this.tableData)
    this.tableDataSrc.sort = this.sort;
    this.tableDataSrc.paginator = this.paginator;
  }

  onSearchInput(ev){
    const searchTarget = ev.target.value;
    this.tableDataSrc.filter = searchTarget.trim().toLowerCase();
  }

  handleFileInput(files:FileList){

    this.fileToUpload = files.item(0);
    this.papa.parse(files.item(0), {
      complete : (results) =>{
        return new Promise((resolve,reject) =>{
          
          //console.log("The results are : "+results);
          results.data.forEach(element => {
            if(!this.tableDataSrc.data.some(el =>  el.name == element[0])){
              this.tableDataSrc.data.push({name:element[0]})
            }
            else{
              console.log(element +" already exists!")
            }
          });
          resolve()
        }).then( ()=>{
          //console.log(this.tableDataSrc.data);
          //reassigning tableDataSrc.data forces it to update
          this.tableDataSrc.data = this.tableDataSrc.data
        } )
        
      } 
    })
  }

  downloadCSV(){

    var csvData
    return new Promise((resolve, reject)=>{
      csvData = new Blob([ this.papa.unparse(this.tableDataSrc.data) ])
      
      if(csvData!= null){
        console.log(csvData)
        resolve()
      }
      else{
        console.log("Rejected")
        reject();
      }
    }).then(()=>{
      console.log(csvData)
      fileSaver.saveAs(csvData, "test.csv")
    })
    
  }

  test(){
    console.log(this.uploadForm)
  }

}
