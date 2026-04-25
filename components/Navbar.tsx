import { Box, Menu, X } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext } from "react-router";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn, userName, signIn, signOut } =
    useOutletContext<AuthContext>();

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (error) {
        console.error("Puter Sign Out Error:", error);
      }
    } else {
      try {
        await signIn();
      } catch (error) {
        console.error("Puter Sign In Error:", error);
      }
    }
  };

  return (
    <>
      <header className="navbar">
        <nav className="inner">
          <div className="left">
            <div className="brand">
              <Box className="logo" />

              <span className="name">Planora</span>
            </div>

            <ul className="links">
              <a href="#">Product</a>
              <a href="#">Pricing</a>
              <a href="#">Community</a>
              <a href="#">Enterprise</a>
            </ul>
          </div>

          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="actions">
            {isSignedIn ? (
              <>
                <span className="greeting">
                  {userName ? `Hi, ${userName}!` : "Sign in"}
                </span>

                <Button size="sm" onClick={handleAuthClick} className="btn">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleAuthClick} size="sm" variant="ghost">
                  Log In
                </Button>

                <a href="#upload" className="cta">
                  Get Started
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="mobile-menu">
          <a href="#" onClick={() => setMobileOpen(false)}>
            Product
          </a>
          <a href="#" onClick={() => setMobileOpen(false)}>
            Pricing
          </a>
          <a href="#" onClick={() => setMobileOpen(false)}>
            Community
          </a>
          <a href="#" onClick={() => setMobileOpen(false)}>
            Enterprise
          </a>

          {isSignedIn ? (
            <Button
              size="sm"
              onClick={() => {
                handleAuthClick();
                setMobileOpen(false);
              }}
            >
              Log Out
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                handleAuthClick();
                setMobileOpen(false);
              }}
            >
              Log In
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
