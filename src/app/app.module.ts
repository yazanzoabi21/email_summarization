import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { InboxComponent } from './components/pages/inbox/inbox.component';
import { SentComponent } from './components/pages/sent/sent.component';
import { StarredComponent } from './components/pages/starred/starred.component';
import { SnoozedComponent } from './components/pages/snoozed/snoozed.component';
import { DraftsComponent } from './components/pages/drafts/drafts.component';
import { FormsModule } from '@angular/forms';
import { PrimaryComponent } from './components/informations/primary/primary.component';
import { ComposeComponent } from './components/compose/compose.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    InboxComponent,
    SentComponent,
    StarredComponent,
    SnoozedComponent,
    DraftsComponent,
    PrimaryComponent,
    ComposeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
