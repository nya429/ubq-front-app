import { trigger, state, style, transition, animate } from '@angular/animations';

export const  contentFoldedState =  trigger('contentFoldedState', [
    state('folded',  style({
        backgroundColor: '#999',
        height: '0px',
        display: 'none'
     })),
     state('unfolded',  style({
        height: '100px',
    })),
    transition('folded <=> unfolded', animate(200))
]);
