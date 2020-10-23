import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Material
import { MaterialModule } from './material/material.module';
import { ConfirmComponent } from './components/confirm/confirm.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
     ],
    declarations: [
        ConfirmComponent,
    ],
    exports: [
        ConfirmComponent,
        MaterialModule,
    ]
})
export class SharedModule {}
