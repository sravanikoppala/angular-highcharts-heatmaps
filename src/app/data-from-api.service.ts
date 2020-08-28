
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class fetchDataFromApi{
   
    constructor(private httpClient: HttpClient) {}
    getQuery(apiURL){
      return this.httpClient.get(apiURL, { responseType: 'text'});
    }
    fetchData(queryId){
      return this.httpClient.get(queryId);
    }
    
    getCsv(url) {
      return this.httpClient.get(url, {responseType: 'text'});
      }
}