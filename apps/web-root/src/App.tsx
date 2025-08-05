import { Provider } from "react-redux";
import "./App.css";
import { UserContext } from "./context/context";
import AppRouter from "./routes/route";
import Loading from "@components/common/Loading";
import { Suspense } from "react";
import { store } from "./redux/store";

export default function App() {
  return (
    <UserContext.Provider value={"user"}>
      <Provider store={store}>
        <Suspense fallback={<Loading />}>
          <AppRouter />
        </Suspense>
      </Provider>
    </UserContext.Provider>
  );
}
