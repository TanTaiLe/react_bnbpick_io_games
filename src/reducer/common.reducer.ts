import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";

interface State {
  pageTitle: string;
}

const initState: State = {
  pageTitle: "Page Title",
};

export const changePageTitleAction = createAction<string>("CHANGE_PAGE_TITLE");

export const commonReducer = createReducer(initState, (builder) => {
  builder.addCase(
    changePageTitleAction,
    (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    }
  );
});
