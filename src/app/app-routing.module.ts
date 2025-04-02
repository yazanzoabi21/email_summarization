import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxComponent } from './components/pages/inbox/inbox.component';
import { SentComponent } from './components/pages/sent/sent.component';
import { SnoozedComponent } from './components/pages/snoozed/snoozed.component';
import { StarredComponent } from './components/pages/starred/starred.component';
import { DraftsComponent } from './components/pages/drafts/drafts.component';

const routes: Routes = [
  { path: '', redirectTo: 'inbox', pathMatch: 'full' },
  { path: 'inbox', component: InboxComponent },
  { path: 'sent', component: SentComponent },
  { path: 'starred', component: StarredComponent },
  { path: 'snoozed', component: SnoozedComponent },
  { path: 'drafts', component: DraftsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
