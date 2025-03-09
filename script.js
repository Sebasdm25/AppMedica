let pacientes = [];
let consultas = [];

window.onload = function() {
    // Cargar pacientes desde localStorage
    let pacientesGuardados = localStorage.getItem('pacientes');
    if (pacientesGuardados) {
        pacientes = JSON.parse(pacientesGuardados);
        mostrarPacientes();
    }

    // Cargar consultas desde localStorage
    let consultasGuardadas = localStorage.getItem('consultas');
    if (consultasGuardadas) {
        consultas = JSON.parse(consultasGuardadas);
        mostrarConsultas();
    }
};

function agregarPaciente() {
    let nombre = document.getElementById("nombrePaciente").value;
    let edad = document.getElementById("edadPaciente").value;
    let historialInput = document.getElementById("historialPaciente");
    let contacto = document.getElementById("contactoPaciente").value;
    
    if (nombre && edad && historialInput.files.length > 0 && contacto) {
        let archivoHistorial = historialInput.files[0];
        
        // Crear una URL de objeto para el archivo PDF
        let historialURL = URL.createObjectURL(archivoHistorial);

        let id = Date.now().toString(); // Generar ID único
        pacientes.push({ id, nombre, edad, historial: historialURL, contacto });
        
        // Guardar en localStorage
        localStorage.setItem('pacientes', JSON.stringify(pacientes));

        // Mostrar la lista de pacientes actualizada
        mostrarPacientes();
    } else {
        alert("Todos los campos son obligatorios.");
    }
}

function agregarConsulta() {
    let idPacienteInput = document.getElementById("idPacienteConsulta");
    let pacienteInput = document.getElementById("pacienteConsulta");
    let fechaInput = document.getElementById("fechaConsulta");
    let diagnosticoInput = document.getElementById("diagnosticoConsulta");
    let tratamientoInput = document.getElementById("tratamientoConsulta");
    let nombreDoctorInput = document.getElementById("nombreDoctorConsulta");

    if (!idPacienteInput || !pacienteInput || !fechaInput || !diagnosticoInput || !tratamientoInput || !nombreDoctorInput) {
        alert("Error: No se encontraron los campos necesarios en el formulario.");
        return;
    }

    let idPaciente = idPacienteInput.value;
    let paciente = pacienteInput.value;
    let fecha = fechaInput.value;
    let diagnostico = diagnosticoInput.value;
    let tratamientoFile = tratamientoInput.files[0];
    let nombreDoctor = nombreDoctorInput.value;

    if (idPaciente && paciente && fecha && diagnostico && tratamientoFile && nombreDoctor) {
        let id = Date.now().toString();
        let tratamientoURL = URL.createObjectURL(tratamientoFile);

        consultas.push({ id, idPaciente, paciente, fecha, diagnostico, tratamiento: tratamientoURL, nombreDoctor });

        // Guardar en localStorage
        localStorage.setItem('consultas', JSON.stringify(consultas));

        mostrarConsultas();
    }
}


