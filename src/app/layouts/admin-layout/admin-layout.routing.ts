import { Routes } from '@angular/router';
import { CashOutComponent } from 'app/pages/cash-out/cash-out.component';
import { FundComponent } from 'app/pages/fund/fund.component';
import { NotificationsComponent } from 'app/pages/notifications/notifications.component';
import { SettingsComponent } from 'app/pages/settings/settings.component';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user',           component: UserComponent },
    { path: 'fund',           component: FundComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'cash-out',       component: CashOutComponent },
    { path: 'settings',       component: SettingsComponent },
];
