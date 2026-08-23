import { Outlet } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import styles from './AdminLayout.module.css'

function AdminLayout() {
  return (
    <div className={styles.layout}>
      <AdminHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
