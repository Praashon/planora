import { Box, Menu, X } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext } from "react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { isSignedIn, userName, signIn, signOut } =
    useOutletContext<AuthContext>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 },
      );
    }
  }, []);

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
      <header
        ref={navRef}
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        style={{ opacity: 0 }}
      >
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
                <Button size="sm" variant="ghost" onClick={handleAuthClick}>
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
              variant="outline"
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
              variant="primary"
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
