import { Route, Routes } from "react-router-dom";

import LoadingPage from "./pages/loading-page";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/auth/login-page";
import ConversationPage from "./pages/conversation-page";
import Wrapper from "./components/wrapper";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoadingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<Wrapper />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/:conversationId" element={<ConversationPage />} />
      </Route>
    </Routes>
  );
};

export default App;
