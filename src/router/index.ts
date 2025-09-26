// src/router/index.ts

import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { alertController } from '@ionic/vue';
import TabsPage from '../views/TabsPage.vue';

// تابع بررسی لایسنس
const checkLicense = () => localStorage.getItem('licenseValid') === 'true';

// پیام خطای Ionic برای دسترسی نداشتن
const showAccessDeniedAlert = async () => {
  const alert = await alertController.create({
    header: '⚠️ دسترسی مسدود شد',
    message: 'لایسنس شما برای دسترسی به Tab 3 نامعتبر است. لطفاً ابتدا لایسنس خود را ثبت کنید.',
    buttons: ['متوجه شدم'],
  });
  await alert.present();
};

// تعریف مسیرها
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/otp'
  },
  {
    path: '/otp',
    component: () => import('@/views/otp.vue') // فایل otp.vue شما
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        name: 'Tab3',
        component: () => import('@/views/Tab3Page.vue'),
        // چک کردن لایسنس قبل از ورود
        beforeEnter: (to, from, next) => {
          if (checkLicense()) {
            next();
          } else {
            showAccessDeniedAlert();
            next({ path: '/tabs/tab1' });
          }
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
