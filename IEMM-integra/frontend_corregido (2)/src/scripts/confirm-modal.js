// Modal de confirmación reutilizable para acciones de eliminar. Se
// autoinicializa al importarse (inyecta su propio markup/estilos una sola
// vez: los módulos ES son singletons, así que aunque varias páginas lo
// importen, este código corre una única vez por carga de página).

let callbackPendiente = null;

function cerrar(aceptado) {
    document.getElementById("mm-confirm-overlay").classList.remove("visible");
    if (aceptado && typeof callbackPendiente === "function") callbackPendiente();
    callbackPendiente = null;
}

function inicializar() {
    const estilos = document.createElement("style");
    estilos.textContent =
        "#mm-confirm-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;" +
        "background:rgba(0,0,0,.55);z-index:99999;justify-content:center;align-items:center}" +
        "#mm-confirm-overlay.visible{display:flex}" +
        "#mm-confirm-box{background:#fff;border-radius:12px;padding:36px 32px 28px;" +
        "max-width:400px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,.28);text-align:center}" +
        "#mm-confirm-icono{font-size:2.6rem;margin-bottom:14px}" +
        "#mm-confirm-titulo{font-size:1.15rem;font-weight:700;color:#1a1a2e;margin-bottom:10px}" +
        "#mm-confirm-mensaje{font-size:.93rem;color:#555;margin-bottom:28px;line-height:1.55}" +
        "#mm-confirm-botones{display:flex;gap:12px;justify-content:center}" +
        "#mm-confirm-botones button{padding:10px 26px;border:none;border-radius:7px;" +
        "font-size:.95rem;font-weight:600;cursor:pointer}" +
        "#mm-btn-cancelar{background:#e8e8ee;color:#444}" +
        "#mm-btn-eliminar{background:#c0392b;color:#fff}";
    document.head.appendChild(estilos);

    const overlay = document.createElement("div");
    overlay.id = "mm-confirm-overlay";
    overlay.innerHTML =
        '<div id="mm-confirm-box">' +
          '<div id="mm-confirm-icono">&#128465;&#65039;</div>' +
          '<div id="mm-confirm-titulo">Confirmar eliminación</div>' +
          '<div id="mm-confirm-mensaje"></div>' +
          '<div id="mm-confirm-botones">' +
            '<button id="mm-btn-cancelar">Cancelar</button>' +
            '<button id="mm-btn-eliminar">Eliminar</button>' +
          '</div>' +
        '</div>';
    document.body.appendChild(overlay);

    document.getElementById("mm-btn-cancelar").addEventListener("click", function () { cerrar(false); });
    document.getElementById("mm-btn-eliminar").addEventListener("click", function () { cerrar(true); });
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) cerrar(false);
    });
}

inicializar();

export function confirmarEliminar(mensaje, callback) {
    callbackPendiente = callback;
    document.getElementById("mm-confirm-mensaje").textContent =
        mensaje || "¿Estás seguro de que deseas eliminar este elemento?";
    document.getElementById("mm-confirm-overlay").classList.add("visible");
}
