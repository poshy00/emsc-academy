import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Clock, BookOpen, Heart, Play, ShoppingCart, Award } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Course, Enrollment } from '@/types';
import { formatPrice, formatDuration } from '@/utils/formatters';
import { cn } from '@/utils/cn';

export interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'compact' | 'featured';
  showInstructor?: boolean;
  showProgress?: boolean;
  enrollment?: Enrollment | null;
  onQuickView?: (course: Course) => void;
  onAddToWishlist?: (courseId: string) => void;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = 'default',
  showInstructor = true,
  showProgress = false,
  enrollment = null,
  onQuickView,
  onAddToWishlist,
  className,
}) => {
  const {
    id,
    titulo,
    descripcion_corta,
    imagen_principal_url,
    instructor,
    calificacion_promedio = 0,
    total_reseñas = 0,
    precio,
    precio_descuento,
    moneda = 'EUR',
    nivel,
    duracion_horas,
    etiquetas = [],
    destacado,
    total_inscripciones = 0,
  } = course;

  const isEnrolled = !!enrollment;
  const discountPercent = precio_descuento && precio > 0
    ? Math.round((1 - precio_descuento / precio) * 100)
    : 0;

  const finalPrice = precio_descuento || precio;
  const isFree = precio === 0;

  return (
    <Card
      variant="elevated"
      padding="none"
      hoverable
      className={cn('group flex flex-col h-full', className)}
    >
      {/* Image container with badges */}
      <Link to={`/cursos/${id}`} className="relative block">
        <div className="relative aspect-video bg-gradient-to-br from-brand-100 to-brand-200 overflow-hidden">
          {imagen_principal_url ? (
            <img
              src={imagen_principal_url}
              alt={titulo}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-white text-5xl font-bold">
              {titulo.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {destacado && (
              <Badge variant="accent" size="sm" className="shadow-md">
                ⭐ Destacado
              </Badge>
            )}
            {nivel && (
              <Badge variant="default" size="sm" className="bg-white/90 text-neutral-900 shadow-md">
                {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
              </Badge>
            )}
            {discountPercent > 0 && (
              <Badge variant="error" size="sm" className="shadow-md">
                -{discountPercent}%
              </Badge>
            )}
            {isFree && (
              <Badge variant="success" size="sm" className="shadow-md">
                Gratis
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          {!isEnrolled && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToWishlist?.(id);
              }}
              className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Añadir a lista de deseos"
            >
              <Heart size={18} className="text-neutral-700 dark:text-neutral-300" />
            </button>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isEnrolled ? (
              <Link
                to={`/cursos/${id}/lecciones`}
                className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-full shadow-xl hover:bg-brand-600 transform hover:scale-105 transition-all"
              >
                <Play size={20} fill="currentColor" />
                Continuar
              </Link>
            ) : (
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Play size={20} fill="currentColor" />}
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView?.(course);
                }}
                className="shadow-xl"
              >
                Vista Previa
              </Button>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-grow flex flex-col p-5">
        {/* Tags */}
        {etiquetas.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {etiquetas.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white line-clamp-2 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          <Link to={`/cursos/${id}`}>{titulo}</Link>
        </h3>

        {/* Description */}
        {descripcion_corta && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
            {descripcion_corta}
          </p>
        )}

        {/* Instructor */}
        {showInstructor && instructor && (
          <div className="flex items-center gap-2 mb-3">
            {instructor.avatar_url ? (
              <img
                src={instructor.avatar_url}
                alt={instructor.nombre}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-xs font-semibold text-brand-600">
                {instructor.nombre?.charAt(0).toUpperCase()}
              </div>
            )}
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium text-neutral-900 dark:text-neutral-200">
                {instructor.nombre}
              </span>
            </p>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={cn(
                  'transition-colors',
                  i < Math.floor(calificacion_promedio)
                    ? 'fill-warning-400 text-warning-400'
                    : 'text-neutral-300 dark:text-neutral-600'
                )}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            {calificacion_promedio > 0 ? calificacion_promedio.toFixed(1) : 'Nuevo'}
          </span>
          {total_reseñas > 0 && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              ({total_reseñas.toLocaleString()})
            </span>
          )}
        </div>

        {/* Course meta */}
        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{formatDuration(duracion_horas)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} />
            <span>{total_inscripciones.toLocaleString()}</span>
          </div>
          {isEnrolled && enrollment && (
            <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
              <BookOpen size={14} />
              <span className="font-medium">{enrollment.porcentaje_progreso}%</span>
            </div>
          )}
        </div>

        {/* Progress bar (if enrolled) */}
        {showProgress && isEnrolled && enrollment && enrollment.porcentaje_progreso > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Tu progreso
              </span>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                {enrollment.porcentaje_progreso}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${enrollment.porcentaje_progreso}%` }}
              />
            </div>
          </div>
        )}

        {/* Pricing & CTA */}
        <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-end justify-between mb-3">
            <div>
              {precio_descuento && precio > 0 ? (
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-error-500">
                    {formatPrice(precio_descuento, moneda)}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
                    {formatPrice(precio, moneda)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {isFree ? 'Gratis' : formatPrice(precio, moneda)}
                </span>
              )}
            </div>

            {/* Certificate badge */}
            {course.tiene_certificado && (
              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                <Award size={14} />
                <span>Certificado</span>
              </div>
            )}
          </div>

          {isEnrolled ? (
            <Button
              fullWidth
              variant="primary"
              size="lg"
              leftIcon={<Play size={18} />}
              as={Link}
              to={`/cursos/${id}/lecciones`}
            >
              Continuar Aprendiendo
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                fullWidth
                variant={isFree ? 'success' : 'primary'}
                size="lg"
                leftIcon={isFree ? <BookOpen size={16} /> : <ShoppingCart size={16} />}
                as={Link}
                to={`/cursos/${id}`}
              >
                {isFree ? 'Gratis' : 'Comprar'}
              </Button>
              <Button
                fullWidth
                variant="secondary"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView?.(course);
                }}
              >
                Ver Más
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
