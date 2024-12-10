import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes as autoRoutes } from 'vue-router/auto-routes'

// Definindo rotas manualmente
const manualRoutes = [

  {
    path: '/',
    name: 'menu',
    component: () => import('@/pages/Menu.vue'),
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'), 
  },
  {
    path: '/recuperar-senha',
    name: 'RecuperarSenha',
    component: () => import('@/pages/RecuperarSenha.vue'), 
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: () => import('@/pages/Cadastro.vue'), 
  },
  {
    path: '/produtos',
    name: 'Produtos',
    component: () => import('@/pages/Produtos.vue'), 
  },
  {
    path: '/pecas',
    name: 'Pecas',
    component: () => import('@/pages/Pecas.vue'), 
  },
  {
    path: '/linha',
    name: 'Linha',
    component: () => import('@/pages/Linha.vue'), 
  },
  {
    path: '/bom',
    name: 'BOM',
    component: () => import('@/pages/BOM.vue'), 
  },
  {
    path: '/planejamento',
    name: 'Planejamento',
    component: () => import('@/pages/Planejamento.vue'), 
  },

  {
    path: '/entrada',
    name: 'CaixaDeEntrada',
    component: () => import('@/pages/CaixaDeEntrada.vue'), 
  },
  {
    path: '/entrada',
    name: 'CaixaDeEntrada',
    component: () => import('@/pages/CaixaDeEntrada.vue'), 
  },
  {
    path: '/funcionarios',
    name: 'Funcionarios',
    component: () => import('@/pages/Funcionarios.vue'), 
  },
  {
    path: '/relatorios',
    name: 'Relatórios',
    component: () => import('@/pages/Relatorios.vue'), 
  },

  // Você pode adicionar mais rotas manualmente aqui
]

// Mesclando rotas automáticas com as manuais
const routes = [...autoRoutes, ...manualRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
