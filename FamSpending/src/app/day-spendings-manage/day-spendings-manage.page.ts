import { Component ,OnInit, Inject, LOCALE_ID} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-day-spendings-manage',
  templateUrl: './day-spendings-manage.page.html',
  styleUrls: ['./day-spendings-manage.page.scss'],
})
export class DaySpendingsManagePage implements OnInit {

  ParamDate = null;

  thisDay:any;

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(LOCALE_ID) private locale: string
    ) { }
  ngOnInit() {
    this.ParamDate = this.activatedRoute.snapshot.paramMap.get('date');

    this.thisDay = formatDate(new Date(this.ParamDate), 'EEEE MMMM dd yyyy', this.locale);
  }

}
