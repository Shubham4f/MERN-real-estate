import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, PrivateRoute } from "./components";
import {
  Home,
  Profile,
  SignUp,
  SignIn,
  About,
  AddLisitng,
  UpdateListing,
  Listing,
  Search,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-listing" element={<AddLisitng />} />
          <Route path="/update-listing/:id" element={<UpdateListing />} />
        </Route>
        <Route path="/search" element={<Search />} />
        <Route path="listing/:id" element={<Listing />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
