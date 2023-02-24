import { Component } from '@angular/core';
import { ExampleService } from 'src/app/services/example.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  template: `
	<div>
		<p>Hello!</p>
	</div>
	<div>
		<button (click)="request(1)">Request 1</button>
		<button (click)="request(2)">Request 2</button>
		<button (click)="request(3)">Request 3</button>
	</div>
	<div>
		<p>
			{{result | json}}
		</p>
	</div>
`
})
export class HomeComponent {

	result: string = '';

	constructor(
		private service: ExampleService
	) {
	}

	async request(id: number): Promise<void> {
		const r$ = this.service.request(id);
		const str = await lastValueFrom(r$);
		this.result = str;
	}

}