function mostrarPacientes() {
    let lista = document.getElementById("listaPacientes");
    lista.innerHTML = "";
    pacientes.forEach(p => {
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>${p.nombre}</strong> - ${p.edad} años - ID: ${p.id} <br>
            <strong>Historial:</strong> <a href="${p.historial}" target="_blank" rel="noopener noreferrer">Abrir PDF</a> <br>
            <strong>Número de Contacto:</strong> ${p.contacto} <br>
            <button class="edit-patient-button" onclick="editarPaciente('${p.id}')">Editar</button>
            <button class="delete-patient-button" onclick="eliminarPaciente('${p.id}')">Eliminar</button>
        `;
        lista.appendChild(li);
    });
}

function mostrarConsultas() {
    let listaConsultas = document.getElementById("listaConsultas");
    listaConsultas.innerHTML = ""; // Limpiar la lista antes de actualizar

    consultas.forEach((consulta) => {
        let item = document.createElement("li");
        item.innerHTML = `
            <strong>ID Paciente:</strong> ${consulta.idPaciente} <br>
            <strong>Paciente:</strong> ${consulta.paciente} <br>
            <strong>Fecha:</strong> ${consulta.fecha} <br>
            <strong>Diagnóstico:</strong> ${consulta.diagnostico} <br>
            <strong>Doctor:</strong> ${consulta.nombreDoctor} <br>
            <a href="${consulta.tratamiento}" target="_blank">Ver Tratamiento</a>
            <br>
            <button class="delete-consult-button" onclick="eliminarConsulta('${consulta.id}')">Eliminar</button>
        `;
        listaConsultas.appendChild(item);
    });
}

function editarPaciente(id) {
    let paciente = pacientes.find(p => p.id === id);
    if (paciente) {
        let nuevoNombre = prompt("Nuevo nombre:", paciente.nombre);
        let nuevaEdad = prompt("Nueva edad:", paciente.edad);
        let nuevoHistorial = prompt("Nuevo historial:", paciente.historial);
        let nuevoContacto = prompt("Nuevo contacto:", paciente.contacto);

        paciente.nombre = nuevoNombre;
        paciente.edad = nuevaEdad;
        paciente.historial = nuevoHistorial;
        paciente.contacto = nuevoContacto;

        localStorage.setItem('pacientes', JSON.stringify(pacientes)); // Actualizar en localStorage
        mostrarPacientes();
    }
}

function eliminarPaciente(id) {
    pacientes = pacientes.filter(p => p.id !== id);
    consultas = consultas.filter(c => c.idPaciente !== id); // También elimina consultas asociadas
    localStorage.setItem('pacientes', JSON.stringify(pacientes)); // Actualizar en localStorage
    localStorage.setItem('consultas', JSON.stringify(consultas)); // Actualizar en localStorage
    mostrarPacientes();
    mostrarConsultas();
}

function editarConsulta(id) {
    let consulta = consultas.find(c => c.id === id);
    if (consulta) {
        let nuevaFecha = prompt("Nueva fecha:", consulta.fecha);
        let nuevoMedico = prompt("Nuevo médico:", consulta.nombreDoctor);
        let nuevoDiagnostico = prompt("Nuevo diagnóstico:", consulta.diagnostico);
        let nuevoTratamiento = prompt("Nuevo tratamiento:", consulta.tratamiento);

        consulta.fecha = nuevaFecha;
        consulta.nombreDoctor = nuevoMedico;
        consulta.diagnostico = nuevoDiagnostico;
        consulta.tratamiento = nuevoTratamiento;

        localStorage.setItem('consultas', JSON.stringify(consultas)); // Actualizar en localStorage
        mostrarConsultas();
    }
}

function eliminarConsulta(id) {
    consultas = consultas.filter(c => c.id !== id);
    localStorage.setItem('consultas', JSON.stringify(consultas)); // Actualizar en localStorage
    mostrarConsultas();
}

function buscarPaciente() {
    let busqueda = document.getElementById("buscarPaciente").value.toLowerCase();
    let listaFiltrada = pacientes.filter(p => 
        p.nombre.toLowerCase().includes(busqueda) || p.id.includes(busqueda)
    );
    
    // Mostrar los pacientes filtrados
    let lista = document.getElementById("listaPacientes");
    lista.innerHTML = "";
    listaFiltrada.forEach(p => {
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>${p.nombre}</strong> - ${p.edad} años - ID: ${p.id} <br>
            <strong>Historial:</strong> <a href="${p.historial}" target="_blank" rel="noopener noreferrer">Abrir PDF</a> <br>
            <strong>Número de Contacto:</strong> ${p.contacto} <br>
            <button class="edit-patient-button" onclick="editarPaciente('${p.id}')">Editar</button>
            <button class="delete-patient-button" onclick="eliminarPaciente('${p.id}')">Eliminar</button>
        `;
        lista.appendChild(li);
    });
}

function buscarConsulta() {
    let busqueda = document.getElementById("buscarConsulta").value.toLowerCase();
    let listaFiltrada = consultas.filter(c => 
        c.idPaciente.includes(busqueda) // Buscar por ID de paciente
    );
    
    // Mostrar las consultas filtradas
    let lista = document.getElementById("listaConsultas");
    lista.innerHTML = "";
    listaFiltrada.forEach(c => {
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>ID Paciente:</strong> ${c.idPaciente} <br>
            <strong>Paciente:</strong> ${c.paciente} <br>
            <strong>Fecha:</strong> ${c.fecha} <br>
            <strong>Diagnóstico:</strong> ${c.diagnostico} <br>
            <strong>Doctor:</strong> ${c.nombreDoctor} <br>
            <a href="${c.tratamiento}" target="_blank">Ver Tratamiento</a>
            <br>
            <button class="delete-consult-button" onclick="eliminarConsulta('${c.id}')">Eliminar</button>
        `;
        lista.appendChild(li);
    });
}
