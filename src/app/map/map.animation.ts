import { trigger, state, style, transition, animate, group, query, stagger, keyframes } from '@angular/animations';



export const  listItemFadeSlideStateTrigger =  trigger('listItemFadeSlideState', [
    transition('* => *', [
        query(':enter', [
            style({
                opacity: 0,
                transform: 'translateY(-4%)'
            }),
            stagger(50,
                [animate('400ms ease-out', keyframes([
                    style({
                        opacity: 0,
                        transform: 'translateY(-30%)',
                        offset: 0
                    }),
                    style({
                        opacity: .8,
                        transform: 'translateY(5%)',
                        offset: .5
                    }),
                    style({
                        opacity: 1,
                        transform: 'translateX(0)',
                        offset: 1
                    }),
                ])
            )]

        )
        ], {optional: true})
    ])
]);


