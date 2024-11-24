import { Context } from 'hono';

export const userView = (c: Context) => {
  return c.html(<div>user view</div>);
};
