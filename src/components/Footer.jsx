const Footer = () => {
  return (
    <footer className="bg-light text-dark py-4 border-top mt-auto">
      <div className="container px-md-5">
        <div className="row align-items-center justify-content-between text-center text-md-start">
          {/* Left side: Copyright & Legal */}
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-md-3">
              <span className="text-secondary">&copy; {new Date().getFullYear()} StayNest, Inc.</span>
              <div className="d-flex gap-3">
                <a href="#" className="text-secondary text-decoration-none small hover-underline">Privacy</a>
                <span className="text-secondary small">&middot;</span>
                <a href="#" className="text-secondary text-decoration-none small hover-underline">Terms</a>
                <span className="text-secondary small">&middot;</span>
                <a href="#" className="text-secondary text-decoration-none small hover-underline">Sitemap</a>
              </div>
            </div>
          </div>
          {/* Right side: Socials & Currency/Language */}
          <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end gap-4 align-items-center">
            {/* Social Icons */}
            <div className="d-flex gap-3 fs-5">
              <a href="#" className="text-dark opacity-75 hover-opacity-100 transition-all">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" className="text-dark opacity-75 hover-opacity-100 transition-all">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="text-dark opacity-75 hover-opacity-100 transition-all">
                <i className="fa-brands fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
