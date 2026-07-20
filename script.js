// Arreglo de objetos que representa los datos del proyecto
let estudiantes = [
    {
        id: 1,
        nombre: "María López",
        correo: "maria@ejemplo.com",
        curso: "Primero",
        estado: "Activo"
    },
    {
        id: 2,
        nombre: "Carlos Méndez",
        correo: "carlos@ejemplo.com",
        curso: "Segundo",
        estado: "Inactivo"
    },
    {
        id: 3,
        nombre: "Daniela Torres",
        correo: "daniela@ejemplo.com",
        curso: "Tercero",
        estado: "Activo"
    }
];

// Selección de elementos del documento
const formulario = document.getElementById("formularioEstudiante");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const curso = document.getElementById("curso");
const estado = document.getElementById("estado");

const listaEstudiantes = document.getElementById("listaEstudiantes");
const mensajeEstado = document.getElementById("mensajeEstado");
const mensajeFormulario = document.getElementById("mensajeFormulario");
const contador = document.getElementById("contador");
const resumen = document.getElementById("resumen");
const botonLimpiar = document.getElementById("botonLimpiar");

// Renderizar todos los estudiantes
function renderizarEstudiantes() {
    // Se limpia el contenido para evitar duplicaciones
    listaEstudiantes.innerHTML = "";

    // Condición para comprobar si existen registros
    if (estudiantes.length === 0) {
        mensajeEstado.innerHTML = `
            <div class="alert alert-warning">
                No existen estudiantes registrados.
            </div>
        `;

        contador.textContent = "0 registros";
        actualizarResumen();
        return;
    }

    mensajeEstado.innerHTML = `
        <div class="alert alert-success">
            La información se cargó correctamente.
        </div>
    `;

    // Estructura repetitiva para mostrar varios registros
    estudiantes.forEach(function (estudiante) {
        const columna = document.createElement("div");
        columna.className = "col-12 col-md-6 col-lg-4";

        // Condición para cambiar el color según el estado
        const colorEstado =
            estudiante.estado === "Activo"
                ? "bg-success"
                : "bg-secondary";

        columna.innerHTML = `
            <article class="card tarjeta-estudiante shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h3 class="card-title h5">
                            ${escaparHTML(estudiante.nombre)}
                        </h3>

                        <span class="badge ${colorEstado}">
                            ${estudiante.estado}
                        </span>
                    </div>

                    <p class="card-text">
                        <strong>Correo:</strong>
                        ${escaparHTML(estudiante.correo)}
                    </p>

                    <p class="card-text">
                        <strong>Curso:</strong>
                        ${escaparHTML(estudiante.curso)}
                    </p>

                    <button
                        type="button"
                        class="btn btn-outline-danger btn-sm"
                        onclick="eliminarEstudiante(${estudiante.id})"
                    >
                        Eliminar
                    </button>
                </div>
            </article>
        `;

        listaEstudiantes.appendChild(columna);
    });

    contador.textContent =
        estudiantes.length === 1
            ? "1 registro"
            : `${estudiantes.length} registros`;

    actualizarResumen();
}

// Mostrar un resumen condicionado por el estado de los datos
function actualizarResumen() {
    const estudiantesActivos = estudiantes.filter(function (estudiante) {
        return estudiante.estado === "Activo";
    }).length;

    if (estudiantes.length === 0) {
        resumen.textContent =
            "Todavía no existen datos para mostrar.";
    } else if (estudiantesActivos === estudiantes.length) {
        resumen.textContent =
            `Existen ${estudiantes.length} estudiantes y todos están activos.`;
    } else {
        resumen.textContent =
            `Total: ${estudiantes.length}. Estudiantes activos: ${estudiantesActivos}.`;
    }
}

// Validar el nombre
function validarNombre() {
    const valor = nombre.value.trim();
    const expresionNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{3,60}$/;

    if (valor === "") {
        mostrarError(nombre, "errorNombre", "El nombre es obligatorio.");
        return false;
    }

    if (!expresionNombre.test(valor)) {
        mostrarError(
            nombre,
            "errorNombre",
            "Ingrese un nombre válido de al menos 3 letras."
        );
        return false;
    }

    mostrarValido(nombre, "errorNombre");
    return true;
}

