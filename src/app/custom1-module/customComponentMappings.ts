import { FinesPayOnlineMessageComponent } from "../fines-pay-online-message/fines-pay-online-message.component";
import { LeanLibraryFullrecordComponent } from "../lean-library-fullrecord/lean-library-fullrecord.component";
import { LoanIlliadMessageComponent } from "../loan-illiad-message/loan-illiad-message.component";
import { NoSearchResultComponent } from "../no-search-result/no-search-result.component";
import { ResearchAssistantComponent } from "../research-assistant/research-assistant.component";
import { SearchErrorMessageComponent } from "../search-error-message/search-error-message.component";
import { ViewMapButtonComponent } from "./view-map-button/view-map-button.component";

export const selectorComponentMap = new Map<string, any>([
  ["nde-full-display-service-container-before", LeanLibraryFullrecordComponent],
  ["nde-fines-after", FinesPayOnlineMessageComponent],
  ["nde-loan-after", LoanIlliadMessageComponent],
  ["nde-no-search-result-after", NoSearchResultComponent],
  ["nde-no-search-result", NoSearchResultComponent],
  ["nde-search-no-result-after", NoSearchResultComponent],
  ["nde-search-no-results-after", NoSearchResultComponent],
  ["nde-no-records-after", NoSearchResultComponent],
  ["nde-no-records-found-after", NoSearchResultComponent],
  ["nde-no-records-found", NoSearchResultComponent],
  ["nde-search-error-message-after", SearchErrorMessageComponent],
  ["nde-search-error-message", SearchErrorMessageComponent],
  ["nde-search-error-after", SearchErrorMessageComponent],
  ["nde-footer", ResearchAssistantComponent],
  ['nde-location-items-container-after', ViewMapButtonComponent]
]);
