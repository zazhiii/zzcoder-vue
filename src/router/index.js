import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    component: () => import('@/views/main'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: 'user',
        component: () => import('@/views/user/index.vue'),
      },
      {
        path: 'problem',
        component: () => import('@/views/problem/PageProblem.vue'),
      },
      {
        path: 'problem/add',
        component: () => import('@/views/problem/admin/AddProblem.vue')
      },
      {
        path: 'problem/:problemId',
        component: () => import('@/views/problem/ProblemView.vue')
      },
      {
        path: 'problem/:problemId/edit',
        component: () => import('@/views/problem/admin/EditProblem.vue')
      },
      {
        path: 'problem/:problemId/edit-test-case',
        component: () => import('@/views/problem/admin/EditTestCase.vue')
      },
      {
        path: 'problem/:problemId/add-tag',
        component: () => import('@/views/problem/admin/AddTag.vue')
      },
      {
        path: 'problem/judge-result/:problemId',
        component: () => import('@/views/problem/judgeResultView.vue')
      },
      {
        path: 'submissions',
        component: () => import('@/views/judge/submissionsView.vue'),
      },
      {
        path: 'problem-set',
        component: () => import('@/views/problem-set/PageProblemSet.vue'),
      },
      {
        path: 'problem-set/add',
        component: () => import('@/views/problem-set/AddProblemSet.vue')
      },
      {
        path: 'problem-set/:problemSetId',
        component: () => import('@/views/problem-set/ProblemSet.vue'),
      },
      {
        path: 'problem-set/edit/:problemSetId',
        component: () => import('@/views/problem-set/EditProblemSet.vue'),
      },
      {
        path: 'contest',
        component: () => import('@/views/contest/index.vue'),
      },
      {
        path: 'contest/create',
        component: () => import('@/views/contest/createContestView.vue')
      },
      {
        path: 'contest:contestId',
        component: () => import('@/views/contest/contestInfoView.vue'),
      },
      // {
      //   path: 'demo',
      //   component: () => import('@/components/DifficultySelectDemo.vue')
      // }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