// Validar el correo
function validarCorreo() {
    const valor = correo.value.trim();
    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (valor === "") {
        mostrarError(correo, "errorCorreo", "El correo es obligatorio.");
        return false;
    }

    if (!expresionCorreo.test(valor)) {
        mostrarError(
            correo,
            "errorCorreo",
            "Ingrese un correo electrónico válido."
        );
        return false;
    }

    const correoRepetido = estudiantes.some(function (estudiante) {
        return estudiante.correo.toLowerCase() === valor.toLowerCase();
    });

    if (correoRepetido) {
        mostrarError(
            correo,
            "errorCorreo",
            "Este correo ya se encuentra registrado."
        );
        return false;
    }

    mostrarValido(correo, "errorCorreo");
    return true;
}

// Validar el curso
function validarCurso() {
    if (curso.value === "") {
        mostrarError(curso, "errorCurso", "Seleccione un curso.");
        return false;
    }

    mostrarValido(curso, "errorCurso");
    return true;
}

// Validar el estado
function validarEstado() {
    if (estado.value === "") {
        mostrarError(estado, "errorEstado", "Seleccione un estado.");
        return false;
    }

    mostrarValido(estado, "errorEstado");
    return true;
}

// Mostrar errores
function mostrarError(campo, identificadorError, mensaje) {
    document.getElementById(identificadorError).textContent = mensaje;
    campo.classList.add("campo-invalido");
    campo.classList.remove("campo-valido");
}

// Mostrar que un campo es válido
function mostrarValido(campo, identificadorError) {
    document.getElementById(identificadorError).textContent = "";
    campo.classList.remove("campo-invalido");
    campo.classList.add("campo-valido");
}

// Registrar un estudiante
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombreValido = validarNombre();
    const correoValido = validarCorreo();
    const cursoValido = validarCurso();
    const estadoValido = validarEstado();

    if (
        nombreValido &&
        correoValido &&
        cursoValido &&
        estadoValido
    ) {
        const nuevoEstudiante = {
            id: Date.now(),
            nombre: nombre.value.trim(),
            correo: correo.value.trim(),
            curso: curso.value,
            estado: estado.value
        };

        estudiantes.push(nuevoEstudiante);

        renderizarEstudiantes();

        mensajeFormulario.className = "alert alert-success mt-3";
        mensajeFormulario.textContent =
            "El estudiante fue registrado correctamente.";

        formulario.reset();
        limpiarValidaciones();
    } else {
        mensajeFormulario.className = "alert alert-danger mt-3";
        mensajeFormulario.textContent =
            "Revise los campos señalados antes de continuar.";
    }
});

// Eliminar un registro
function eliminarEstudiante(id) {
    estudiantes = estudiantes.filter(function (estudiante) {
        return estudiante.id !== id;
    });

    renderizarEstudiantes();

    mensajeFormulario.className = "alert alert-info mt-3";
    mensajeFormulario.textContent =
        "El registro fue eliminado.";
}

// Limpiar mensajes de validación
function limpiarValidaciones() {
    const campos = [nombre, correo, curso, estado];

    campos.forEach(function (campo) {
        campo.classList.remove("campo-invalido", "campo-valido");
    });

    document.getElementById("errorNombre").textContent = "";
    document.getElementById("errorCorreo").textContent = "";
    document.getElementById("errorCurso").textContent = "";
    document.getElementById("errorEstado").textContent = "";
}

// Validaciones dinámicas
nombre.addEventListener("input", validarNombre);
correo.addEventListener("input", validarCorreo);
curso.addEventListener("change", validarCurso);
estado.addEventListener("change", validarEstado);

botonLimpiar.addEventListener("click", function () {
    limpiarValidaciones();
    mensajeFormulario.textContent = "";
    mensajeFormulario.className = "mt-3";
});

// Evita insertar etiquetas HTML desde el formulario
function escaparHTML(texto) {
    const elemento = document.createElement("div");
    elemento.textContent = texto;
    return elemento.innerHTML;
}

// Año automático del pie de página
document.getElementById("anio").textContent =
    new Date().getFullYear();

// Primera carga de los registros
renderizarEstudiantes();
