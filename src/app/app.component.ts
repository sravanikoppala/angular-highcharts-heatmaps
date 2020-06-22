import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
   appStatus = new Promise((resolve, reject) => {
      setTimeout(() => {
         resolve('stable');
      }, 2000);
   })
   array: number[] = [];
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
            // events: {
            //   load(){
            //    setInterval(() => {
            //       this.series[2].setData(this.sales)
            //    }, 2000);
                 
                  
            //   }
            // }
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
      this.subscribeObservable();
   }
   getObservable() {
      //return Observable

   }

   subscribeObservable() {
      //this.subscription = this.getObservable()
      // .subscribe( v => this.observableData = v);
   }

   delay(ms: number) {
      return new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fire fires the fire"));
   }

   getData() {
      let jsonData = [];
      this.http.get('http://localhost:3000/db')
         .pipe(map(responseData => {
            const dataArray = [];
            for (const key in responseData) {
               if (responseData.hasOwnProperty(key)) {
                  dataArray.push({ ...responseData[key] });
               }
            }
            return dataArray;
         }))
         .subscribe(data => {

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
               new Promise((resolve, reject) => {
                  
               for (const day in this.days) {
                  this.array= [];                 
                  this.array.push(Number(name));
                  this.array.push(Number(day));
                  this.array.push(Number(dataArray[name][day].Value));
                  
                  setTimeout(() => {
                     this.sales.push(this.array);                                      
                     //this.plotHeatmap();
                  }, 1000);

                  // this.delay(1000).then(any => {
                  //          this.sales.push(array);
                  //    //       this.plotHeatmap();
   
   
                  //   });

                 this.addWithAsync();
                  // (async () => {
                  //    console.log("start of async");
                  //    console.log(day);
                  //    this.delay(3000).then(any => {
                  //       this.sales.push(array);
                  //       this.plotHeatmap();


                  //    });
                  // });


                  // setTimeout(() => {
                  //    this.sales.push(array);                                      
                  //    this.plotHeatmap();
                  // }, 5000);
              
               }
            });

            }
            //this.plotHeatmap();
         })

   }

   resolveAfter2Seconds(x) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(x);
        }, 2000);
      });
    }
   async addWithAsync() {
     // await this.resolveAfter2Seconds(this.sales.push(this.array));
      await this.resolveAfter2Seconds(this.plotHeatmap());      
      console.log("inside async");
    }

   
}
