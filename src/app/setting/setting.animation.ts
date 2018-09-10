import { trigger, state, style, transition, animate, group, query, stagger, keyframes } from '@angular/animations';



export const  listItemSlideStateTrigger =  trigger('listItemSlideState', [
    transition('* => *', [
        query(':enter', [
            style({
                opacity: 0,
                transform: 'translateX(-4%)'
            }),
            stagger(40,
                [animate('400ms ease-out', keyframes([
                    style({
                        opacity: 0,
                        transform: 'translateX(-5%)',
                        offset: 0
                    }),
                    style({
                        opacity: .2,
                        transform: 'translateX(1%)',
                        offset: .5
                    }),
                    style({
                        opacity: .8,
                        transform: 'translateX(0)',
                        offset: 1
                    }),
                ])
            ),  animate('100ms ease-out', style({ opacity: 1}))]

        )
        ], {optional: true})
    ])
]);
