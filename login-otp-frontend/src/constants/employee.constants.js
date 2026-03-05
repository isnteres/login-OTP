// Tabla: employee_types
export const EMPLOYEE_TYPES = [
  { value: "Instructor",             label: "Instructor" },
  { value: "Desarrollador",          label: "Desarrollador" },
  { value: "Administrador",          label: "Administrador" },
  { value: "Asistente Administrativo", label: "Asistente Administrativo" },
]

// Tabla: departments
export const DEPARTMENTS = [
  { value: "Administración",          label: "Administración" },
  { value: "Recursos Humanos",        label: "Recursos Humanos" },
  { value: "Tecnología de la Información", label: "Tecnología de la Información" },
  { value: "Desarrollo",              label: "Desarrollo" },
  { value: "Educación",               label: "Educación" },
  { value: "Marketing",               label: "Marketing" },
  { value: "Ventas",                  label: "Ventas" },
  { value: "Soporte Técnico",         label: "Soporte Técnico" },
  { value: "Operaciones",             label: "Operaciones" },
  { value: "Finanzas",                label: "Finanzas" },
]

// Tabla: positions — agrupados por employee_type
export const POSITIONS_BY_TYPE = {
  Instructor: [
    { value: "Instructor Senior",        label: "Instructor Senior" },
    { value: "Instructor Junior",        label: "Instructor Junior" },
    { value: "Coordinador de Contenidos",label: "Coordinador de Contenidos" },
    { value: "Especialista en Formación",label: "Especialista en Formación" },
  ],
  Desarrollador: [
    { value: "Desarrollador Senior",     label: "Desarrollador Senior" },
    { value: "Desarrollador Junior",     label: "Desarrollador Junior" },
    { value: "Analista de Sistemas",     label: "Analista de Sistemas" },
    { value: "Arquitecto de Software",   label: "Arquitecto de Software" },
  ],
  Administrador: [
    { value: "Jefe de RRHH",             label: "Jefe de RRHH" },
    { value: "Coordinador Administrativo", label: "Coordinador Administrativo" },
    { value: "Gerente de Operaciones",   label: "Gerente de Operaciones" },
  ],
  "Asistente Administrativo": [
    { value: "Asistente de RRHH",        label: "Asistente de RRHH" },
    { value: "Asistente Contable",       label: "Asistente Contable" },
    { value: "Soporte Técnico",          label: "Soporte Técnico" },
  ],
}

// Niveles de educación
export const EDUCATION_LEVELS = [
  { value: "Técnico",    label: "Técnico" },
  { value: "Bachiller",  label: "Bachiller" },
  { value: "Licenciado", label: "Licenciado" },
  { value: "Magíster",   label: "Magíster" },
  { value: "Doctorado",  label: "Doctorado" },
]

// Estados posibles de un empleado
export const EMPLOYEE_STATUSES = [
  { value: "Activo",   label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
]
