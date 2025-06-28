import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./component/login";
import WelcomPage from "./component/welcome";
import RegistrasiPage from "./component/registrasi";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section id="welcome">
                  <WelcomPage />
                </section>
              </>
            }
          />
          <Route path="/registrasi" element={<RegistrasiPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
