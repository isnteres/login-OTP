import { FiSearch } from "react-icons/fi"
import { EMPLOYEE_TYPES, EMPLOYEE_STATUSES } from "../../../../../constants/employee.constants"
import styles from "./PersonalFilters.module.css"

export default function PersonalFilters({
  search, setSearch,
  filterType, setFilterType,
  filterStatus, setFilterStatus,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <FiSearch className={styles.searchIcon} size={12} />
        <input
          placeholder="Buscar por nombre, email o puesto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <select
        value={filterType}
        onChange={e => setFilterType(e.target.value)}
        className={styles.select}
      >
        <option value="todos">Todos los tipos</option>
        {EMPLOYEE_TYPES.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        value={filterStatus}
        onChange={e => setFilterStatus(e.target.value)}
        className={styles.select}
      >
        <option value="todos">Todos los estados</option>
        {EMPLOYEE_STATUSES.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
