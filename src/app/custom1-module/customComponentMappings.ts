import { LeanLibraryFullrecordComponent } from "../lean-library-fullrecord/lean-library-fullrecord.component";
import { LeanLibraryComponent } from "../lean-library/lean-library.component";
import { ResearchAssistantComponent } from "../research-assistant/research-assistant.component";
import { ViewMapButtonComponent } from "./view-map-button/view-map-button.component";

export const selectorComponentMap = new Map<string, any>([
  ["nde-search-results-pagination-after", LeanLibraryComponent],
  ["nde-full-display-container-after", LeanLibraryFullrecordComponent],
  ["nde-top-bar-after", ResearchAssistantComponent],
  ['nde-location-items-container-after', ViewMapButtonComponent]
]);
