import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import * as XLSX from 'xlsx';
import * as chartJS from 'chart.js';

export interface HistoryDataPoint {
  year: number;
  CL90: number; // 90% confidence level
  collaboration: string;
  decay: Decay;
}
export const DecayOptions = ['muToEGamma', 'muNToEN', 'muTo3E'] as const;
export type Decay = typeof DecayOptions[number];
export type HistoryData = HistoryDataPoint[];
export type ScatterData = chartJS.ScatterDataPoint[];
// export type ScatterData = chartJS.ChartDataSets['data']; //DEv

export type plotableProps = Exclude<
  keyof HistoryDataPoint,
  'collaboration' | 'decay'
>;

type decaySortedHistoryData = {
  [decay in typeof DecayOptions[number]]: HistoryData;
};

@Injectable({
  providedIn: 'root',
})
export class HistoryDataService {
  private filePath = '../../assets/table_data_CLFV.xlsx';
  private data$ = new BehaviorSubject<HistoryData>(null);

  // returns observable of ScatterData with specified x and y properties from HistoryData
  public chartData$(
    x: plotableProps,
    y: plotableProps
  ): Observable<decaySortedHistoryData> {
    return this.data$.pipe(
      filter((d) => !!d),
      map((d) => this.splitDecays(d))
    );
  }

  // Obtains data located at "this.filePath" and places it in the data$ observable
  public async fetchData() {
    const historyData = await this.excelToHistory(this.filePath);
    this.data$.next(historyData);
  }

  // Converts
  public historyToChart(
    data: HistoryData,
    x: plotableProps,
    y: plotableProps
  ): ScatterData {
    return data.map((dp) => ({ x: dp[x], y: this.log(dp[y], 10) }));
  }

  private splitDecays(data: HistoryData): decaySortedHistoryData {
    const sortedHistoryData: decaySortedHistoryData = {
      muNToEN: [],
      muTo3E: [],
      muToEGamma: [],
    };

    data.forEach((dp) => sortedHistoryData[dp.decay].push(dp));

    return sortedHistoryData;
  }

  private async excelToHistory(filePath: string): Promise<HistoryData> {
    const response = await fetch(filePath);
    const blob = await response.blob();

    return this.parseExcel(blob);
  }

  log(x: number, base: number): number {
    return Math.log(x) / Math.log(base);
  }

  //
  private parseExcel(file: Blob | File): Promise<HistoryData> {
    return new Promise<HistoryData>((resolve, reject) => {
      const reader = new FileReader();
      let historyData: HistoryData;

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
          type: 'binary',
        });

        workbook.SheetNames.forEach((sheetName) => {
          historyData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          resolve(historyData);
        });
      };

      reader.onerror = (ex) => {
        console.log(ex);
      };

      reader.readAsBinaryString(file);
    });
  }
}
