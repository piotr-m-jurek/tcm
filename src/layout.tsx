import { Child } from 'hono/jsx';

export function Layout({ children }: { children: Child }) {
  return (
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
      </head>
      <body class="flex size-full bg-stone-700 text-gray-200">{children}</body>
    </html>
  );
}
