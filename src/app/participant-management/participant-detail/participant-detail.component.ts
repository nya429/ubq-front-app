import { Component, OnInit, Input } from '@angular/core';

import { Participant } from './../../shared/participant.model';

@Component({
  selector: 'app-participant-detail',
  templateUrl: './participant-detail.component.html',
  styleUrls: ['./participant-detail.component.css']
})
export class ParticipantDetailComponent implements OnInit {
  @Input() participant: Participant;
  createAt: string;



  constructor() {
  }

  ngOnInit() {
    this.getCreateAt();
  }

  getCreateAt() {
    let timeDiffer = Date.now() - (+this.participant.createTime);

    if (timeDiffer < 60000) {
      console.log('<6000');
        this.createAt = 'just a moment ago';
      } else if (timeDiffer >= 60000 && timeDiffer < 3600000 ) {
        console.log('>6000');
        timeDiffer = Math.floor(timeDiffer / 60000);
        this.createAt = `${timeDiffer} min${timeDiffer > 1 && '(s)'} ago`;
      }  else if (timeDiffer >= 3600000 && timeDiffer < 18000000 ) {
        console.log('>6000');
        timeDiffer = Math.floor(timeDiffer / 3600000);
        this.createAt = `${timeDiffer} hour${timeDiffer > 1 && '(s)'} ago`;
      } else {
        const createTime = new Date(+this.participant.createTime);
        // const year = createTime.getFullYear();
        const month = this.getTimeString(createTime.getMonth());
        const date = this.getTimeString(createTime.getDate());
        const hour = this.getTimeString(createTime.getHours());
        const minute = this.getTimeString(createTime.getMinutes());
        const second = this.getTimeString(createTime.getSeconds());
        this.createAt = `${month}/${date}  at ${hour}:${minute}:${second}`;
    }
  }

  getTimeString(time: number) {
    return time < 9 ? `0${time}` : time.toString();
  }
}
