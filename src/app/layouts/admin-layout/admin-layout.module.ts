import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FundComponent } from '../../pages/fund/fund.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { CashOutComponent } from '../../pages/cash-out/cash-out.component';
import { SettingsComponent } from '../../pages/settings/settings.component';
import { MaterialModule } from 'app/material/material.module';
import { SharedModule } from 'app/shared.module';
import { LoaderComponent } from 'app/components/loader/loader.component';
import { ViewNotificationComponent } from '../../components/view-notification/view-notification.component';
import { FundModalComponent } from '../../components/fund-modal/fund-modal.component';
import { PostAddressComponent } from '../../components/post-address/post-address.component';
import { ConfirmFundComponent } from '../../components/confirm-fund/confirm-fund.component';
import { GetAmountComponent } from '../../components/get-amount/get-amount.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    FundComponent,
    NotificationsComponent,
    CashOutComponent,
    SettingsComponent,
    LoaderComponent,
    ViewNotificationComponent,
    FundModalComponent,
    PostAddressComponent,
    ConfirmFundComponent,
    GetAmountComponent,
  ]
})

export class AdminLayoutModule {}
