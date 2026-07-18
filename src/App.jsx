import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./components/Home";
import { KovilIncome } from "./components/KovilIncome";
import { Cart } from "./components/Cart";
import { Moi } from "./components/Moi";
import { MoiFilter } from "./components/MoiFilter";
import { Pending } from "./components/Pending";
import { AllMoiList } from "./components/AllMoiList";
import { PendingGroup } from "./components/PendingGroup";
import { Chart } from "./components/Chart";
import { KovilOutgoing } from "./components/KovilOutgoing";
import { NewIncome } from "./components/NewIncome";
import { NewOutgoing } from "./components/NewOutgoing";
import { UpdateIncome } from "./components/UpdateIncome";
import { UpdateOutgoing } from "./components/UpdateOutgoing";
import { KovilSummary } from "./components/KovilSummary";
import { IncomeGroup } from "./components/IncomeGroup";
import { OutgoingGroup } from "./components/OutgoingGroup";
import { Relo } from "./components/Relo";
import { UpdateRelo } from "./components/UpdateRelo";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { isAuthenticated, getUserRole } from "./utils/auth";
import { NewRelo } from "./components/NewRelo";
import { VinothRelo } from "./components/VinothRelo";
import { VigneshRelo } from "./components/VigneshRelo";
import { VijayRelo } from "./components/VijayRelo";
import { PendingGroupRelo } from "./components/PendingGroupRelo";
import { CompleteGroupRelo } from "./components/CompleteGroupRelo";
import { ChartRelo } from "./components/ChartRelo";
import { PendingListRelo } from "./components/PendingListRelo";
import { CompleteListRelo } from "./components/CompleteListRelo";
import { MoiSearchRelo } from "./components/MoiSearchRelo";
import { AllGroupRelo } from "./components/AllGroupRelo";
import { Loan } from "./components/Loan";
import { NewLoan } from "./components/NewLoan";
import { UpdateLoan } from "./components/UpdateLoan";
import { AllGroupLoan } from "./components/AllGroupLoan";
import { PlaceGroupLoan } from "./components/PlaceGroupLoan";
import { KovilBalance } from "./components/KovilBalance";
import { NewBalance } from "./components/NewBalance";
import { UpdateBalance } from "./components/UpdateBalance";
import { MoiAllProvider } from "./context/MoiAllProvider";
import { MoiProvider } from "./context/MoiProvider";
import { GroupTable } from "./components/GroupTable";
import { MoiAllGroupProvider } from "./context/MoiAllGroupProvider";
import { LoanAllProvider } from "./context/LoanAllProvider";
function App() {
  const [cart, setCart] = useState([]);

  // Initialize default users (only once)
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const defaultUsers = [
      { email: "admin@gmail.com", password: "admin123", role: "admin" },
      { email: "customer@gmail.com", password: "cust123", role: "customer" },
    ];

    defaultUsers.forEach((user) => {
      if (!users.find((u) => u.email === user.email)) {
        users.push(user);
      }
    });

    localStorage.setItem("users", JSON.stringify(users));
  }, []);

  // Redirect based on role
  const HomeRedirect = () => {
    const role = getUserRole();
    if (!role) return <Navigate to="/login" />;
    return role === "admin" ? <Home /> : <KovilIncome />;
  };

  return (
    <BrowserRouter>
      <Header cart={cart} />

      <div className="container">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={!isAuthenticated() ? <Login /> : <Navigate to="/" />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomeRedirect />
              </PrivateRoute>
            }
          />

          <Route
            path="/Moi"
            element={
              <PrivateRoute>
                <Moi />
              </PrivateRoute>
            }
          />

          <Route
            path="/moi_search"
            element={
              <PrivateRoute>
                <MoiFilter />
              </PrivateRoute>
            }
          />

          <Route
            path="/Cart"
            element={
              <PrivateRoute>
                <Cart cart={cart} setCart={setCart} />
              </PrivateRoute>
            }
          />

          <Route
            path="/pending_list"
            element={
              <PrivateRoute>
                <Pending />
              </PrivateRoute>
            }
          />

          <Route
            path="/all_mois"
            element={
              <PrivateRoute>
                <AllMoiList />
              </PrivateRoute>
            }
          />

          <Route
            path="/pending_name_group"
            element={
              <PrivateRoute>
                <PendingGroup />
              </PrivateRoute>
            }
          />

          <Route
            path="/dash_board"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/charts"
            element={
              <PrivateRoute>
                <Chart />
              </PrivateRoute>
            }
          />

          <Route
            path="/kovil/income_list"
            element={
              <PrivateRoute>
                <KovilIncome />
              </PrivateRoute>
            }
          />
          <Route
            path="/kovil/balances"
            element={
              <PrivateRoute>
                <KovilBalance />
              </PrivateRoute>
            }
          />

          <Route
            path="/new/balance"
            element={
              <PrivateRoute>
                <NewBalance />
              </PrivateRoute>
            }
          />

          <Route
            path="/update_balance/:id"
            element={
              <PrivateRoute>
                <UpdateBalance />
              </PrivateRoute>
            }
          />

          <Route
            path="/kovil/outgoing_list"
            element={
              <PrivateRoute>
                <KovilOutgoing />
              </PrivateRoute>
            }
          />

          <Route
            path="/newIncome"
            element={
              <PrivateRoute>
                <NewIncome />
              </PrivateRoute>
            }
          />

          <Route
            path="/newOutgoing"
            element={
              <PrivateRoute>
                <NewOutgoing />
              </PrivateRoute>
            }
          />

          <Route
            path="/update_income/:id"
            element={
              <PrivateRoute>
                <UpdateIncome />
              </PrivateRoute>
            }
          />

          <Route
            path="/update_outgoing/:id"
            element={
              <PrivateRoute>
                <UpdateOutgoing />
              </PrivateRoute>
            }
          />

          <Route
            path="/kovil/summary"
            element={
              <PrivateRoute>
                <KovilSummary />
              </PrivateRoute>
            }
          />

          <Route
            path="/kovil/income_group"
            element={
              <PrivateRoute>
                <IncomeGroup />
              </PrivateRoute>
            }
          />

          <Route
            path="/kovil/outgoing_group"
            element={
              <PrivateRoute>
                <OutgoingGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/all"
            element={
              <PrivateRoute>
                <MoiAllProvider>
                  <Relo />
                </MoiAllProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/update_relo/:id"
            element={
              <PrivateRoute>
                <UpdateRelo />
              </PrivateRoute>
            }
          />

          <Route
            path="/new/moi"
            element={
              <PrivateRoute>
                <NewRelo />
              </PrivateRoute>
            }
          />

          <Route
            path="/vinoth/mois1"
            element={
              <PrivateRoute>
                <MoiProvider>
                  <VinothRelo />
                </MoiProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/vignesh/mois1"
            element={
              <PrivateRoute>
                <MoiProvider>
                  <VigneshRelo />
                </MoiProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/vijay/mois1"
            element={
              <PrivateRoute>
                <MoiProvider>
                  <VijayRelo />
                </MoiProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/vinoth/mois"
            element={
              <PrivateRoute>
                <MoiProvider>
                  <GroupTable />
                </MoiProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/Vignesh/mois"
            element={
              <PrivateRoute>
                <MoiProvider>
                  <GroupTable />
                </MoiProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/vijay/mois"
            element={
              <PrivateRoute>
                <MoiProvider>
                  <GroupTable />
                </MoiProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/pending/name_group"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <PendingGroupRelo />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/complete/name_group"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <CompleteGroupRelo />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/mois_charts"
            element={
              <PrivateRoute>
                <ChartRelo />
              </PrivateRoute>
            }
          />

          <Route
            path="/pending/lists"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <PendingListRelo />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/completed/lists"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <CompleteListRelo />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/mois_search"
            element={
              <PrivateRoute>
                <MoiSearchRelo />
              </PrivateRoute>
            }
          />

          <Route
            path="/all_name_group"
            element={
              <PrivateRoute>
                <MoiAllGroupProvider>
                  <AllGroupRelo />
                </MoiAllGroupProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <PrivateRoute>
                <LoanAllProvider>
                  <Loan />
                </LoanAllProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/new/loan"
            element={
              <PrivateRoute>
                <NewLoan />
              </PrivateRoute>
            }
          />

          <Route
            path="/update_loan/:id"
            element={
              <PrivateRoute>
                <UpdateLoan />
              </PrivateRoute>
            }
          />

          <Route
            path="/name_group/loans"
            element={
              <PrivateRoute>
                <LoanAllProvider>
                  <AllGroupLoan />
                </LoanAllProvider>
              </PrivateRoute>
            }
          />

          <Route
            path="/place_group/loans"
            element={
              <PrivateRoute>
                <LoanAllProvider>
                  <PlaceGroupLoan />
                </LoanAllProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated() ? "/" : "/login"} />}
          />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
