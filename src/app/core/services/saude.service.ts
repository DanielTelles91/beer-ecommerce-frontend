import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  constructor(private http: HttpClient) { }

  checkAngular() {
    return this.http.get('http://localhost:4200', { responseType: 'text' });
  }
}