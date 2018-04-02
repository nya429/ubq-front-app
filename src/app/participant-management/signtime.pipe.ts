import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'signtime'
})
export class SignTimePipe implements PipeTransform  {
    transform(value: any) {
        let timeDiffer = Date.now() - (+value);

        if (timeDiffer < 60000) {
          console.log('<6000');
            return 'just a moment ago';
          } else if (timeDiffer >= 60000 && timeDiffer < 3600000 ) {
            console.log('>6000');
            timeDiffer = Math.floor(timeDiffer / 60000);
            return `${timeDiffer} min${timeDiffer > 1 && '(s)'} ago`;
          }  else if (timeDiffer >= 3600000 && timeDiffer < 18000000 ) {
            console.log('>6000');
            timeDiffer = Math.floor(timeDiffer / 3600000);
            return `${timeDiffer} hour${timeDiffer > 1 && '(s)'} ago`;
          } else {
            const createTime = new Date(+value);
            // const year = createTime.getFullYear();
            const month = this.getTimeString(createTime.getMonth());
            const date = this.getTimeString(createTime.getDate());
            const hour = this.getTimeString(createTime.getHours());
            const minute = this.getTimeString(createTime.getMinutes());
            const second = this.getTimeString(createTime.getSeconds());
            return `${month}/${date}  at ${hour}:${minute}:${second}`;
        }
    }

    getTimeString(time: number) {
        return time < 9 ? `0${time}` : time.toString();
    }
}
