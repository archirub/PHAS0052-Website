/* eslint-disable object-shorthand */
/* eslint-disable curly */
import { Component, OnInit } from '@angular/core';

import {
  ChartOptions,
  ChartData,
  TooltipItem,
  ChartTypeRegistry,
  ScriptableContext,
} from 'chart.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Decay,
  DecayOptions,
  HistoryDataService,
  plotableProps,
  ScatterData,
} from './history-data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  CLFV_table: ChartData;
  chart_options: ChartOptions = {
    onHover: (event, elements, chart) => {
      if (elements.length > 0)
        console.log('elements', elements, 'event', event);

      if (event.type === 'mouseout') {
        // customTooltip.style.opacity = 0
        // console.log('elements', elements);
      }

      if (event.type === 'mouseenter') {
        // elements.style.opacity = 0
      }
    },
    onClick: (event, elements, chart) => {
      console.log('FUCKED YOU', elements, event);
    },
    plugins: {
      tooltip: {
        // enabled: false,
        // external: (args) => {

        // },
        callbacks: {
          // eslint-disable-next-line object-shorthand
          // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
          label: (tooltipItem: TooltipItem<keyof ChartTypeRegistry>) => {
            const decayValue = tooltipItem.dataset.label as Decay;

            return `
            Decay: ${decayValue} 
            `;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        position: 'bottom',
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        display: true,
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
  chartDataObject$: Observable<ChartData>;

  constructor(private historyDataService: HistoryDataService) {
    // customToolTip.addEventListener('mouseout', () => {
    //   customTooltip.style.opacity = 0;
    // });
    // customTooltip.addEventListener('mouseover', () => {
    //   customTooltip.style.opacity = tooltipOpacity;
    // });
  }

  ngOnInit() {
    this.historyDataService.fetchData();

    this.chartDataObject$ = this.getChartDataObject$('year', 'CL90');
  }

  getChartDataObject$(
    x: plotableProps,
    y: plotableProps
    // axisLabels: string[]
  ): Observable<ChartData> {
    return this.historyDataService.chartData$(x, y).pipe(
      map((data) => {
        const chartData: ChartData = this.initChartData(DecayOptions.length);

        DecayOptions.forEach((decay, i) => {
          chartData.datasets[i].data = this.historyDataService.historyToChart(
            data[decay],
            'year',
            'CL90'
          );
          chartData.datasets[i].label = decay;

          chartData.datasets[i].backgroundColor = (
            context: ScriptableContext<'bar'>
          ) => {
            const decayValue = context.dataset.label as Decay;
            if (decayValue === 'muNToEN') return 'red';
            if (decayValue === 'muTo3E') return 'blue';
            if (decayValue === 'muToEGamma') return 'green';
          };
        });

        return chartData;
      })
    );
  }

  initChartData(numberOfDatasets: number): ChartData {
    return {
      datasets: Array.from({ length: numberOfDatasets }).map(() => ({
        data: [],
      })),
    };
  }
}
