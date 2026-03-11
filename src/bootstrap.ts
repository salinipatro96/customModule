import "@angular/compiler";
import { AppModule } from './app/app.module';
import {bootstrap} from "@angular-architects/module-federation-tools";

const LIBANSWERS_CHAT_SCRIPT_ID = 'libanswers-chat-loader';
const LIBANSWERS_CHAT_URL =
  'https://umb.libanswers.com/load_chat.php?hash=1ff2ccb0d23a46fe06c3958e82b3d720306834297afb58d2b9757c5bee758849';

function loadChatWidget(): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById(LIBANSWERS_CHAT_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement('script');
  script.id = LIBANSWERS_CHAT_SCRIPT_ID;
  script.type = 'text/javascript';
  script.async = true;
  script.src = LIBANSWERS_CHAT_URL;

  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
    return;
  }

  document.head.appendChild(script);
}

export const bootstrapRemoteApp = (bootstrapOptions: any) => {
   loadChatWidget();
   return bootstrap(AppModule(bootstrapOptions), {
    production: true,
    appType: 'microfrontend'
  }).then(r => {
    console.log('custom remote app bootstrap success!', r);
    return r
  });
}
