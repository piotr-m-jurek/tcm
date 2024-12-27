import { Hono } from 'hono';
import { renderAdminView, updateItem } from './admin';
import { renderUserView } from './user';
import { renderTestingView } from './testing';

const app = new Hono();

export const routes = {
  adminView: '/admin',
  userView: '/',
  updateItem: '/api/item/:itemId',
  testingView: '/testing',
  testingViewData: '/testing/data',
};

app.get(routes.adminView, renderAdminView);
app.get(routes.userView, renderUserView);
app.post(routes.updateItem, updateItem);

// ===================
// ===== TESTING =====
// ===================

app.get(routes.testingView, renderTestingView);
app.post(routes.testingViewData, async (c) => {
  console.log('post came');
  const formData = await c.req.formData();
  const routes = formData.getAll('routes');
  const multi = formData.getAll('multi');
  console.log(routes);
});

export default app;
