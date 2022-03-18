/* eslint-disable curly */
import { Component, OnInit } from '@angular/core';

import { ChartOptions, ChartData, ScriptableContext } from 'chart.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Decay,
  DecayOptions,
  HistoryDataService,
} from './history-data.service';
import { ViolationGraphService } from './violation-graph.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  chartDataObject$: Observable<ChartData>;
  CLFV_table: ChartData;
  chart_options: ChartOptions;

  constructor(
    private historyDataService: HistoryDataService,
    private violationGraphService: ViolationGraphService
  ) {}

  /**
   * runs when the page is initialized
   */
  ngOnInit() {
    this.chart_options = this.violationGraphService.chart_options;

    // gets the data from the csv file and adds it to the history data service
    this.historyDataService.fetchData();

    // This is for the template
    this.chartDataObject$ = this.getChartDataObject$();
  }

  /**
   * formats the datapoints for display in the graph and returns
   * an observable holding that object (for subscription in the template)
   */
  getChartDataObject$(): Observable<ChartData> {
    return this.historyDataService.chartData$().pipe(
      map((data) => {
        const chartData: ChartData = this.getBlankChartData(
          DecayOptions.length
        );

        DecayOptions.forEach((decay, i) => {
          // specifies the data
          chartData.datasets[i].data = this.historyDataService.historyToChart(
            data[decay],
            'year',
            'CL90'
          );
          const muNToEN_label = 'mu N -> e N';
          const muTo3E_label = 'mu-> 3e';
          const muToEGamma_label = 'mu -> e gamma';

          // specifies the label
          if (decay === 'muNToEN') {
            chartData.datasets[i].label = muNToEN_label;
          } else if (decay === 'muTo3E') {
            chartData.datasets[i].label = muTo3E_label;
          } else if (decay === 'muToEGamma') {
            chartData.datasets[i].label = muToEGamma_label;
          } else {
            chartData.datasets[i].label = decay;
          }

          // Specifies the color of the data points based on the decay they concern
          chartData.datasets[i].backgroundColor = (
            context: ScriptableContext<'bar'>
          ) => {
            const decayValue = context.dataset.label;
            if (decayValue === muNToEN_label) return 'red';
            if (decayValue === muTo3E_label) return 'blue';
            if (decayValue === muToEGamma_label) return 'green';
          };
        });

        return chartData;
      })
    );
  }

  /**
   * returns a blank chart data object
   */
  private getBlankChartData(numberOfDatasets: number): ChartData {
    return {
      datasets: Array.from({ length: numberOfDatasets }).map(() => ({
        data: [],
      })),
    };
  }
}
