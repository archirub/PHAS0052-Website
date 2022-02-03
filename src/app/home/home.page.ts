/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';

import * as XLSX from 'xlsx';
import * as chartJS from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CLFV_table: JSON[];
  chart_options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
    },
  };

  constructor() {}

  ngOnInit() {
    this.GetClfvTable();
  }

  graphTable() {
    const config = {
      type: 'scatter',
      data: this.CLFV_table,
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
          },
        },
      },
    };
  }

  async GetClfvTable() {
    const filePath = '../../assets/table_data_CLFV.xlsx';

    this.CLFV_table = await this.GetJsonFromExcel(filePath);
  }

  async GetJsonFromExcel(filePath: string) {
    const response = await fetch(filePath);
    const blob = await response.blob();

    return this.parseExcel(blob);
  }

  parseExcel(file: Blob | File) {
    const reader = new FileReader();
    let json_object: JSON[];

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, {
        type: 'binary',
      });

      workbook.SheetNames.forEach((sheetName) => {
        // Here is your object
        json_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(json_object);
      });
    };

    reader.onerror = (ex) => {
      console.log(ex);
    };

    reader.readAsBinaryString(file);

    return json_object;
  }
}
