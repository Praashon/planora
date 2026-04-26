import { Box, Menu, X } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext } from "react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { isSignedIn, userName, signIn, signOut } =
    useOutletContext<AuthContext>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(navRef.current!, { y: -20, opacity: 0 });
      gsap.to(navRef.current!, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
      });
    }, navRef);
    return () => ctx.revert();
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
      <header ref={navRef} className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <nav className="inner">
          <div className="left">
            <div className="brand">
              <Box className="logo" />
              <span className="name">Planora</span>
            </div>

            <ul className="links">
              <a href="/how-it-works">How It Works</a>
              <a href="/demo">Demo</a>
              <a href="#">Community</a>
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
          <a href="/how-it-works" onClick={() => setMobileOpen(false)}>
            How It Works
          </a>
          <a href="/demo" onClick={() => setMobileOpen(false)}>
            Demo
          </a>
          <a href="#" onClick={() => setMobileOpen(false)}>
            Community
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
