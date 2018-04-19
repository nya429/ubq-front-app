import { trigger, state, style, transition, animate, group, query, stagger, keyframes } from '@angular/animations';



export const  navUnderScoreStateTrigger =  trigger('navUnderScoreState', [
    transition(':enter', [
        query('li.active::after', [
            style({
                color: 'black',
                width: 0
            }),
            animate(300, style({
                color: 'black',
                width: '*'
            }))
        ], {optional: true})
    ])
]);


