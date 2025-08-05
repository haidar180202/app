import { ActionManagementUiType } from "../types";

interface ManagementUiPage {
  statusSizeSidebar: boolean;
}

const initialState: ManagementUiPage = {
  statusSizeSidebar: false,
};

export const handleManagementUi = (state = initialState, action: any) => {
  switch (action.type) {
    case ActionManagementUiType.ManageSizeSidebar:
      return {
        ...state,
        statusSizeSidebar: !state.statusSizeSidebar,
      };
    default:
      return state;
  }
};
