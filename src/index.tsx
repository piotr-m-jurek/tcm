import { Hono } from 'hono';
import { renderAdminView, updateItem } from './admin';
import { userView } from './user';

const app = new Hono();

const routes = {
  adminView: '/admin',
  userView: '/',
  updateItem: '/api/item/:itemId',
};

app.get(routes.adminView, renderAdminView);
app.get(routes.userView, userView);
app.post(routes.updateItem, updateItem);

export default app;
