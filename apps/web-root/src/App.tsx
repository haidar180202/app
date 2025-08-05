import { Provider } from "react-redux";
import "./App.css";
import { UserContext } from "./context/context";
import AppRouter from "./routes/route";
import { store } from "./redux/store";
import Loading from "@components/common/Loading";
import { Suspense, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const themeMode = localStorage.getItem("themeMode");
    setIsDarkMode(themeMode === "true");
  }, []);
  document.body.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
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
