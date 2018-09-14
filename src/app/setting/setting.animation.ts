import { trigger, state, style, transition, animate, group, query, stagger, keyframes } from '@angular/animations';



const  listItemSlideStateTrigger =  trigger('listItemSlideState', [
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

const failScaleTrigger =  trigger('scale', [
    state('fail',  style({  })),
    state('default',  style({ })),
    state('removal',  style({transform: 'translateX(0)'})),
    transition('fail => default', animate('500ms',
        keyframes([
            style({transform: 'translateX(0)'}),
            style({transform: 'translateX(-2%)'}),
            style({transform: 'translateX(4%)'}),
            style({transform: 'translateX(-3%)'}),
            style({transform: 'translateX(1%)'}),
            style({transform: 'translateX(0)'}),
        ]) 
    )),
    transition('default => authed', animate('400ms 100ms ease-out', keyframes([
        style({transform: 'translateX(1.1)', offset: 0.7}),
        style({transform: 'translateX(0)', offset: 1}),
    ])))
]);


export {listItemSlideStateTrigger, failScaleTrigger}