import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
   users: string[] = [];
   days: string[] = [];
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
            text: 'Sales per employee per weekday'
         },
         xAxis: {
            type: 'string',
            categories: this.users
         },
         yAxis: {
            type: 'string',
            categories: this.days,
            title: null
         },
         colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
         },
         legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
         },
         series: [{
            name: 'Sales per employee',
            borderWidth: 0,
            data: this.sales,

            dataLabels: {
               enabled: false
            }
         }],
         credits: {
            enabled: false
         }

      };
   }

   constructor(private http: HttpClient) { }
   ngOnInit() {
      this.getData();
   }

   getData() {
      let x = this.http.get('http://localhost:3000/db')
         .pipe(map(responseData => {
            const dataArray = [];
            for (const key in responseData) {
               if (responseData.hasOwnProperty(key)) {
                  dataArray.push({ ...responseData[key] });
               }
            }
            //takeUntil => takeUntil(this.unsubscribe$)
            return dataArray;
         }))
         .subscribe(data => {
            //this.getHttpData = data;
            //console.log(data);
            for (const name in data[1]) {
               this.users.push(data[1][name].name);
            }
            for (const day in data[2]) {
               this.days.push(data[2][day].day);
            }
            const dataArray = [];
            for (const key in data[0][0]) {
               dataArray.push({ ...data[0][0][key] });
            }
            for (const name in this.users) {
               for (const day in this.days) {
                  let array: number[] = [];
                  array.push(Number(name));
                  array.push(Number(day));
                  array.push(Number(dataArray[name][day].Value));
                  this.promise = new Promise((resolve, reject) => {
                     setTimeout(() => {
                        this.sales.push(array);
                        this.plotHeatmap();
                        //location.reload();
                     }, 2000);
                  });

               }


            }
           // console.log(this.getHttpData);
            //this.plotHeatmap();
            return data;
         },
            err => console.log('Recived error:', err),
            () => console.log('Complete!')

         );
      console.log(this.getHttpData);

   }

   ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
   }

   refreshHttpData() {
      setInterval(() => {
         this.http.get('http://localhost:3000/db')
            .pipe(map(responseData => {
               const dataArray = [];
               for (const key in responseData) {
                  if (responseData.hasOwnProperty(key)) {
                     dataArray.push({ ...responseData[key] });
                  }
               }
               //takeUntil => takeUntil(this.unsubscribe$)
               return dataArray;
            }))
            .subscribe(data => {
               if (data == this.getHttpData) {
                  console.log("Both are equal");
               }
               else {
                  console.log("Both are not equal");

               }
            });

      }, 2000);
   }


}
