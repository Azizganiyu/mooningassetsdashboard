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

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    FundComponent,
    NotificationsComponent,
    CashOutComponent,
    SettingsComponent,
  ]
})

export class AdminLayoutModule {}
