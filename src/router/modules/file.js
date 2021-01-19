/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const fileRouter = {
  path: '/file',
  component: Layout,
  redirect: 'noRedirect',
  name: 'myFile',
  meta: { 
    title: 'File', 
    icon: 'documentation', 
    affix: true 
  },
  children: [
    {
      path: 'video',
      component: () => import('@/views/components-demo/tinymce'),
      name: 'TinymceDemo',
      meta: { title: 'Tinymce' }
    },
    {
      path: 'drag-kanban',
      component: () => import('@/views/components-demo/drag-kanban'),
      name: 'DragKanbanDemo',
      meta: { title: 'Drag Kanban' }
    }
  ]
}

export default fileRouter
