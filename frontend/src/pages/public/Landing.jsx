import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Zap } from 'lucide-react';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    // TODO: Enviar email a backend
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Formación Técnica en Agua, Energía y Automatización
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Cursos especializados para ingenieros y técnicos. Aprende a tu ritmo, desde cualquier lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalogo"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
            >
              Ver Catálogo
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700 transition text-lg"
            >
              Registrarse Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            ¿Por qué elegir EMSC Academy?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Contenido Especializado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cursos diseñados por expertos en agua, energía y automatización industrial.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Aprende Flexible
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Accede a los cursos cuando quieras, desde cualquier dispositivo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Certificados
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Obtén certificados verificables al completar los cursos.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Comunidad
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Conéctate con otros profesionales del sector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Mantente Informado
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Suscríbete para recibir actualizaciones sobre nuevos cursos y contenido exclusivo.
          </p>

          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Suscribir
            </button>
          </form>

          {subscribed && (
            <p className="mt-4 text-green-200">✅ ¡Gracias por suscribirte!</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Comienza Tu Aprendizaje Hoy
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Miles de profesionales ya confían en EMSC Academy para su desarrollo técnico.
          </p>
          <Link
            to="/catalogo"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition text-lg"
          >
            Explorar Cursos Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
