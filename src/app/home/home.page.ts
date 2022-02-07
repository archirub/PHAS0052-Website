/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import {
  HistoryDataService,
  plotableProps,
  ScatterData,
} from './history-data.service';

import * as chartJS from 'chart.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  CLFV_table: chartJS.ChartData;
  chart_options: chartJS.ChartOptions = {
    scales: {
      x: {
        display: true,
        // title: 'ASDKALSDJLAJs',
        position: 'bottom',
        title: {
          display: true,
          text: 'Year',
        },
      },

      y: {
        display: true,
        // type: 'logarithmic',
        ticks: {
          // Include a dollar sign in the ticks
          callback: (value, index, ticks) => '10E' + value,
        },
        title: {
          display: true,
          text: '90% CL',
        },
      },
    },
  };
  historyData$: Observable<ScatterData>;
  chartDataObject$: Observable<chartJS.ChartData>;

  constructor(private historyDataService: HistoryDataService) {}

  ngOnInit() {
    this.historyDataService.fetchData();

    this.chartDataObject$ = this.getChartDataObject$('year', 'CL90', [
      'Year',
      '90% CL',
    ]);
  }

  getChartDataObject$(
    x: plotableProps,
    y: plotableProps,
    labels: string[]
  ): Observable<chartJS.ChartData> {
    return this.historyDataService.chartData$(x, y).pipe(
      map((data) => ({
        datasets: [
          {
            data,
          },
        ],
        labels,
      }))
    );
  }

  async GetClfvTable() {
    const filePath = '../../assets/table_data_CLFV.xlsx';

    // this.CLFV_table = await this.GetJsonFromExcel(filePath);
    this.CLFV_table = {
      datasets: [
        {
          data: [
            { x: 10, y: 20 },
            { x: 15, y: 10 },
            { x: 20, y: 10 },
          ],
        },
      ],
      labels: ['data 1', 'data 2'],
    };
    // console.log(this.CLFV_table);
  }
}
