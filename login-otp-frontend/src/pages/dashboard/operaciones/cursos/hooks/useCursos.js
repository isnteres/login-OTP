import { useEffect, useMemo, useState } from "react"
import { courseService } from "../../../../../services/courseService"

export function useCursos() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("todas")
  const [level, setLevel] = useState("todos")
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await courseService.getAll({ all: true })
        setCourses(data)
      } catch (err) {
        console.error("Error cargando cursos:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        (c.instructor || "").toLowerCase().includes(search.toLowerCase())

      const matchesCategory = category === "todas" || c.category === category
      const matchesLevel    = level === "todos"   || c.level === level
      const matchesActive   = showAll || c.isActive

      return matchesSearch && matchesCategory && matchesLevel && matchesActive
    })
  }, [courses, search, category, level, showAll])

  const categories = useMemo(() => {
    const set = new Set(courses.map(c => c.category).filter(Boolean))
    return ["todas", ...Array.from(set)]
  }, [courses])

  const levels = ["todos", "Básico", "Intermedio", "Avanzado"]

  const toggleActive = async (course) => {
    const { isActive } = await courseService.toggleActive(course.id)
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isActive } : c))
    return isActive
  }

  const upsertCourse = (course, mode) => {
    setCourses(prev => {
      if (mode === "add") {
        return [course, ...prev]
      }
      return prev.map(c => c.id === course.id ? course : c)
    })
  }

  return {
    courses,
    loading,
    search, setSearch,
    category, setCategory,
    level, setLevel,
    showAll, setShowAll,
    filteredCourses,
    categories,
    levels,
    toggleActive,
    upsertCourse,
  }
}

