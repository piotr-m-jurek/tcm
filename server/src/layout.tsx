import { jsxRenderer } from 'hono/jsx-renderer';

export const RootLayout = jsxRenderer(({ children }) => (
  <html class="flex size-full">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
      <script
        src="https://unpkg.com/htmx.org@1.9.10"
        integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
        crossorigin="anonymous"
      />
      <script
        defer
        src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
      />
      <script src="https://unpkg.com/lucide@latest" />
    </head>
    <body class="flex size-full">{children}</body>

    <script>lucide.createIcons();</script>
  </html>
));
