import logoHaltev from "../assets/logo_haltev.png";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-center mb-4">
          <img
            src={logoHaltev} // Ganti dengan path logo Anda
            alt="Logo"
            className="h-10"
          />
        </div>

        {/* Footer Content */}
        <div className="text-center">
          <p className="text-lg mb-2">
            © 2024 Haltev Blog. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">
            Made with ❤️ by Haltev Team. All the content on this website is for
            educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
