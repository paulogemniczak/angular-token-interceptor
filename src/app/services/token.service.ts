import { Injectable } from '@angular/core';
import { Token } from '@angular/compiler';
import jwtDecode from 'jwt-decode';

const key = 'token';

@Injectable({ providedIn: 'root' })
export class TokenService {

	getToken(): string {
		return localStorage.getItem(key) ?? '';
	}

	getDecodedToken(): Token | null {
		const token = this.getToken();
		if (token && token.length > 0) {
			return jwtDecode(token);
		}
		return null;
	}

	setToken(token: string): void {
		localStorage.setItem(key, token);
	}

	deleteToken(): void {
		localStorage.removeItem(key)
	}

	containToken(): boolean {
		return !!this.getToken();
	}
}
