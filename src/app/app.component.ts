import { logging } from 'protractor';
import { fetchDataFromApi } from './data-from-api.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { map, takeUntil, flatMap, tap, concatMap, mergeMap, timeout } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';


@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
   appStatus = new Promise((resolve, reject) => {
      setTimeout(() => {
         resolve('stable');
      }, 2000);
   })
   getHttpData = [];
   promise;
   private unsubscribe$ = new Subject;
   sales = [];
   //  users = [0, 1, 2, 3];
   //days= [0, 1, 2, 3, 4, 5, 6];;
   highcharts = Highcharts;
   chartOptions: any;
   observableData: number;
   subscription: Object = null;
   plotHeatmap() {
      this.chartOptions = {
         chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
         },
         title: {
            text: null
         },
         xAxis: {
            type: 'string',
            title: {
               enabled: true,
               text: 'GR(mm/h)',
               style: {
                  fontWeight: 'bolder'
               }
            }
         },
         yAxis: {
            type: 'string',
            title: {
               enabled: true,
               text: 'DPR (mm/h)',
               style: {
                  fontWeight: 'bolder'
               }
            }
         },
         colorAxis: {
            stops: [
               [0, "#00008B"],
               [0.2, "#00CCFF"],
               [0.4, "#b3e8FF"],
               [0.5, "#00FF00"],
               [0.7, "#FFFF00"],
               [0.8, "#FF4500"],
               [0.9, "#FF0000"],
               [1.1, "#8B0000"],
               [1.2, "#FFFFFF"],

            ],
            maxColor: Highcharts.getOptions().colors[0]
         },
         legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 250,
            title: {
               enabled: true,
               text: '% of samples'
            }
         },
         series: [{
            borderWidth: 0,
            data: this.sales,
            name: '% of samples',
            dataLabels: {
               enabled: false
            }
         }],
         credits: {
            enabled: false
         }
      };
   }
   //homeworld: Observable<{}>;
   constructor(private _fetchDataFromApi: fetchDataFromApi) { }

   ngOnInit() {
      this.getData();
   }

   getData() {
      let queryUrl = 'https://e3x3fqdwla.execute-api.us-east-1.amazonaws.com/test3/?gr_rc_rainrate>0&columns=gr_rc_rainrate,gr_dm';
      let apiUrl = 'https://e3x3fqdwla.execute-api.us-east-1.amazonaws.com/test3/result/?qid=9d21638c-f241-470c-90f2-25e19b3cf1eb';
      let csvUrl = 'https://aws-athena-query-results-capri-real-time.s3.amazonaws.com/9d21638c-f241-470c-90f2-25e19b3cf1eb.csv';
        
         

      // this._fetchDataFromApi.getQuery(queryUrl)
      //    .subscribe(data => {
      //       let queryId = (data.split('queryId=')[1]).split('}')[0];
      //       apiUrl = apiUrl.concat(queryId);
      //       console.log(apiUrl);
      //    })
      let interval = setInterval(() => {
         this._fetchDataFromApi.fetchData(apiUrl)
            .subscribe(data => {
               console.log(data['message']);
               if (data['message'] == undefined) {
                  console.log("inside if clear interval");
                  clearInterval(interval);
                  for (let i in data['data']) {
                     let array: number[] = [];
                     array.push(Number(data['data'][i]['gr_rc_rainrate']));
                     array.push(Number(data['data'][i]['gr_dm']));
                     array.push(Number(data['data'][i]['gr_rc_rainrate']));
                     let convertedArray: number[] = [];
                     convertedArray.push(Number(array[0].toFixed(2)));
                     convertedArray.push(Number(array[1].toFixed(2)));
                     convertedArray.push(1);
                     
                     // console.log(typeof(Number(array[0].toFixed(2))));
                     this.sales.push(convertedArray);
                     this.plotHeatmap();
                     
                  }
                  this.calcPercentageOfSamples(this.sales);
                  console.log(this.sales);
               }
              //window.open(data["file_url"]);

            })
      }, 1000);     

   }

   ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
   }

   calcPercentageOfSamples(array){
      array.forEach(function (value, index1) {
         array.forEach(function (element, index2)  {
         if(value == element && index1 == index2){
            value[2]+= 1;
            delete array[index2];
         }           
          }); 
        // console.log(value);
       }); 

   }


}
