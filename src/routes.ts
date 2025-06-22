import { Router } from 'express';
import authRoutes from './features/auth/auth.route';
import productRoutes from './features/product/product.route';
import userRoutes from './features/user/user.route';
import { verifyToken } from './middlewares/jwt';
import actionRoutes from './features/rbac/action/action.route';
import permissionRoutes from './features/rbac/permission/permission.route';
import roleRoutes from './features/rbac/role/role.route';
import channelRoutes from './features/rbac/channel/channel.route';
import moduleRoutes from './features/rbac/module/module.route';
import subModuleRoutes from './features/rbac/sub-module/sub-module.route';
import productCategoryRoutes from './features/product-category/product-category.route';

const routes = Router();

// Health check route
routes.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running smoothly!' });
});

// Public routes (No authentication required)
routes.use('/api/auth', authRoutes);

// Protected routes (Require JWT authentication)
routes.use('/api', verifyToken, moduleRoutes);
routes.use('/api', verifyToken, subModuleRoutes);
routes.use('/api', verifyToken, channelRoutes);
routes.use('/api', verifyToken, roleRoutes);
routes.use('/api', verifyToken, actionRoutes);
routes.use('/api', verifyToken, permissionRoutes);
routes.use('/api', verifyToken, productCategoryRoutes);
routes.use('/api', verifyToken, productRoutes);
routes.use('/api', verifyToken, userRoutes);

export default routes;
