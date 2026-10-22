import { BarChart3, FolderTree, Image as ImageIcon, Inbox, LayoutDashboard, MessageSquare, Package, Percent, Settings, ShoppingCart, Users, Zap, type LucideIcon } from 'lucide-react'

export type NavItem = { label: string; href: string; icon: LucideIcon }
export type NavGroup = { title: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  { title: 'Overview', items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }, { label: 'Reports', href: '/admin/reports', icon: BarChart3 }] },
  { title: 'Sales', items: [{ label: 'Orders', href: '/admin/orders', icon: ShoppingCart }, { label: 'Customers', href: '/admin/customers', icon: Users }] },
  { title: 'Catalog', items: [{ label: 'Products', href: '/admin/products', icon: Package }, { label: 'Categories', href: '/admin/categories', icon: FolderTree }, { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare }] },
  { title: 'Marketing', items: [{ label: 'Flash sales', href: '/admin/flash-sales', icon: Zap }, { label: 'Coupons & combos', href: '/admin/coupons', icon: Percent }, { label: 'Banners', href: '/admin/banners', icon: ImageIcon }] },
  { title: 'CRM', items: [{ label: 'Messages', href: '/admin/messages', icon: Inbox }] },
  { title: 'System', items: [{ label: 'Settings', href: '/admin/settings', icon: Settings }] },
]
