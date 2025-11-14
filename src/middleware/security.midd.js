import helmet from 'helmet';

/**
 * Función para aplicar middlewares de seguridad basados en Helmet a la aplicación Express.
 * @param {import('express').Application} app Instancia de Express
 */
const setupSecurityMiddleware = (app) => {
  // Usamos el set completo de Helmet por defecto (seguridad general)
  // Nota: Esta llamada ya cubre muchas de las cabeceras defensivas.
  app.use(helmet()); 

  // --- Configuraciones explícitas y granulares de Helmet ---

  // Content Security Policy (CSP): Previene ataques XSS e inyección de contenido
  // ¡Advertencia! Ajusta estas directivas para las fuentes reales de tu frontend
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        blockAllMixedContent: [],
        fontSrc: ["'self'", 'https:', 'data:'],
        frameAncestors: ["'none'"], // Previene que tu app sea embebida
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        upgradeInsecureRequests: [],
        // styleSrc se permite 'unsafe-inline' solo para frameworks que lo requieran (ej: Bootstrap)
        // Se recomienda eliminarlo en producción si no es estrictamente necesario.
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      },
    })
  );

  // Prevención de clickjacking
  app.use(helmet.frameguard({ action: 'deny' }));

  // HSTS (HTTP Strict Transport Security): Forzar HTTPS.
  app.use(
    helmet.hsts({
      maxAge: 63072000, // 2 años
      includeSubDomains: true,
      preload: true,
    })
  );

  // Referrer-Policy: Controla qué información se envía en la cabecera Referer
  app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));

  // Elimina la cabecera X-Powered-By (para ofuscar la tecnología)
  app.use(helmet.hidePoweredBy());

  // Evita la detección de tipo MIME incorrecto (MIME Sniffing)
  app.use(helmet.noSniff());

  // Control de recursos cross-origin
  app.use(helmet.crossOriginResourcePolicy({ policy: 'same-origin' }));
  app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin' }));
  app.use(helmet.crossOriginEmbedderPolicy({ policy: 'require-corp' }));
  console.log('✅ Middlewares de Seguridad (Helmet) aplicados.');
};

export default setupSecurityMiddleware;