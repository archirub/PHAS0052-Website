import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import {
  ChartOptions,
  TooltipItem,
  ChartTypeRegistry,
  ActiveElement,
} from 'chart.js';

import {
  DecayOptions,
  decaySortedHistoryData,
  HistoryDataService,
} from './history-data.service';

@Injectable({
  providedIn: 'root',
})
export class ViolationGraphService {
  decaySortedHistoryData: decaySortedHistoryData = null;

  // object specifying the options for the Violation Graph
  chart_options: ChartOptions = {
    // this specifies what happens when a datapoint is clicked
    onClick: (event, elements, chart) => {
      // case where there is only one element so you can just open the link
      if (elements.length < 2) {
        const datasetIndex = elements[0].datasetIndex;
        const datapointIndex = elements[0].index;
        const decayName = DecayOptions[datasetIndex];

        const link =
          this.decaySortedHistoryData[decayName][datapointIndex].link;

        window.open(link, '_blank');

        // make popup appear asking which one you want to go to
      } else {
        this.showLinkSelection(elements);
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          // this specifies the content of the label shown when a data point is hovered
          label: (tooltipItem: TooltipItem<keyof ChartTypeRegistry>) => {
            if (!this.decaySortedHistoryData) {
              return 'Loading...';
            }

            const datasetIndex = tooltipItem.datasetIndex;
            const datapointIndex = tooltipItem.dataIndex;
            const decayName = DecayOptions[datasetIndex];

            const collab =
              this.decaySortedHistoryData[decayName][datapointIndex]
                .collaboration;
            const reference =
              this.decaySortedHistoryData[decayName][datapointIndex].reference;

            return `
              collaboration: ${collab}
              reference: ${reference}
              `;
          },
        },
      },
    },
    scales: {
      // This specifies the x-axis label
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
          // This specifies the labels of the y-axis (Confidence Level)
          callback: (value, index, ticks) => '10E' + value,
        },
        // This specifies the y-axis label
        title: {
          display: true,
          text: '90% CL',
        },
      },
    },
  };

  constructor(
    private historyDataService: HistoryDataService,
    private alertCtrl: AlertController
  ) {
    // need to have a local copy like this (though this is very ugly) because the function
    // that allows me to set a label on the data points does not accept promises not observables,
    // so I can't request the collaboration corresponding to a datapoint from the service in a nice
    // reactive way
    this.historyDataService
      .chartData$()
      .subscribe((d) => (this.decaySortedHistoryData = d));
  }

  private async showLinkSelection(elements: ActiveElement[]) {
    // generates the buttons available and their content
    // to move to the possible links
    const buttons = elements.map((el) => {
      const decayName = DecayOptions[el.datasetIndex];

      // reference of datapoint
      const reference =
        this.decaySortedHistoryData[decayName][el.index].reference;

      // link to paper
      const link = this.decaySortedHistoryData[decayName][el.index].link;

      return {
        text: reference,
        handler: () => {
          window.open(link, '_blank');
        },
      };
    });

    // specifies a cancel button
    const cancelButton = {
      text: 'cancel',
      role: 'cancel',
      cssClass: 'secondary',
      handler: () => {},
    };

    // Creates the alert component
    const alert = await this.alertCtrl.create({
      header: 'Which reference would you like to see?',
      buttons: buttons.concat(cancelButton),
    });

    // presents the alert component
    return alert.present();
  }
}
