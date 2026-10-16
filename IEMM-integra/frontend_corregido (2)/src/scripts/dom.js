// Llena un <select> con <option> generadas a partir de un arreglo (típicamente
// la respuesta de un GET a la API). `campoValor`/`campoTexto` son los nombres
// de campo del objeto a usar como value/texto visible.
export function poblarSelect(selectEl, items, campoValor, campoTexto, opcionVacia) {
    selectEl.innerHTML = "";
    if (opcionVacia !== undefined) {
        const optVacia = document.createElement("option");
        optVacia.value = "";
        optVacia.textContent = opcionVacia;
        selectEl.appendChild(optVacia);
    }
    (items || []).forEach(function (item) {
        const opt = document.createElement("option");
        opt.value = item[campoValor];
        opt.textContent = item[campoTexto];
        selectEl.appendChild(opt);
    });
}
