import { ActionManagementUiType } from "../types";

interface ManagementUiPage {
  statusSizeSidebar: boolean;
  isDarkMode: boolean; // Tambahan untuk dark mode
}

type Action = {
  type: string;
  payload?: boolean; // Optional, in case you want to set a specific value.
};

const initialState: ManagementUiPage = {
  statusSizeSidebar: false,
  isDarkMode: false, // Default mode: Light
};

export const handleManagementUi = (
  state: ManagementUiPage = initialState,
  action: Action,
): ManagementUiPage => {
  switch (action.type) {
    case ActionManagementUiType.ManageSizeSidebar: //manage size sidebar
      return {
        ...state,
        statusSizeSidebar: !state.statusSizeSidebar, // Toggle the status
      };

    case ActionManagementUiType.ToggleDarkMode: // manage the toggle darkmode and light mode
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };

    default:
      return state;
  }
};
