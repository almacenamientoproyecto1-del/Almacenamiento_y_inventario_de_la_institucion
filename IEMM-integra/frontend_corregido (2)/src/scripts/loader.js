// Loader de pantalla completa reutilizado en dos momentos:
//   1) Al hacer click en un link de navegación interno (nav, accesos
//      rápidos, etc.) se muestra de inmediato, antes de que el navegador
//      cargue la siguiente página.
//   2) En la página de destino, me.js lo deja visible mientras confirma la
//      sesión y lo oculta apenas termina (ver me.js).
// Se autoinicializa al importarse, igual que confirm-modal.js y logout.js.

function crearOverlaySiNoExiste() {
    let overlay = document.getElementById("mm-loader-overlay");
    if (overlay) return overlay;

    const estilos = document.createElement("style");
    estilos.textContent =
        "#mm-loader-overlay{position:fixed;inset:0;background:rgba(245,245,248,.92);" +
        "display:flex;align-items:center;justify-content:center;z-index:100000;" +
        "opacity:0;visibility:hidden;pointer-events:none;transition:opacity .15s ease}" +
        "#mm-loader-overlay.visible{opacity:1;visibility:visible;pointer-events:all}" +
        "#mm-loader-spinner{width:46px;height:46px;border:5px solid #dbe0ee;" +
        "border-top-color:#17356d;border-radius:50%;animation:mm-spin .75s linear infinite}" +
        "@keyframes mm-spin{to{transform:rotate(360deg)}}";
    document.head.appendChild(estilos);

    overlay = document.createElement("div");
    overlay.id = "mm-loader-overlay";
    overlay.innerHTML = '<div id="mm-loader-spinner"></div>';
    document.body.appendChild(overlay);
    return overlay;
}

export function mostrarLoader() {
    crearOverlaySiNoExiste().classList.add("visible");
}

export function ocultarLoader() {
    const overlay = document.getElementById("mm-loader-overlay");
    if (overlay) overlay.classList.remove("visible");
}

crearOverlaySiNoExiste();

// Muestra el loader al hacer click en cualquier <a> que navegue a otra
// página del sitio (nav, accesos rápidos, etc.). Ignora links externos,
// anclas (#...), mailto/tel, los que abren en pestaña nueva y los clicks
// modificados (click derecho, ctrl+click, etc. abren en pestaña aparte).
document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (link.target === "_blank") return;

    mostrarLoader();
});
