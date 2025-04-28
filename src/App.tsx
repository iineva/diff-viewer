import "./App.css";
import { useSearchParamBool } from "./utils/hooks";
import AppTempMode from "./AppTempMode";
import AppEditor from "./AppEditor";

function App() {
  const readonlyParam = useSearchParamBool("tempMode") || false; // 是否开启临时编辑器模式
  return readonlyParam ? <AppTempMode /> : <AppEditor />;
}

export default App;
