import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class HttpInterceptorService implements HttpInterceptor {

	isoDateFormat1 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:\d{2}/;
	isoDateFormat2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/;

	constructor(
		private router: Router,
		private tokenService: TokenService) {
	}

	/**
	 * intercept all XHR request
	 * @param request
	 * @param next
	 */
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		console.log(request);
		alert(`Intercept request: \n${JSON.stringify(request)}`);

		if (this.tokenService.containToken()) {
			request = request.clone({
				setHeaders: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + this.tokenService.getToken()
				}
			});
		} else {
			request = request.clone({
				setHeaders: {
					'Content-Type': 'application/json'
				}
			});
		}

		/**
		 * continues request execution
		 */
		return next.handle(request)
			.pipe(map((val: HttpEvent<any>) => {
				if (val instanceof HttpResponse) {
					console.log(val);
					alert(`Intercept response: \n${JSON.stringify(val)}`);
					const body = val.body;
					this.convert(body);
				}
				return val;
			}))
			.pipe(catchError((error) => {
				this.handleAuthError(error);
				return of(error);
			}) as any);
	}

	/**
	 * manage errors
	 * @param err
	 */
	private handleAuthError(err: HttpErrorResponse): Observable<any> {
		// handle your auth error or rethrow
		if (err.url && err.url.search('Login') <= 0 && err.status === 401) {
			// navigate /delete cookies or whatever
			this.router.navigate(['/public/not-logged-in']);
			// if you've caught/handled the error,
			// you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
			return of(err.message);
		}
		throw err;
	}

	isIsoDateString(value: any): boolean {
		if (value === null || value === undefined) {
			return false;
		}
		if (typeof value === 'string') {
			return this.isoDateFormat1.test(value) || this.isoDateFormat2.test(value);
		}
		return false;
	}

	convert(body: any) {
		if (body === null || body === undefined) {
			return body;
		}
		if (typeof body !== 'object') {
			return body;
		}
		for (const key of Object.keys(body)) {
			const value = body[key];
			if (this.isIsoDateString(value)) {
				body[key] = new Date(value);
			} else if (typeof value === 'object') {
				this.convert(value);
			}
		}
	}

}
