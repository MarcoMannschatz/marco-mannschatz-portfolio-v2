import { Route, Switch } from "wouter";
import { LanguageProvider } from "@/lib/language-context";
import Home from "@/pages/Home";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";

export default function App() {
  return (
    <LanguageProvider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/datenschutz" component={Datenschutz} />
      </Switch>
    </LanguageProvider>
  );
}
