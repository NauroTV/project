import { Routes } from '@angular/router';
import { BildFilter } from './bild-filter/bild-filter';
import { BildEdit } from './bild-edit/bild-edit';

export const routes: Routes = [
    {
        path: "bild-filter",
        component: BildFilter
    },
    {
        path: "bild-edit",
        component: BildEdit
    }
];
