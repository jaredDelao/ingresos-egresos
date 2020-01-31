import { Action } from '@ngrx/store';
import { IngresoEgreso } from './ingreso-egreso.model';

export const SET_ITEMS = '[ Igreso Egreso ] set items';
export const UNSET_ITEMS = '[ Igreso Egreso ] unset items';

export class SetItemsAction implements Action {
    readonly type = SET_ITEMS;
    constructor(public items: IngresoEgreso[]) {
        
    }
}

export class UnSetItemsAction implements Action {
    readonly type = UNSET_ITEMS;
}

export type acciones = SetItemsAction | UnSetItemsAction;