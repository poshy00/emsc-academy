import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                E
              </div>
              <span className="font-bold">EMSC Academy</span>
            </div>
            <p className="text-gray-400 text-sm">
              Plataforma de formación técnica para cursos de agua, energía y automatización industrial.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/catalogo" className="hover:text-white transition">Catálogo</Link></li>
              <li><a href="#" className="hover:text-white transition">Soporte</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition">Términos</a></li>
              <li><a href="#" className="hover:text-white transition">Cookies</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <p className="text-sm text-gray-400">
              Email: <a href="mailto:enrique.arias@emsc.es" className="text-blue-400 hover:text-blue-300">enrique.arias@emsc.es</a>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Web: <a href="https://emsc.es" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">emsc.es</a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            © 2024 EMSC Global Water Solutions, S.L. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
