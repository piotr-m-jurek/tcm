import { Hono } from 'hono';
import * as admin from './admin';
import * as user from './user';
import * as testing from './testing';
import { RootLayout } from './layout';

export const routes = {
  adminView: '/admin',
  userView: '/',
  searchView: '/search',
  updateItem: '/api/item/:itemId',
  testingView: '/testing',
  testingViewData: '/testing/data',
} as const;

const app = new Hono();

app.use('*', RootLayout);

// =================
// ===== ADMIN =====
// =================
app.get(routes.adminView, admin.renderAdminView);
app.post(routes.updateItem, admin.updateItem);

// ================
// ===== USER =====
// ================
app.post(routes.userView, user.renderUserItems);
app.get(routes.userView, user.renderUserView);

app.get(routes.searchView, user.renderSearchView);

// ===================
// ===== TESTING =====
// ===================

app.get(routes.testingView, testing.renderTestingView);
app.post(routes.testingViewData, async (c) => {
  console.log('post came');
  const formData = await c.req.formData();
  // const routes = formData.getAll('routes');
  const multi = formData.getAll('multi');
  console.log(JSON.stringify({ formData, multi }, null, 2));
});

export default app;
