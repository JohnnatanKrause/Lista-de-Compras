let dadosPorCategoria = {};
let dadosOriginais = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch("itens.json")
        .then((response) => response.json())
        .then((data) => {
            dadosOriginais = data;

            // Agrupa os itens por categoria
            data.forEach((item) => {
                if (!dadosPorCategoria[item.categoria]) {
                    dadosPorCategoria[item.categoria] = [];
                }
                dadosPorCategoria[item.categoria].push(item);
            });

            // Renderiza os cards de categoria
            renderizarCategorias();
        });
});

function renderizarCategorias() {
    const categoriasDiv = document.getElementById("categorias");
    categoriasDiv.innerHTML = "";

    Object.keys(dadosPorCategoria).forEach((categoria) => {
        const card = document.createElement("div");
        card.classList.add("categoria-card");
        card.innerHTML = `
        <img src="${categoria}.png" alt="" />
        
    `;
        card.addEventListener("click", () => exibirItensDaCategoria(categoria));
        categoriasDiv.appendChild(card);
    });

    document.getElementById("categorias").style.display = "flex";
    document.getElementById("itensDaCategoria").style.display = "none";
}

function exibirItensDaCategoria(categoria) {
    const lista = document.getElementById("lista");
    const titulo = document.getElementById("tituloCategoria");

    titulo.textContent = `🧾 ${categoria}`;
    lista.innerHTML = "";

    dadosPorCategoria[categoria].forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("lista-item");

        const idCheckbox = `chk-${categoria}-${index}`;

        const container = document.createElement("div");
        container.classList.add("item-container");

        container.innerHTML = `
      <input type="checkbox" id="${idCheckbox}" data-nome="${item.nome}" data-unidade="${item.unidade || 'un'}">
      <label for="${idCheckbox}">${item.nome} (${item.unidade || "un"})</label>
      <div class="quantidade-wrap" style="display: none;">
        <button class="diminuir">−</button>
        <input type="number" value="1" min="1">
        <button class="aumentar">+</button>
      </div>
    `;

        const checkbox = container.querySelector("input[type=checkbox]");
        const quantidadeWrap = container.querySelector(".quantidade-wrap");
        const inputQuantidade = quantidadeWrap.querySelector("input");

        checkbox.addEventListener("change", function () {
            quantidadeWrap.style.display = this.checked ? "flex" : "none";
        });

        quantidadeWrap.querySelector(".aumentar").addEventListener("click", () => {
            inputQuantidade.value = parseInt(inputQuantidade.value) + 1;
        });

        quantidadeWrap.querySelector(".diminuir").addEventListener("click", () => {
            if (parseInt(inputQuantidade.value) > 1) {
                inputQuantidade.value = parseInt(inputQuantidade.value) - 1;
            }
        });

        li.appendChild(container);
        lista.appendChild(li);
    });

    document.getElementById("categorias").style.display = "none";
    document.getElementById("itensDaCategoria").style.display = "block";
}

function voltarParaCategorias() {
    renderizarCategorias();
}

function enviarWhatsApp() {
    const selecionados = document.querySelectorAll(
        "#itensDaCategoria input[type=checkbox]:checked"
    );
    let mensagem = "*Minha Lista de Compras*\n\n";

    selecionados.forEach((checkbox) => {
        const nome = checkbox.dataset.nome;
        const unidade = checkbox.dataset.unidade || "un";
        const quantidade =
            checkbox.parentNode.querySelector("input[type=number]").value;

        mensagem += `- ${nome} (${quantidade} ${unidade})\n`;
    });

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}
