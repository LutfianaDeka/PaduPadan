import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./supporting/ScrollToTop";
import LoginPage from "./component/login";
import WelcomePage from "./component/welcome";
import SignUpPage from "./component/sign-up";
import HomePage from "./component/home";
import ContentPage from "./component/content";
import ResetPass from "./component/reset_pass";
import UpdatePass from "./component/update-pass";
import Camera from "./component/kamera";
import Preview from "./component/preview";
import PreviewStyle from "./component/preview_style";
import AddCloset from "./component/addcloset";
import ClosetPage from "./component/closet";
import Kalender from "./component/kalender";
import AddStyle from "./component/addstyle";
import StylePage from "./component/style";
import FormStyle from "./component/formstyle";
import DetailStylePage from "./component/detail_style";
import useCreateUserProfile from "./hooks/useCreateUserProfile";

function App() {

  useCreateUserProfile();

  return (
    <div>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/reset" element={<ResetPass />} />
          <Route path="/update-pass" element={<UpdatePass />} />
          <Route path="/kamera" element={<Camera />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/preview_style" element={<PreviewStyle />} />
          <Route path="/form_style" element={<FormStyle />} />
          <Route path="/addcloset" element={<AddCloset />} />
          <Route path="/closet" element={<ClosetPage />} />
          <Route path="/kalender" element={<Kalender />} />
          <Route path="/addstyle" element={<AddStyle />} />
          <Route path="/style" element={<StylePage />} />
          <Route path="/detail_style/:style_id" element={<DetailStylePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
