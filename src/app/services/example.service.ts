import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ExampleService {

	constructor(
		private http: HttpClient,
	) {
	}

	request(id: number): Observable<string> {
		return this.http.get<string>(`https://jsonplaceholder.typicode.com/posts/${id}`);
	}
}
